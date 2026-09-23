// A4 1枚で作る 8ページ ZINE の面付けと書き出し。
//   node build.mjs            → out/*.html, out/*.png（A4 横・300dpi）, out/*.pdf
//
// 折り方（印刷面を外にする）:
//   1. 横長のまま上下に二つ折り（印刷面が外）→ 開く
//   2. 左右に半分、さらに半分に折って 8 面の折り目をつける
//   3. 上下に二つ折りした状態で、折り目の真ん中（2・3列目）だけ切る
//   4. 開いて横長に戻し、両端を押し寄せると十字になる → 表紙が外に来るよう畳む
// この折り方だと、上段は逆さ（180°）で「5 4 3 2」、下段は「6 7 8 1」に並ぶ。
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "out");
mkdirSync(out, { recursive: true });
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 面付け: [上段 左→右], [下段 左→右]。上段は 180° 回す
const TOP = [5, 4, 3, 2];
const BOTTOM = [6, 7, 8, 1];

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CSS = `
  @page { size: 297mm 210mm; margin: 0; }
  :root{
    --blue:#244fc7; --ink:#203047; --muted:#53647b; --line:#d4e3f5;
    --yellow:#ffe680; --apricot:#ffc7af; --pale:#edf5ff;
    --maru:"Hiragino Maru Gothic ProN","Zen Maru Gothic",sans-serif;
    --sans:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif;
  }
  html,body{margin:0;background:#fff}
  body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;
       -webkit-print-color-adjust:exact;print-color-adjust:exact}
  .sheet{position:relative;width:297mm;height:210mm;overflow:hidden;
         display:grid;grid-template-columns:repeat(4,74.25mm);grid-template-rows:repeat(2,105mm)}
  .cell{position:relative;overflow:hidden}
  .cell.flip>.page{transform:rotate(180deg)}
  /* 1ページ = 74.25 × 105mm。事務所・家庭のプリンタは紙の端 4〜5mm を刷れない。
     色面を紙の端まで伸ばすと外側の辺だけ白く欠けて「余白ができた」ように見えるので、
     全ページの四辺（折り目側も）に同じ幅の白い縁を取り、色面はその内側のカードにする */
  .page{position:absolute;inset:var(--frame);box-sizing:border-box;padding:4.5mm 4mm;border-radius:2mm;
        display:flex;flex-direction:column;overflow:hidden}
  :root{--frame:5mm}
  .nombre{position:absolute;bottom:2.4mm;left:0;right:0;text-align:center;font-size:5.5pt;color:var(--muted);letter-spacing:.1em}
  p{margin:0}
  .phrase{word-break:auto-phrase;line-break:strict;text-wrap:pretty}

  /* 折り・切りのしるし。折り線は紙の端に短いトンボだけ、切るところは破線 */
  .guides{position:absolute;inset:0;pointer-events:none}
  .tick{position:absolute;background:#9aa9bb}
  .tick.v{width:.15mm;height:3mm}
  .tick.h{height:.15mm;width:3mm}
  .cut{position:absolute;top:calc(105mm - .1mm);left:74.25mm;width:148.5mm;border-top:.25mm dashed #7b8ba0}
  .cut-label{position:absolute;top:calc(105mm - 2.6mm);left:calc(148.5mm - 8mm);width:16mm;text-align:center;
             font-size:5pt;color:#7b8ba0;background:#fff;letter-spacing:.1em}
  .guides.full .fold{position:absolute;background:none}
  .guides.full .fold.v{top:0;bottom:0;border-left:.15mm dotted #b6c3d3}
  .guides.full .fold.h{left:0;right:0;border-top:.15mm dotted #b6c3d3}
`;

function guides(full) {
  const xs = [74.25, 148.5, 222.75];
  let g = "";
  for (const x of xs) g += `<i class="tick v" style="left:${x}mm;top:0"></i><i class="tick v" style="left:${x}mm;bottom:0"></i>`;
  g += `<i class="tick h" style="top:105mm;left:0"></i><i class="tick h" style="top:105mm;right:0"></i>`;
  if (full) {
    for (const x of xs) g += `<i class="fold v" style="left:${x}mm"></i>`;
    g += `<i class="fold h" style="top:105mm;left:0;width:74.25mm"></i><i class="fold h" style="top:105mm;left:222.75mm;width:74.25mm"></i>`;
  }
  g += `<i class="cut"></i><span class="cut-label">ここだけ切る</span>`;
  return `<div class="guides${full ? " full" : ""}">${g}</div>`;
}

// pages: { 1: {html, css?}, ... 8: {...} }。1 と 8 以外はノンブルを付ける
function sheet(pages, { fullGuides = false, nombre = true } = {}) {
  const cell = (n, flip) => {
    const p = pages[n] ?? { html: "" };
    const no = nombre && n !== 1 && n !== 8 ? `<div class="nombre">${n}</div>` : "";
    return `<div class="cell${flip ? " flip" : ""}"><div class="page p${n}" style="${p.style ?? ""}">${p.html}${no}</div></div>`;
  };
  return `<div class="sheet">${TOP.map(n => cell(n, true)).join("")}${BOTTOM.map(n => cell(n, false)).join("")}${guides(fullGuides)}</div>`;
}

// 読む順の確認用: 表紙｜2-3｜4-5｜6-7｜裏表紙 を回転なしで並べる
function readingOrder(pages) {
  const one = n => {
    const p = pages[n] ?? { html: "" };
    const no = n !== 1 && n !== 8 ? `<div class="nombre">${n}</div>` : "";
    return `<div class="cell" style="width:74.25mm;height:105mm;outline:.2mm solid #d4e3f5"><div class="page p${n}" style="${p.style ?? ""}">${p.html}${no}</div></div>`;
  };
  const row = ns => `<div style="display:flex;gap:0">${ns.map(one).join("")}</div>`;
  return `<div style="display:flex;flex-wrap:wrap;gap:8mm;padding:8mm;width:${74.25 * 5 + 8 * 2}mm">
    ${row([1])}${row([2, 3])}${row([4, 5])}${row([6, 7])}${row([8])}</div>`;
}

const doc = (title, body, extraCss = "") =>
  `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}${extraCss}</style></head><body>${body}</body></html>`;

function render(name, html, { w, h }) {
  const file = resolve(out, `${name}.html`);
  writeFileSync(file, html);
  // 1 CSS px = 1/96 in。300dpi にするため 3.125 倍で撮る
  const px = mm => Math.round(mm / 25.4 * 96);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=3.125",
    `--window-size=${px(w)},${px(h)}`, `--screenshot=${resolve(out, `${name}.png`)}`, `file://${file}`], { stdio: "ignore" });
  return file;
}
function pdf(name) {
  const file = resolve(out, `${name}.html`);
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
    `--print-to-pdf=${resolve(out, `${name}.pdf`)}`, `file://${file}`], { stdio: "ignore" });
}

const issues = await Promise.all(["format", "blank", "toi-corner"].map(n => import(`./issues/${n}.mjs`)));
for (const { default: issue } of issues) {
  const pages = issue.pages;
  render(issue.slug, doc(issue.title, sheet(pages, issue.sheet), issue.css), { w: 297, h: 210 });
  pdf(issue.slug);
  if (issue.preview !== false) {
    const html = doc(`${issue.title}（読む順）`, readingOrder(pages), issue.css + "@page{size:auto}");
    render(`${issue.slug}-reading-order`, html, { w: 74.25 * 5 + 8 * 4, h: 105 * 2 + 8 * 3 });
    // チラシなどに載せる用に 1 ページずつ（縁の白は除く）
    mkdirSync(resolve(out, "pages"), { recursive: true });
    for (let n = 1; n <= 8; n++) {
      const p = pages[n];
      const one = `<div class="cell" style="width:74.25mm;height:105mm;margin:calc(-1 * var(--frame))"><div class="page p${n}" style="${p.style ?? ""}">${p.html}</div></div>`;
      render(`pages/${issue.slug}-p${n}`, doc(`p${n}`, one, issue.css + "@page{size:auto}").replaceAll('"../assets/', '"../../assets/'),
        { w: 74.25 - 10, h: 105 - 10 });
    }
  }
  console.log("built", issue.slug);
}
