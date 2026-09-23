// 10/2 イベント「自分だけの本を作ってみよう！」の A4 縦チラシ。
//   node build.mjs && node flyer.mjs   → out/flyer-20261002.{html,png,pdf}
// 作例ページの画像は build.mjs が out/pages/ に書き出したものを使う。
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "out");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ── イベントの中身。ここだけ直せば刷り直せる（★ は本人未確認の仮置き）──
const EVENT = {
  date: "10.2",
  dow: "金",
  time: "15:00〜21:30 のあいだ、好きな時間に", // ★ 開館時間をそのまま置いた
  length: "1冊 30分くらい",                      // ★
  who: "中学生・高校生",
  fee: "参加無料・申し込み不要",                  // ★
  bring: "なにもいりません。紙・ペン・ハサミは Miacis にあります", // ★
};
const PLACE = {
  name: "青少年育成プラザ Miacis",
  where: "韮崎市民交流センター NICORI 地下1階",
  tel: "0551-45-9919",
  hours: "開館 平日 15:00–21:30 ／ 土日祝 9:30–21:30　休館 毎週火曜・第3月曜",
};
const IDEAS = ["好きなもの図鑑", "推しの本", "今日の日記", "問いの本", "マンガ", "ひみつの地図"];

const pg = n => `pages/zine-toi-corner-000-p${n}.png`;

// 折り方の図。1マス = 8×5.6 の比（A4 横を 4×2 に割った形）
const W = 48, H = 34;
const sheet = (inner = "") => `<rect x="1" y="1" width="${W}" height="${H}" rx="1.2" fill="#fff" stroke="#203047" stroke-width=".9"/>${inner}`;
const folds = `${[1, 2, 3].map(i => `<line x1="${1 + W / 4 * i}" y1="1" x2="${1 + W / 4 * i}" y2="${H + 1}" stroke="#9aa9bb" stroke-width=".6" stroke-dasharray="1.4 1.2"/>`).join("")}<line x1="1" y1="${1 + H / 2}" x2="${W + 1}" y2="${1 + H / 2}" stroke="#9aa9bb" stroke-width=".6" stroke-dasharray="1.4 1.2"/>`;
const STEPS = [
  { t: "8マスに折り目をつける", svg: sheet(folds) },
  { t: "真ん中だけハサミで切る", svg: sheet(folds + `<line x1="${1 + W / 4}" y1="${1 + H / 2}" x2="${1 + W * 3 / 4}" y2="${1 + H / 2}" stroke="#c83232" stroke-width="1.6"/><text x="${W / 2 + 1}" y="${H / 2 - 2}" font-size="5" text-anchor="middle" fill="#c83232">✂</text>`) },
  { t: "横に二つ折りして、両端を押す", svg: `<rect x="1" y="${H / 2 - 4}" width="${W}" height="${H / 2 - 4}" rx="1" fill="#fff" stroke="#203047" stroke-width=".9"/><path d="M-1 ${H / 2 + 5} h7 m-2.5 -2.5 l2.5 2.5 l-2.5 2.5" fill="none" stroke="#244fc7" stroke-width="1.2"/><path d="M${W + 3} ${H / 2 + 5} h-7 m2.5 -2.5 l-2.5 2.5 l2.5 2.5" fill="none" stroke="#244fc7" stroke-width="1.2"/>` },
  { t: "十字になったら、たたんで完成", svg: `<g transform="translate(${W / 2 + 1} ${H / 2 + 1})"><rect x="-6" y="-15" width="12" height="15" fill="#ffe680" stroke="#203047" stroke-width=".9"/><rect x="-6" y="0" width="12" height="15" fill="#fff" stroke="#203047" stroke-width=".9"/><rect x="-21" y="-6" width="15" height="12" fill="#fff" stroke="#203047" stroke-width=".9"/><rect x="6" y="-6" width="15" height="12" fill="#ffc7af" stroke="#203047" stroke-width=".9"/></g>` },
];

const CSS = `
  @page { size: A4; margin: 0; }
  :root{--blue:#244fc7;--ink:#203047;--muted:#53647b;--yellow:#ffe680;--apricot:#ffc7af;--pale:#edf5ff;--line:#d4e3f5;
        --maru:"Hiragino Maru Gothic ProN","Zen Maru Gothic",sans-serif;--sans:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif}
  html,body{margin:0;background:#fff}
  body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  p{margin:0}
  .phrase{word-break:auto-phrase;line-break:strict;text-wrap:pretty}
  /* 紙の端 8mm は刷らない前提で、色面は内側のカードに置く（ZINE と同じ考え方） */
  .a4{width:210mm;height:297mm;box-sizing:border-box;padding:8mm;display:flex;flex-direction:column;gap:5mm}

  .hero{position:relative;background:var(--yellow);border-radius:4mm;padding:11mm 10mm 9mm;height:128mm;box-sizing:border-box;overflow:hidden}
  .kicker{font:700 10pt/1 var(--maru);letter-spacing:.14em;color:var(--blue)}
  h1{margin:4mm 0 0;font:800 40pt/1.18 var(--maru);letter-spacing:.01em}
  h1 em{font-style:normal;background:linear-gradient(transparent 62%,#fff 62%)}
  .lede{margin-top:5mm;width:84mm;font-size:9.6pt;line-height:1.85;font-weight:600}
  .date{position:absolute;left:10mm;bottom:9mm;display:flex;align-items:baseline;gap:2.5mm}
  .date b{font:800 46pt/1 var(--maru);letter-spacing:-.01em}
  .date span{font:800 15pt/1 var(--maru);background:var(--ink);color:#fff;border-radius:50%;width:10.5mm;height:10.5mm;display:grid;place-items:center}
  /* 作例: 実物のページをずらして重ねる */
  .zines{position:absolute;right:7mm;top:14mm;width:82mm;height:108mm}
  .zines img{position:absolute;width:38mm;border-radius:1.8mm;box-shadow:0 0 0 .5mm #fff,0 .6mm 0 .8mm rgba(32,48,71,.18)}
  .zines .a{left:42mm;top:0;transform:rotate(6deg);z-index:3}
  .zines .b{left:4mm;top:8mm;transform:rotate(-5deg);z-index:2}
  .zines .c{left:24mm;top:47mm;transform:rotate(3deg);z-index:4}
  .zines .tag{position:absolute;right:0;bottom:12mm;z-index:5;font-size:7pt;line-height:1.5;background:#fff;padding:1.4mm 2.4mm;border-radius:1.5mm;font-weight:600}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
  .card{border:.35mm solid var(--line);border-radius:3mm;padding:6mm 6mm 5.5mm}
  .card h2{margin:0 0 3.5mm;font:800 12pt/1.3 var(--maru);color:var(--blue)}
  .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}
  .step{text-align:center}
  .step svg{width:100%;height:auto;display:block}
  .step p{margin-top:2mm;font-size:7.4pt;line-height:1.5;font-weight:600}
  .step i{font:800 8pt/1 var(--maru);color:var(--blue);font-style:normal;display:block;margin-bottom:1mm}
  .ideas{display:flex;flex-wrap:wrap;gap:2mm}
  .ideas span{font:700 9pt/1 var(--maru);padding:2.4mm 3.2mm;border-radius:10mm;background:var(--c)}
  .ideas-note{margin-top:3.5mm;font-size:8pt;line-height:1.7;color:var(--muted)}
  dl{margin:0;display:grid;grid-template-columns:15mm 1fr;row-gap:2.6mm;font-size:9pt;line-height:1.55}
  dt{font-weight:800;color:var(--blue);font-family:var(--maru)}
  dd{margin:0;font-weight:600}

  .foot{margin-top:auto;display:flex;align-items:center;gap:5mm;padding:4.5mm 6mm;background:var(--pale);border-radius:3mm}
  .foot img{height:13mm}
  .foot .name{font:800 11pt/1.3 var(--maru)}
  .foot .sub{font-size:7.6pt;line-height:1.7;color:var(--muted)}
`;

const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>自分だけの本を作ってみよう！ 10.2</title><style>${CSS}</style></head><body>
<div class="a4">
  <section class="hero">
    <div class="kicker">Miacis ZINE の日</div>
    <h1>自分だけの<br>本を<em>作って</em><br>みよう！</h1>
    <p class="lede">A4の紙1枚を、折って、1本切るだけ。<br>8ページの小さな本（ZINE）ができます。</p>
    <div class="date"><b>${EVENT.date}</b><span>${EVENT.dow}</span></div>
    <div class="zines">
      <img class="b" src="${pg(2)}" alt=""><img class="a" src="${pg(1)}" alt="作例の表紙"><img class="c" src="${pg(7)}" alt="">
      <p class="tag">作例「問いのZINE」<br>問いコーナーの問いを集めた本</p>
    </div>
  </section>

  <section class="card">
    <h2>作り方は、これだけ</h2>
    <div class="steps">${STEPS.map((s, i) => `<div class="step"><svg viewBox="-3 -2 ${W + 8} ${H + 5}">${s.svg}</svg><p><i>${i + 1}</i>${s.t}</p></div>`).join("")}</div>
  </section>

  <div class="row">
    <section class="card">
      <h2>なにを書く？</h2>
      <div class="ideas">${IDEAS.map((x, i) => `<span style="--c:${["#fff6b8", "#ffe0ea", "#dcecff"][i % 3]}">${x}</span>`).join("")}</div>
      <p class="ideas-note phrase">絵だけでも、写真を貼っても、1ページに1文字でもOK。決まらなかったら、スタッフと一緒に考えよう。</p>
    </section>
    <section class="card">
      <h2>あそびかた</h2>
      <dl>
        <dt>いつ</dt><dd>${EVENT.date}（${EVENT.dow}）${EVENT.time}<br>${EVENT.length}</dd>
        <dt>だれ</dt><dd>${EVENT.who}</dd>
        <dt>おかね</dt><dd>${EVENT.fee}</dd>
        <dt>もちもの</dt><dd class="phrase">${EVENT.bring}</dd>
      </dl>
    </section>
  </div>

  <footer class="foot">
    <img src="../assets/miacis-logo.png" alt="Miacis">
    <div><p class="name">${PLACE.name}</p><p class="sub">${PLACE.where} ／ TEL ${PLACE.tel}<br>${PLACE.hours}</p></div>
  </footer>
</div></body></html>`;

const file = resolve(out, "flyer-20261002.html");
writeFileSync(file, html);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=3.125",
  "--window-size=794,1123", `--screenshot=${resolve(out, "flyer-20261002.png")}`, `file://${file}`], { stdio: "ignore" });
execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
  `--print-to-pdf=${resolve(out, "flyer-20261002.pdf")}`, `file://${file}`], { stdio: "ignore" });
console.log("built flyer-20261002");
