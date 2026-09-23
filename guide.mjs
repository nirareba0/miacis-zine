// 当日の説明用シート（A4 縦）。作り方の3通り・8ページの並び・折り方・決まり・18:00 発行までの流れ。
//   node guide.mjs   → out/guide-20261002.{html,png,pdf}
// 作り方は「いちばん準備のない人」でも成り立つ順（紙だけ → 写真だけアプリ → 全部スマホ）に、同じ大きさで並べる。
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "out");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const EVENT = { date: "10.2", dow: "金", issue: "18:00" };

// 折り方の図（チラシ初版と同じ描き方）
const W = 48, H = 34;
const sheet = (inner = "") => `<rect x="1" y="1" width="${W}" height="${H}" rx="1.2" fill="#fff" stroke="#203047" stroke-width=".9"/>${inner}`;
const folds = `${[1, 2, 3].map(i => `<line x1="${1 + W / 4 * i}" y1="1" x2="${1 + W / 4 * i}" y2="${H + 1}" stroke="#9aa9bb" stroke-width=".6" stroke-dasharray="1.4 1.2"/>`).join("")}<line x1="1" y1="${1 + H / 2}" x2="${W + 1}" y2="${1 + H / 2}" stroke="#9aa9bb" stroke-width=".6" stroke-dasharray="1.4 1.2"/>`;
const FOLD = [
  { t: "印刷した面を外にして、上下・左右に折って8マスの折り目をつける", svg: sheet(folds) },
  { t: "上下に半分に折ったまま、真ん中の2マスだけ切る", svg: sheet(folds + `<line x1="${1 + W / 4}" y1="${1 + H / 2}" x2="${1 + W * 3 / 4}" y2="${1 + H / 2}" stroke="#c83232" stroke-width="1.6"/><text x="${W / 2 + 1}" y="${H / 2 - 2}" font-size="5" text-anchor="middle" fill="#c83232">✂</text>`) },
  { t: "横長に二つ折りして、両端を押し寄せる", svg: `<rect x="1" y="${H / 2 - 4}" width="${W}" height="${H / 2 - 4}" rx="1" fill="#fff" stroke="#203047" stroke-width=".9"/><path d="M-1 ${H / 2 + 5} h7 m-2.5 -2.5 l2.5 2.5 l-2.5 2.5" fill="none" stroke="#244fc7" stroke-width="1.2"/><path d="M${W + 3} ${H / 2 + 5} h-7 m2.5 -2.5 l-2.5 2.5 l2.5 2.5" fill="none" stroke="#244fc7" stroke-width="1.2"/>` },
  { t: "十字になったら、表紙が外に来るようにたたむ", svg: `<g transform="translate(${W / 2 + 1} ${H / 2 + 1})"><rect x="-6" y="-15" width="12" height="15" fill="#ffe680" stroke="#203047" stroke-width=".9"/><rect x="-6" y="0" width="12" height="15" fill="#fff" stroke="#203047" stroke-width=".9"/><rect x="-21" y="-6" width="15" height="12" fill="#fff" stroke="#203047" stroke-width=".9"/><rect x="6" y="-6" width="15" height="12" fill="#ffc7af" stroke="#203047" stroke-width=".9"/></g>` },
];

// 作り方の3通り（準備のいらない順）
const WAYS = [
  { tag: "紙だけ", title: "ぜんぶ手で書く", need: "いるもの：なし（台紙はスタッフに）",
    steps: ["台紙を1枚もらう", "8ページに、書く・描く・貼る", "折って本にする"], color: "#fff6b8" },
  { tag: "写真 ＋ 手書き", title: "写真だけアプリで並べる", need: "いるもの：スマホ",
    steps: ["アプリで写真だけ入れる", "「A4 にする」→「写真だけ刷る」", "刷ってもらって、文字は手で書く"], color: "#ffe0ea" },
  { tag: "スマホだけ", title: "ぜんぶアプリで作る", need: "いるもの：スマホ",
    steps: ["アプリで写真と文字を入れる", "「A4 にする」で保存", "公式LINE に送る（家からでも OK）"], color: "#dcecff" },
];

// 8ページの並び（見開きは 2|3・4|5・6|7）
const PAGES = [
  { n: "1", role: "表紙", ex: "タイトル・日付" },
  { n: "2｜3", role: "見開き ①", ex: "問い｜こたえ" },
  { n: "4｜5", role: "見開き ②", ex: "写真｜写真のこと" },
  { n: "6｜7", role: "見開き ③", ex: "もう一つの問い｜あなたの番" },
  { n: "8", role: "裏表紙", ex: "作った人・日付" },
];

const CSS = `
  @page { size: A4; margin: 0; }
  :root{--blue:#244fc7;--ink:#203047;--muted:#53647b;--yellow:#ffe680;--pale:#edf5ff;--line:#d4e3f5;--red:#c83232;
        --maru:"Hiragino Maru Gothic ProN","Zen Maru Gothic",sans-serif;--sans:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif}
  html,body{margin:0;background:#fff}
  body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  p,h1,h2,h3,ol,ul{margin:0}
  .a4{width:210mm;height:297mm;box-sizing:border-box;padding:8mm;display:flex;flex-direction:column;justify-content:space-between;gap:3.5mm;overflow:hidden}
  h2{font:800 11.5pt/1.3 var(--maru);color:var(--blue);margin-bottom:2.5mm}

  .head{display:flex;align-items:flex-end;justify-content:space-between;gap:6mm;background:var(--yellow);border-radius:4mm;padding:7mm 9mm}
  .head .k{font:700 9pt/1 var(--maru);letter-spacing:.14em;color:var(--blue)}
  .head h1{margin-top:2.5mm;font:800 24pt/1.25 var(--maru)}
  .head .d{text-align:right;flex:none}
  .head .d b{display:block;font:800 26pt/1 var(--maru)}
  .head .d span{display:inline-block;margin-top:1.6mm;background:var(--ink);color:#fff;border-radius:1.6mm;padding:1.4mm 2.6mm;font:800 10pt/1 var(--maru)}

  .ways{display:grid;grid-template-columns:repeat(3,1fr);gap:3.5mm}
  .way{border-radius:3mm;padding:5mm 4.5mm 4.5mm;background:var(--c);display:flex;flex-direction:column}
  .way .tag{align-self:flex-start;font:800 7.5pt/1 var(--maru);background:#fff;border-radius:10mm;padding:1.4mm 2.6mm}
  .way h3{margin-top:2.6mm;font:800 12pt/1.35 var(--maru)}
  .way ol{margin-top:2.6mm;padding-left:4.2mm;font-size:8.2pt;line-height:1.65;font-weight:600}
  .way .need{margin-top:auto;padding-top:2.6mm;font-size:7.2pt;color:var(--muted)}
  .ways-note{margin-top:2mm;font-size:7.6pt;color:var(--muted)}

  .row{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}
  .card{border:.35mm solid var(--line);border-radius:3mm;padding:4.5mm 5mm}
  .pages{display:flex;flex-direction:column;gap:1.6mm}
  .pages div{display:grid;grid-template-columns:12mm 17mm 1fr;align-items:center;font-size:8.2pt;line-height:1.4}
  .pages b{font:800 9.5pt/1 var(--maru);color:var(--blue)}
  .pages span{font-weight:700}
  .pages em{font-style:normal;color:var(--muted)}
  .pages-note{margin-top:2.2mm;font-size:7.2pt;line-height:1.6;color:var(--muted)}
  .rules{padding-left:4.2mm;display:flex;flex-direction:column;gap:1.6mm;font-size:8.4pt;line-height:1.55;font-weight:600}
  .rules small{display:block;font-weight:500;color:var(--muted);font-size:7.2pt}

  .fold{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}
  .fold svg{width:100%;height:auto;display:block}
  .fold p{margin-top:1.5mm;font-size:7.4pt;line-height:1.5;font-weight:600}
  .fold i{font:800 8pt/1 var(--maru);color:var(--blue);font-style:normal;margin-right:1mm}

  .issue{display:grid;grid-template-columns:1fr auto auto;gap:5mm;align-items:center;background:var(--blue);color:#fff;border-radius:3mm;padding:4.5mm 6mm}
  .issue h2{color:#fff;margin-bottom:1.6mm}
  .issue p{font-size:8.4pt;line-height:1.7}
  .issue .q{text-align:center;font:800 7pt/1.3 var(--maru)}
  .issue .q img{display:block;width:21mm;height:21mm;background:#fff;padding:1.6mm;border-radius:2mm;margin-bottom:1.2mm}
  .issue .q.line img{outline:.8mm solid #06c755}
`;

const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>まいにちZINE 作り方 ${EVENT.date}</title><style>${CSS}</style></head><body>
<div class="a4">
  <header class="head">
    <div><p class="k">Miacis ZINE の日 ／ 作り方</p><h1>自分だけの本は、<br>3つのやり方で作れる。</h1></div>
    <div class="d"><b>${EVENT.date}（${EVENT.dow}）</b><span>${EVENT.issue} から発行</span></div>
  </header>

  <section>
    <div class="ways">${WAYS.map(w => `
      <div class="way" style="--c:${w.color}">
        <span class="tag">${w.tag}</span>
        <h3>${w.title}</h3>
        <ol>${w.steps.map(s => `<li>${s}</li>`).join("")}</ol>
        <p class="need">${w.need}</p>
      </div>`).join("")}
    </div>
    <p class="ways-note">どれを選んでも、できる本は同じ A4 1枚・8ページ。途中で変えてもいい（アプリで作りかけて、続きは手で書く、など）。</p>
  </section>

  <div class="row">
    <section class="card">
      <h2>8ページの並び</h2>
      <div class="pages">${PAGES.map(p => `<div><b>${p.n}</b><span>${p.role}</span><em>例：${p.ex}</em></div>`).join("")}</div>
      <p class="pages-note">「｜」で並んだ2ページは、開くと隣どうしに見える。例は目安で、なにを書いてもいい。</p>
    </section>
    <section class="card">
      <h2>これだけは守ってね</h2>
      <ol class="rules">
        <li>顔・名札・制服・学校名が写った写真は使わない</li>
        <li>名前は本名ではなく、ニックネームで</li>
        <li>だれかの言葉や問いを載せるときは、その人に聞いてから<small>本やサイトから借りたら、どこから借りたか書く</small></li>
      </ol>
    </section>
  </div>

  <section class="card">
    <h2>折り方</h2>
    <div class="fold">${FOLD.map((s, i) => `<div><svg viewBox="-3 -2 ${W + 8} ${H + 5}">${s.svg}</svg><p><i>${i + 1}</i>${s.t}</p></div>`).join("")}</div>
  </section>

  <section class="issue">
    <div>
      <h2>${EVENT.issue} から発行</h2>
      <p>できたら ${EVENT.issue} までに、公式LINE に送るか、スタッフに渡してね。<br>Miacis で印刷して、本にして発行します。</p>
    </div>
    <div class="q"><img src="../assets/qr-app.svg" alt="アプリの QR">アプリ</div>
    <div class="q line"><img src="../assets/qr-line.svg" alt="公式LINE の QR">公式LINE</div>
  </section>
</div></body></html>`;

const file = resolve(out, "guide-20261002.html");
writeFileSync(file, html);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=3.125",
  "--window-size=794,1123", `--screenshot=${resolve(out, "guide-20261002.png")}`, `file://${file}`], { stdio: "ignore" });
execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
  `--print-to-pdf=${resolve(out, "guide-20261002.pdf")}`, `file://${file}`], { stdio: "ignore" });
console.log("built guide-20261002");
