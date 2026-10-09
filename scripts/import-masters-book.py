#!/usr/bin/env python3
"""Convert Master's Book PDF into native SAT-PREP question data and figures."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import fitz


SECTIONS = [
    {"id": "verbals", "title": "词汇题", "subtitle": "Verbals", "start": 4, "end": 16},
    {"id": "fsp", "title": "目的题", "subtitle": "Function, Structure, Purpose", "start": 17, "end": 39},
    {"id": "cross-texts", "title": "双篇题", "subtitle": "Cross-Texts", "start": 40, "end": 53},
    {"id": "support-weaken", "title": "循证题", "subtitle": "Support / Weaken", "start": 54, "end": 78},
    {"id": "quantitatives", "title": "图表题", "subtitle": "Quantitatives", "start": 79, "end": 106},
    {"id": "inference", "title": "推断题", "subtitle": "Inference", "start": 107, "end": 137},
    {"id": "literature", "title": "复杂句与文学", "subtitle": "Complex Sentences / Literature", "start": 147, "end": 157},
]

START_RE = re.compile(r"^(\d+)\.\s*(.*)$")
OPTION_LINE_RE = re.compile(r"^([A-D])\.\s*(.*)$")


def clean_text(text: str) -> str:
    text = text.replace("\u00a0", " ").replace("\uf0b7", "•")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def page_lines(page: fitz.Page, page_number: int) -> list[dict]:
    lines: list[dict] = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block["lines"]:
            text = clean_text("".join(span["text"] for span in line["spans"]))
            if not text or text == str(page_number):
                continue
            first = line["spans"][0]
            lines.append(
                {
                    "text": text,
                    "page": page_number,
                    "y": float(first["bbox"][1]),
                    "size": float(first["size"]),
                    "bold": bool(first["flags"] & 16),
                }
            )
    return sorted(lines, key=lambda item: (item["y"], item["text"]))


def is_question_start(line: dict) -> bool:
    match = START_RE.match(line["text"])
    if line["size"] >= 20 or match is None:
        return False
    # Several later chapters use plain Times New Roman for a standalone
    # question number, while titled questions use a bold number-and-title line.
    return line["bold"] or not match.group(2)


def split_question(lines: list[dict]) -> tuple[str, str, list[str]]:
    if not lines:
        return "", "", []

    option_start = None
    for index, line in enumerate(lines):
        match = OPTION_LINE_RE.match(line["text"])
        if match and match.group(1) == "A":
            option_start = index
            break

    if option_start is None:
        raw = clean_text(" ".join(line["text"] for line in lines))
        matches = list(re.finditer(r"(?:^|\s)([A-D])\.\s*", raw))
        sequence = []
        for match in matches:
            if ord(match.group(1)) - ord("A") == len(sequence):
                sequence.append(match)
                if len(sequence) == 4:
                    break
        if len(sequence) != 4:
            return raw, "", []
        options = []
        for idx, match in enumerate(sequence):
            end = sequence[idx + 1].start() if idx < 3 else len(raw)
            options.append(clean_text(raw[match.end():end]))
        before_text = clean_text(raw[:sequence[0].start()])
        prompt_matches = list(re.finditer(r"(?:Which|Based on|According to|The text|What|How)\b", before_text))
        if prompt_matches:
            prompt_start = prompt_matches[-1].start()
            return clean_text(before_text[:prompt_start]), clean_text(before_text[prompt_start:]), options
        return before_text, "", options

    before = lines[:option_start]
    options: list[str] = []
    active_option = -1
    for line in lines[option_start:]:
        fragments = re.split(r"\s+(?=[B-D]\.\s+[A-Z\"'])", line["text"])
        for fragment in fragments:
            match = OPTION_LINE_RE.match(fragment)
            if match:
                letter_index = ord(match.group(1)) - ord("A")
                if letter_index == active_option + 1 and letter_index < 4:
                    options.append(clean_text(match.group(2)))
                    active_option = letter_index
                    continue
            if 0 <= active_option < 4:
                options[active_option] = clean_text(f"{options[active_option]} {fragment}")

    prompt_start = len(before)
    while prompt_start > 0 and before[prompt_start - 1]["bold"]:
        prompt_start -= 1

    content = clean_text(" ".join(line["text"] for line in before[:prompt_start]))
    prompt = clean_text(" ".join(line["text"] for line in before[prompt_start:]))
    return content, prompt, options


def extract_figure(page: fitz.Page, clip: fitz.Rect, output_path: Path) -> bool:
    if clip.width < 40 or clip.height < 40:
        return False
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(output_path)
    return True


def build_section(pdf: fitz.Document, section: dict, figures_dir: Path) -> dict:
    starts: list[dict] = []
    all_lines: list[dict] = []
    image_blocks: list[dict] = []

    for page_number in range(section["start"], section["end"] + 1):
        page = pdf[page_number - 1]
        lines = page_lines(page, page_number)
        for line in lines:
            if line["size"] >= 20:
                continue
            all_lines.append(line)
            if is_question_start(line):
                match = START_RE.match(line["text"])
                assert match
                number = int(match.group(1))
                title = match.group(2)
                if line["bold"] or title or not starts or number == int(START_RE.match(starts[-1]["text"]).group(1)) + 1:
                    starts.append(line)
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") == 1:
                image_blocks.append({"page": page_number, "bbox": list(block["bbox"])})

    # The source omits the printed number for the final literature question.
    # Insert its known boundary so it remains a separate native question.
    if section["id"] == "literature":
        marker = next(
            (line for line in all_lines if line["text"].startswith("For its 2022 exhibition Guarding the Art")),
            None,
        )
        if marker:
            starts.append({**marker, "text": "20.", "bold": True, "y": marker["y"] - 0.2})
            starts.sort(key=lambda item: (item["page"], item["y"]))

    questions: list[dict] = []
    for index, start in enumerate(starts):
        next_start = starts[index + 1] if index + 1 < len(starts) else None
        question_lines = []
        for line in all_lines:
            after_start = line["page"] > start["page"] or (
                line["page"] == start["page"] and line["y"] > start["y"] + 0.1
            )
            before_next = next_start is None or line["page"] < next_start["page"] or (
                line["page"] == next_start["page"] and line["y"] < next_start["y"] - 0.1
            )
            if after_start and before_next:
                question_lines.append(line)

        match = START_RE.match(start["text"])
        assert match
        original_number, source_title = match.groups()
        content, prompt, options = split_question(question_lines)
        figure_paths: list[str] = []

        for image_index, image in enumerate(image_blocks):
            page_number = image["page"]
            if page_number < start["page"] or (next_start and page_number > next_start["page"]):
                continue
            rect = fitz.Rect(image["bbox"])
            if page_number == start["page"] and rect.y1 <= start["y"]:
                continue
            if next_start and page_number == next_start["page"] and rect.y0 >= next_start["y"]:
                continue
            name = f"{section['id']}-{index + 1:03d}-{image_index + 1}.png"
            destination = figures_dir / name
            if extract_figure(pdf[page_number - 1], rect, destination):
                figure_paths.append(f"/masters-book/figures/{name}")

        # Many graphs and tables in the quantitative chapter are vectors rather
        # than embedded bitmap images. Crop only the figure area before the
        # first long prose line so the site retains the data visualization while
        # rendering the passage, prompt, and choices as native HTML text.
        if section["id"] == "quantitatives" and not figure_paths:
            first_page_lines = [line for line in question_lines if line["page"] == start["page"]]
            prose_line = next(
                (
                    line
                    for line in first_page_lines
                    if not line["bold"] and len(line["text"]) >= 70 and line["y"] > start["y"] + 60
                ),
                None,
            )
            if prose_line:
                page = pdf[start["page"] - 1]
                clip = fitz.Rect(45, start["y"] + 20, page.rect.width - 45, prose_line["y"] - 8)
                name = f"{section['id']}-{index + 1:03d}-vector.png"
                destination = figures_dir / name
                if extract_figure(page, clip, destination):
                    figure_paths.append(f"/masters-book/figures/{name}")

        questions.append(
            {
                "id": f"{section['id']}-{index + 1}",
                "number": index + 1,
                "sourceNumber": int(original_number),
                "title": source_title or f"第 {index + 1} 题",
                "content": content,
                "question": prompt,
                "options": options,
                "figures": figure_paths,
                "sourcePage": start["page"],
            }
        )

    return {
        "id": section["id"],
        "title": section["title"],
        "subtitle": section["subtitle"],
        "sourcePages": [section["start"], section["end"]],
        "questions": questions,
    }


def extract_notes(pdf: fitz.Document) -> list[dict]:
    pages = []
    for page_number in range(138, 147):
        lines = [line for line in page_lines(pdf[page_number - 1], page_number) if line["size"] < 20]
        pages.append(
            {
                "page": page_number,
                "content": clean_text("\n".join(line["text"] for line in lines)),
            }
        )
    return pages


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("figures", type=Path)
    args = parser.parse_args()

    pdf = fitz.open(args.pdf)
    args.figures.mkdir(parents=True, exist_ok=True)
    for old_figure in args.figures.glob("*.png"):
        old_figure.unlink()

    sections = [build_section(pdf, section, args.figures) for section in SECTIONS]
    sections.insert(
        6,
        {
            "id": "other",
            "title": "其他考点",
            "subtitle": "Other Key Points",
            "sourcePages": [138, 146],
            "notes": extract_notes(pdf),
            "questions": [],
        },
    )

    payload = {
        "title": "大师之书",
        "subtitle": "Master's Book - 26 Spring",
        "totalSourcePages": len(pdf),
        "sections": sections,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    total = sum(len(section["questions"]) for section in sections)
    figures = sum(len(question.get("figures", [])) for section in sections for question in section["questions"])
    print(f"Wrote {total} questions, {len(sections)} sections, and {figures} figures")


if __name__ == "__main__":
    main()
