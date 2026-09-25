/*
 * Veritas question-bank collector.
 *
 * Run this in the browser console on an already-open Veritas preview/detail page.
 * It reads visible question content, clicks numbered question navigation items,
 * and downloads a JSON file. It does not read or store credentials, cookies, or
 * tokens.
 */
(() => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const textOf = (node) => (node?.innerText || node?.textContent || '').replace(/\s+/g, ' ').trim();
  const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };

  const visibleElements = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector)).filter(isVisible);

  const dedupe = (items) => Array.from(new Set(items.map(clean).filter(Boolean)));

  const looksLikeOption = (value) => /^[A-D][\s).:：]/i.test(clean(value));
  const stripOptionPrefix = (value) => clean(value).replace(/^[A-D][\s).:：]+/i, '').trim();

  const scoreContainer = (el) => {
    const text = textOf(el);
    const rect = el.getBoundingClientRect();
    let score = 0;
    if (/Question\s*\d+/i.test(text) || /第\s*\d+\s*题/.test(text)) score += 4;
    if (/Correct Answer|正确答案|Answer|解析|Explanation|题目解析/i.test(text)) score += 3;
    if (text.match(/\b[A-D][\s).:：]/g)?.length >= 2) score += 3;
    if (rect.width > window.innerWidth * 0.35) score += 1;
    if (rect.height > window.innerHeight * 0.25) score += 1;
    return score;
  };

  const findQuestionRoot = () => {
    const candidates = visibleElements('main, section, article, [class], body')
      .filter((el) => textOf(el).length > 80)
      .sort((a, b) => scoreContainer(b) - scoreContainer(a));
    return candidates[0] || document.body;
  };

  const findQuestionNavItems = () => {
    const candidates = visibleElements('button, li, [role="button"], [class*="question"], [class*="num"], [class*="item"]');
    const numbered = candidates
      .map((el) => {
        const text = textOf(el);
        const match = text.match(/^\(?0?(\d{1,2})\)?(?:\s|$)/) || text.match(/^(\d{1,2})$/);
        if (!match) return null;
        const number = Number(match[1]);
        if (!Number.isInteger(number) || number < 1 || number > 60) return null;
        return { el, number, text };
      })
      .filter(Boolean);

    const seen = new Map();
    for (const item of numbered) {
      if (!seen.has(item.number)) seen.set(item.number, item);
    }
    return Array.from(seen.values()).sort((a, b) => a.number - b.number);
  };

  const inferActiveNumber = (rootText) => {
    const match =
      rootText.match(/Question\s*(\d+)/i) ||
      rootText.match(/第\s*(\d+)\s*题/) ||
      rootText.match(/\((\d{1,2})\)/);
    return match ? Number(match[1]) : null;
  };

  const findImages = (root) =>
    visibleElements('img, svg, canvas', root).map((el) => {
      if (el.tagName.toLowerCase() === 'img') {
        return {
          type: 'img',
          src: el.currentSrc || el.src || el.getAttribute('src') || '',
          alt: el.getAttribute('alt') || '',
        };
      }
      return {
        type: el.tagName.toLowerCase(),
        src: '',
        alt: textOf(el).slice(0, 120),
      };
    });

  const findTable = (root) => {
    const table = visibleElements('table', root)[0];
    if (!table) return null;
    const grid = Array.from(table.querySelectorAll('tr'))
      .map((tr) => Array.from(tr.querySelectorAll('th, td')).map(textOf).filter(Boolean))
      .filter((cells) => cells.length > 1);
    if (grid.length < 2) return null;
    return {
      title: textOf(table.querySelector('caption')) || undefined,
      headers: grid[0],
      rows: grid.slice(1),
    };
  };

  const findCorrectAnswer = (root) => {
    const text = textOf(root);
    const labelMatch =
      text.match(/正确答案\s*[:：]?\s*([A-D])/i) ||
      text.match(/Correct Answer\s*[:：]?\s*([A-D])/i) ||
      text.match(/Answer\s*[:：]?\s*([A-D])/i);
    if (labelMatch) return labelMatch[1].toUpperCase();

    const candidates = visibleElements('button, div, li, p, span', root);
    for (const el of candidates) {
      const optionText = textOf(el);
      if (!looksLikeOption(optionText)) continue;
      const className = String(el.className || '').toLowerCase();
      const style = getComputedStyle(el);
      const marksCorrect =
        /correct|right|success|green/.test(className) ||
        style.color.includes('rgb(22, 101, 52)') ||
        style.backgroundColor.includes('rgb(240, 253, 244)');
      if (marksCorrect) return optionText.match(/^([A-D])/i)?.[1]?.toUpperCase() || null;
    }
    return null;
  };

  const extractCurrentQuestion = () => {
    const root = findQuestionRoot();
    const text = textOf(root);
    const optionNodes = visibleElements('button, label, li, .option, [class*="option"], [class*="answer"]', root);
    const options = dedupe(optionNodes.map(textOf).filter(looksLikeOption)).slice(0, 8);
    const optionBodies = options.map(stripOptionPrefix);
    const answerLetter = findCorrectAnswer(root);
    const answer = answerLetter ? answerLetter.charCodeAt(0) - 65 : null;

    // Keep the option-letter lookahead case-sensitive: with /i, a plain " a "
    // inside the prose ("...quotation from a town mayor...") looks like option A
    // and truncates the stem.
    const questionMatch =
      text.match(/[Qq]uestion\s*\d+\s*(.*?)(?=\s+[A-D][\s).:：])/) ||
      text.match(/第\s*\d+\s*题\s*(.*?)(?=\s+[A-D][\s).:：])/);
    const question = clean(questionMatch?.[1] || '');

    const explanationMatch =
      text.match(/(?:题目解析|答案解析|解析|Explanation)\s*[:：]?\s*(.+)$/i);

    return {
      number: inferActiveNumber(text),
      question,
      options: optionBodies,
      answer,
      answerLetter,
      explanation: clean(explanationMatch?.[1] || ''),
      images: findImages(root),
      table: findTable(root),
      rawText: text,
      sourceUrl: location.href,
      capturedAt: new Date().toISOString(),
    };
  };

  const inferSetLabel = () => {
    const text = textOf(document.body);
    const patterns = [
      /系统题库\s*详情\s*SAT机考\s*(SAT CMP[^\n]*?Module\s*\d+(?:\s*\([^)]+\))?)/i,
      /(SAT CMP[^\n]*?Module\s*\d+(?:\s*\([^)]+\))?)/i,
      /([A-Z][A-Z0-9]{1,}[-\w]*\s*\/\s*Module\s*\d+(?:\s*\([^)]+\))?)/,
    ];
    for (const re of patterns) {
      const match = text.match(re);
      if (match) return clean(match[1]);
    }
    return '';
  };

  // document.title is unreliable here: on the list page it resolves to widget text
  // ("二维码", "登录" ...), which is how downloads ended up named 二维码 (3).json.
  const usableTitle = () => {
    const title = clean(document.title);
    return title.length >= 6 && !/二维码|登录|首页|系统题库/.test(title) ? title : '';
  };

  const toFileName = (label) =>
    label
      .replace(/[^\w一-鿿.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90);

  const MIN_STEM_LENGTH = 25;

  const healthReport = (questions) => {
    const missingAnswers = [];
    const missingOptions = [];
    const shortStems = [];
    let tableCount = 0;

    questions.forEach((q, index) => {
      const number = q.number || index + 1;
      if (!q.answerLetter && !Number.isInteger(q.answer)) missingAnswers.push(number);
      if ((q.options || []).length < 4) missingOptions.push(number);
      if (clean(q.question).length < MIN_STEM_LENGTH) shortStems.push(number);
      if (q.table) tableCount++;
    });

    return { total: questions.length, missingAnswers, missingOptions, shortStems, tableCount };
  };

  const printHealth = (health) => {
    const { total, missingAnswers, missingOptions, shortStems } = health;
    console.log(
      `体检：${total} 题 | 缺答案 ${missingAnswers.length} | 选项不足 ${missingOptions.length} | ` +
        `题干过短 ${shortStems.length} | 抓到表格 ${health.tableCount}`,
    );

    if (missingAnswers.length) {
      console.warn(
        `⚠️ 第 ${missingAnswers.join(', ')} 题没抓到答案 —— 采集前请先打开「显示答案」。`,
      );
    }
    if (missingOptions.length) {
      console.warn(
        `⚠️ 第 ${missingOptions.join(', ')} 题选项不足 4 个，可能是没渲染完 —— ` +
          '用 collect({ delayMs: 1500 }) 加大等待再试。',
      );
    }
    if (shortStems.length) {
      console.warn(
        `⚠️ 第 ${shortStems.join(', ')} 题题干短得可疑，可能被截断了 —— 交给我检查这几题。`,
      );
    }
    if (total && !missingAnswers.length && !missingOptions.length && !shortStems.length) {
      console.log('✅ 体检通过：答案齐全、选项完整、题干正常。');
    }
  };

  const downloadJson = (payload, filename) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const collect = async ({ delayMs = 900, maxQuestions = 60 } = {}) => {
    const label = inferSetLabel() || usableTitle();
    const title = label || 'veritas-question-set';
    const navItems = findQuestionNavItems().slice(0, maxQuestions);
    const questions = [];

    if (navItems.length === 0) {
      questions.push(extractCurrentQuestion());
    } else {
      for (const item of navItems) {
        item.el.scrollIntoView({ block: 'center', inline: 'nearest' });
        item.el.click();
        await sleep(delayMs);
        const record = extractCurrentQuestion();
        record.number = record.number || item.number;
        record.navText = item.text;
        questions.push(record);
      }
    }

    const payload = {
      schema: 'veritas-question-bank.v1',
      title,
      sourceUrl: location.href,
      capturedAt: new Date().toISOString(),
      count: questions.length,
      questions,
    };
    const base = toFileName(title) || 'veritas-question-set';
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
    downloadJson(payload, label ? `${base}.json` : `${base}-${stamp}.json`);
    console.log(`\u5df2\u4e0b\u8f7d\uff1a${label || '(\u672a\u8bc6\u522b\u51fa\u5957\u9898\u540d)'} \u00b7 ${questions.length} \u9898`);
    printHealth(healthReport(questions));
    return payload;
  };

  const listSets = () => {
    const cards = visibleElements('div, li, article, section')
      .filter((el) => {
        const text = textOf(el);
        const rect = el.getBoundingClientRect();
        return rect.width > 250 && rect.height > 100 && /SAT|Module|题目数|预览|查看/i.test(text);
      })
      .map((el) => {
        const text = textOf(el);
        const title =
          text.match(/SAT[^预览查看题目数参与正确率中位分]+(?:Module\s*\d+(?:\s*\([^)]+\))?)?/i)?.[0] ||
          text.split(/\s{2,}|题目数|参与数|正确率/)[0];
        const links = visibleElements('a', el).map((a) => ({
          text: textOf(a),
          href: a.href,
        }));
        const buttons = visibleElements('button, [role="button"]', el).map(textOf).filter(Boolean);
        return {
          title: clean(title),
          text,
          links,
          buttons,
        };
      });
    return cards.filter((card, index, arr) => {
      const key = `${card.title}:${card.text.slice(0, 80)}`;
      return arr.findIndex((other) => `${other.title}:${other.text.slice(0, 80)}` === key) === index;
    });
  };

  window.VeritasQuestionCollector = { collect, extractCurrentQuestion, findQuestionNavItems, listSets };
  console.log('VeritasQuestionCollector is ready. Run: await VeritasQuestionCollector.collect()');
})();
