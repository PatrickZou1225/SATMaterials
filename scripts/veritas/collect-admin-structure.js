/*
 * Veritas 后台结构导出（只读界面结构）
 *
 * 在已登录的后台页面打开 DevTools Console，粘贴本文件全部内容，然后：
 *   VeritasAdminScan.download()        // 输出当前页面的信息架构并下载 JSON
 *   VeritasAdminScan.describe()        // 同上，但只在控制台打印，不下载
 *
 * 输出的内容用于设计 SAT Prep 教学后台的信息架构参考：
 * 导航、筛选项、表头、表单字段、标签页。**不导出学生姓名、手机号、
 * 邮箱、成绩等个人数据**——个人数据在 Veritas 后台只作流程参考，
 * 不复制进 SAT Prep。
 */
(() => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  // 个人数据过滤：邮箱、11 位手机号、纯数字长串一律不采集。
  const PII = /@|(?:\d[\s-]?){9,}/;
  const label = (value) => {
    const text = clean(value);
    if (!text || PII.test(text)) return '';
    return text.slice(0, 60);
  };

  const isVisible = (el) => {
    if (!el || !(el instanceof Element)) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };

  // 小鹅通后台把内容放在 iframe 里，且导航未必是 <nav>。
  // 所以扫所有同源 iframe + 用大范围选择器。
  const docs = () => {
    const list = [document];
    for (const frame of document.querySelectorAll('iframe, frame')) {
      try {
        if (frame.contentDocument) list.push(frame.contentDocument);
      } catch {
        /* 跨域 iframe，跳过 */
      }
    }
    return list;
  };

  const visible = (selector) =>
    docs().flatMap((doc) => Array.from(doc.querySelectorAll(selector))).filter(isVisible);

  const dedupe = (items) => Array.from(new Set(items.filter(Boolean)));

  const nav = () => dedupe([
    ...visible('nav a, nav button, aside a, aside button, header a, header button, [role="menu"] a, [role="menuitem"]')
      .map((el) => label(el.innerText || el.textContent)),
  ]);

  const headings = () => dedupe(visible('h1, h2, h3, h4').map((el) => label(el.innerText)));

  const tabs = () => dedupe([
    ...visible('[role="tab"], .el-tabs__item, .ant-tabs-tab, [class*="tab"]')
      .filter((el) => clean(el.innerText).length <= 20)
      .map((el) => label(el.innerText)),
  ]);

  const filters = () => {
    const inputs = visible('input, textarea')
      .map((el) => label(el.getAttribute('placeholder') || el.getAttribute('aria-label') || el.getAttribute('name')))
      .filter(Boolean);
    const selects = visible('select')
      .map((el) => {
        const options = Array.from(el.options).slice(0, 12).map((o) => label(o.text));
        return dedupe(options).join(' / ');
      })
      .filter(Boolean);
    // Element Plus / Ant Design 的虚拟下拉，不是原生 <select>
    const pickers = visible('[class*="select"] [class*="placeholder"], [class*="picker"] input');
    const pickerLabels = pickers.map((el) => label(el.innerText || el.getAttribute('placeholder'))).filter(Boolean);
    return { 输入框: dedupe([...inputs, ...pickerLabels]), 下拉: dedupe(selects) };
  };

  const buttons = () => dedupe(
    visible('button, [role="button"], a[class*="btn"]')
      .map((el) => label(el.innerText))
      .filter((text) => text && text.length <= 20),
  );

  const columns = () => dedupe(
    visible('table thead th, [role="columnheader"], [class*="table"] [class*="header"] [class*="cell"]')
      .map((el) => label(el.innerText || el.textContent)),
  );

  const formFields = () => dedupe([
    ...visible('label, legend, [class*="form-item"] > [class*="label"]')
      .map((el) => label(el.innerText)),
  ]).filter((text) => text && text.length <= 30);

  // 列表/卡片上出现的字段名（不含具体数值），例如「题目数」「正确率」
  const cardFields = () => dedupe([
    ...visible('[class*="card"], [class*="item"]')
      .slice(0, 40)
      .flatMap((el) => clean(el.innerText).split(/[\s·|]+/))
      .map((text) => label(text))
      .filter((text) => text && /数|率|分|时间|状态|人数|题|班|科目|来源|难度|名称/.test(text)),
  ]);

  // 导航/表头抓不到时的兜底：把可点击项的标签+class 打出来，
  // 从 class 名能看出用的是什么组件库、层级怎么分的。
  const outline = () => {
    const rows = visible('a, button, li, [class*="nav"], [class*="menu"], [class*="tab"], [class*="item"], [class*="card"], [class*="cate"]')
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        class: String(el.className || '').slice(0, 60),
        text: label(el.innerText),
      }))
      .filter((row) => row.text && row.text.length <= 24);
    const seen = new Set();
    return rows.filter((row) => {
      const key = `${row.class}|${row.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 80);
  };

  const describe = () => {
    const report = {
      页面标题: label(document.title),
      地址: location.href,
      同源iframe数: docs().length - 1,
      导航: nav(),
      标题: headings(),
      标签页: tabs(),
      筛选: filters(),
      按钮: buttons(),
      表格列: columns(),
      表单字段: formFields(),
      卡片字段: cardFields(),
      大纲: outline(),
    };
    console.log(JSON.stringify(report, null, 2));
    console.table(report);
    return report;
  };

  const toFileName = (label) =>
    `veritas-admin-${label}`.replace(/[^\w一-鿿.-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

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

  // 用地址路径给文件命名，例如 /admin/question/list → admin-question-list.json
  const download = () => {
    const report = describe();
    const slug = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'root';
    downloadJson(report, toFileName(slug) + '.json');
    console.log(`已下载：${toFileName(slug)}.json`);
    return report;
  };

  window.VeritasAdminScan = { download, describe, outline, nav, headings, tabs, filters, buttons, columns, formFields, cardFields };
  console.log('%cVeritasAdminScan 已就绪', 'color:#2563eb;font-weight:bold');
  console.log('用法：切到后台某个页面 → 运行 VeritasAdminScan.download() → 会在 ~/Downloads 生成一个 JSON');
  console.log('共四个页面建议各跑一次：题库列表 / 布置作业 / 作业结果 / 学员档案');
})();
