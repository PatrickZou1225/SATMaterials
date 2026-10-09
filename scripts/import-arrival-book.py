#!/usr/bin/env python3
"""Convert Arrival Book PDF into native SAT-PREP question data and figures."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import fitz


SECTIONS = [
    {"id": "verbals", "title": "词汇题", "subtitle": "Verbals", "start": 4, "end": 9},
    {"id": "fsp", "title": "目的题", "subtitle": "Function, Structure, Purpose", "start": 10, "end": 22},
    {"id": "support-weaken", "title": "循证题", "subtitle": "Support / Weaken", "start": 23, "end": 31},
    {"id": "graphs", "title": "图表题", "subtitle": "Graphs", "start": 32, "end": 42},
    {"id": "inference", "title": "推断题", "subtitle": "Inference", "start": 43, "end": 55},
    {"id": "main-idea", "title": "主旨题", "subtitle": "Main Idea", "start": 56, "end": 60},
    {"id": "quotations", "title": "例证题", "subtitle": "Quotations", "start": 61, "end": 71},
    {"id": "nuances", "title": "辨析", "subtitle": "Nuances", "start": 72, "end": 88},
]

START_RE = re.compile(r"^(\d+)\.\s*(.*)$")
OPTION_LINE_RE = re.compile(r'^([A-D])(?:\.\s*|\s+(?=["“]))(.*)$')


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\u00a0", " ").replace("\uf0b7", "•")).strip()


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
            lines.append({
                "text": text,
                "page": page_number,
                "y": float(first["bbox"][1]),
                "size": float(first["size"]),
                "bold": bool(first["flags"] & 16),
            })
    return sorted(lines, key=lambda item: (item["y"], item["text"]))


def is_question_start(line: dict) -> bool:
    match = START_RE.match(line["text"])
    if match is None or line["size"] >= 20 or not match.group(2):
        return False
    return True


def split_question(lines: list[dict]) -> tuple[str, str, list[str]]:
    if not lines:
        return "", "", []
    prompt_candidates = [
        index for index, line in enumerate(lines)
        if re.match(r"^(Which|Based on|According to|Taken together|The data|What|How)\b", line["text"])
    ]
    option_search_start = prompt_candidates[-1] + 1 if prompt_candidates else 0
    option_start = next((i for i, line in enumerate(lines[option_search_start:], option_search_start) if (match := OPTION_LINE_RE.match(line["text"])) and match.group(1) == "A"), None)
    if option_start is None:
        return clean_text(" ".join(line["text"] for line in lines)), "", []

    before = lines[:option_start]
    options: list[str] = []
    active = -1
    for line in lines[option_start:]:
        match = OPTION_LINE_RE.match(line["text"])
        if match:
            index = ord(match.group(1)) - ord("A")
            if index == active + 1 and index < 4:
                options.append(clean_text(match.group(2)))
                active = index
                continue
        if 0 <= active < 4:
            options[active] = clean_text(f"{options[active]} {line['text']}")

    prompt_start = len(before)
    while prompt_start > 0 and before[prompt_start - 1]["bold"]:
        prompt_start -= 1
    if prompt_start == len(before):
        if prompt_candidates:
            prompt_start = prompt_candidates[-1]
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
                if (not starts and number == 1) or number == 1 or number == int(START_RE.match(starts[-1]["text"]).group(1)) + 1:
                    starts.append(line)
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") == 1:
                image_blocks.append({"page": page_number, "bbox": list(block["bbox"])})

    questions: list[dict] = []
    for index, start in enumerate(starts):
        next_start = starts[index + 1] if index + 1 < len(starts) else None
        question_lines = [line for line in all_lines if
            (line["page"] > start["page"] or (line["page"] == start["page"] and line["y"] > start["y"] + 0.1)) and
            (next_start is None or line["page"] < next_start["page"] or (line["page"] == next_start["page"] and line["y"] < next_start["y"] - 0.1))]

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
            if extract_figure(pdf[page_number - 1], rect, figures_dir / name):
                figure_paths.append(f"/arrival-book/figures/{name}")

        if section["id"] == "graphs" and not figure_paths:
            first_page_lines = [line for line in question_lines if line["page"] == start["page"]]
            prose_line = next((line for line in first_page_lines if not line["bold"] and len(line["text"]) >= 70 and line["y"] > start["y"] + 45), None)
            if prose_line:
                page = pdf[start["page"] - 1]
                clip = fitz.Rect(40, start["y"] + 18, page.rect.width - 40, prose_line["y"] - 7)
                name = f"{section['id']}-{index + 1:03d}-vector.png"
                if extract_figure(page, clip, figures_dir / name):
                    figure_paths.append(f"/arrival-book/figures/{name}")

        questions.append({
            "id": f"{section['id']}-{index + 1}",
            "number": index + 1,
            "sourceNumber": int(original_number),
            "title": source_title or f"第 {index + 1} 题",
            "content": content,
            "question": prompt,
            "options": options,
            "figures": figure_paths,
            "sourcePage": start["page"],
        })

    return {
        "id": section["id"],
        "title": section["title"],
        "subtitle": section["subtitle"],
        "sourcePages": [section["start"], section["end"]],
        "questions": questions,
    }


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
    payload = {
        "title": "抵达之书",
        "subtitle": "SAT Arrival Book - 26 Revised",
        "totalSourcePages": len(pdf),
        "sections": sections,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(section["questions"]) for section in sections)
    figures = sum(len(question["figures"]) for section in sections for question in section["questions"])
    print(f"Wrote {total} questions, {len(sections)} sections, and {figures} figures")


if __name__ == "__main__":
    main()
