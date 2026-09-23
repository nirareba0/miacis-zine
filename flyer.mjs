// 10/2 イベントの A4 縦チラシ。主役はスマホ版の QR。
//   node flyer.mjs   → out/flyer-20261002.{html,png,pdf}
// スマホの画面は assets/flyer-app.png（アプリを 390px 幅で撮ったもの）。
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "out");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 案 A（スマホ推し）/ 案 B（手書きも同格に入れる）。 node flyer.mjs b で B を書き出す
const VARIANT = process.argv[2] === "b" ? "b" : "a";
const COPY = {
  a: { h1: "スマホで、<br>自分だけの<br><span class=\"em\">本</span>をつくろう。", lede: "写真と文字を入れるだけで、<br>A4 1枚・8ページの本（ZINE）になる。",
       sticker: "アプリの<br>インストール<br>いらない",
       lineH: (t) => `${t} までに、<em>公式LINE に送っておいてくれても OK</em>`,
       lineP: (t) => `左の QR で Miacis の公式LINE を友だち追加して、できた ZINE の画像を送ってね。${t} から Miacis で発行します。<br>写真に、顔・名札・制服・学校名は入れないでね。` },
  b: { h1: "自分だけの<br><span class=\"em\">本</span>を<br>つくろう。", lede: "スマホでも、紙に手書きでも。<br>A4 1枚・8ページの本（ZINE）になる。",
       sticker: "スマホが<br>なくても<br>OK",
       lineH: (t) => `${t} までに、<em>公式LINE かスタッフに渡してね</em>`,
       lineP: (t) => `スマホがなくても大丈夫。Miacis で台紙をもらって、紙に手書きで作れます。写真だけアプリで並べて、文字は手で書くこともできます。${t} から Miacis で発行。<br>写真に、顔・名札・制服・学校名は入れないでね。` },
}[VARIANT];

// ── イベントの中身。ここだけ直せば刷り直せる ──
const EVENT = { date: "10.2", dow: "金", issue: "18:00" };
// スマホ版（GitHub Pages）。QR は assets/qr-app.svg（segno・誤り訂正 H）
const APP_URL = "https://nirareba0.github.io/miacis-zine/";
// Miacis 公式LINE（@upq3510d）。Drive「公式LINEQRコード」の QR を読み取った URL から作り直した（segno・誤り訂正 H）
const LINE_URL = "https://lin.ee/h6NuArv";
const LINE_QR = "../assets/qr-line.svg";
const PLACE = {
  name: "青少年育成プラザ Miacis",
  where: "韮崎市民交流センター NICORI 地下1階",
  tel: "0551-45-9919",
  hours: "開館 平日 15:00–21:30 ／ 土日祝 9:30–21:30<br>休館 毎週火曜・第3月曜",
};

const CSS = `
  @page { size: A4; margin: 0; }
  :root{--blue:#244fc7;--ink:#203047;--muted:#53647b;--yellow:#ffe680;--pale:#edf5ff;--line:#d4e3f5;
        --maru:"Hiragino Maru Gothic ProN","Zen Maru Gothic",sans-serif;--sans:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif}
  html,body{margin:0;background:#fff}
  body{font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  p{margin:0}
  /* 紙の端 8mm は刷らない前提で、色面は内側のカードに置く（ZINE と同じ考え方） */
  .a4{width:210mm;height:297mm;box-sizing:border-box;padding:8mm;display:flex;flex-direction:column;gap:4mm;overflow:hidden}

  /* 上: 見出しとスマホ */
  .hero{position:relative;flex:none;height:124mm;background:var(--yellow);border-radius:4mm;padding:10mm 10mm 9mm;box-sizing:border-box;overflow:hidden}
  .kicker{font:700 10pt/1 var(--maru);letter-spacing:.14em;color:var(--blue)}
  h1{margin:5mm 0 0;font:800 34pt/1.22 var(--maru);letter-spacing:.01em}
  h1 .em{background:linear-gradient(transparent 60%,#fff 60%)}
  .lede{margin-top:5mm;font-size:10pt;line-height:1.8;font-weight:600}
  .when{position:absolute;left:10mm;bottom:9mm}
  .when .d{display:flex;align-items:baseline;gap:2.5mm}
  .when b{font:800 44pt/1 var(--maru);letter-spacing:-.01em}
  .when .dow{font:800 14pt/1 var(--maru);background:var(--ink);color:#fff;border-radius:50%;width:10mm;height:10mm;display:grid;place-items:center}
  .when .t{margin-top:3mm;display:inline-flex;align-items:baseline;gap:1.8mm;background:var(--ink);color:#fff;border-radius:2mm;padding:2.2mm 3.4mm;font:800 15pt/1 var(--maru)}
  .when .t small{font:700 9.5pt/1 var(--maru)}
  /* スマホ（アプリの実際の画面） */
  .phone{position:absolute;right:13mm;top:7mm;width:52mm;height:110mm;box-sizing:border-box;padding:2mm;border-radius:9mm;background:var(--ink);
         transform:rotate(5deg);box-shadow:0 1.2mm 0 .2mm rgba(32,48,71,.22)}
  .phone img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;border-radius:7.2mm}
  .sticker{position:absolute;right:54mm;top:78mm;z-index:2;transform:rotate(-8deg);background:#fff;border-radius:50%;width:27mm;height:27mm;
           display:grid;place-items:center;text-align:center;font:800 9pt/1.4 var(--maru);color:var(--blue);box-shadow:0 .8mm 0 rgba(32,48,71,.18)}

  /* 真ん中: QR が主役 */
  .scan{flex:none;display:grid;grid-template-columns:56mm 1fr;gap:9mm;align-items:center;background:var(--blue);color:#fff;border-radius:4mm;padding:8mm 9mm 8mm 11mm}
  .qr{position:relative;background:#fff;border-radius:3mm;padding:4mm}
  .qr img{display:block;width:100%;height:auto}
  .qr::after{content:"";position:absolute;inset:-2.4mm;border:.6mm dashed rgba(255,255,255,.8);border-radius:4.6mm}
  .scan h2{margin:0;font:800 21pt/1.3 var(--maru);letter-spacing:.01em}
  .scan .url{margin-top:1.8mm;font-size:7.2pt;opacity:.8;letter-spacing:.02em}
  .flow{margin:5mm 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2.6mm}
  .flow li{display:flex;align-items:flex-start;gap:2.6mm;font:700 10pt/1.45 var(--maru)}
  .flow i{flex:none;font-style:normal;width:6.6mm;height:6.6mm;border-radius:50%;background:#fff;color:var(--blue);display:grid;place-items:center;font:800 9.5pt/1 var(--maru)}
  .flow small{display:block;font:500 7.4pt/1.5 var(--sans);opacity:.85}

  /* 下: 送っておいてもOK */
  .line{flex:none;display:flex;align-items:center;gap:6mm;border:.4mm solid var(--line);border-radius:4mm;padding:4.5mm 7mm}
  .line .badge{flex:none;width:27mm;box-sizing:border-box;border-radius:4mm;background:#06c755;color:#fff;padding:2mm 2mm 1.6mm;text-align:center;font:800 8pt/1.3 var(--maru)}
  .line .badge img{display:block;width:100%;height:auto;background:#fff;border-radius:2.5mm;padding:2mm;box-sizing:border-box}
  .line .badge span{display:block;margin-top:1.4mm;letter-spacing:.04em}
  .line h3{margin:0;font:800 12.5pt/1.45 var(--maru)}
  .line h3 em{font-style:normal;color:var(--blue)}
  .line p{margin-top:1.6mm;font-size:8.4pt;line-height:1.75;color:var(--muted)}

  .foot{margin-top:auto;flex:none;display:flex;align-items:center;gap:5mm;padding:3.5mm 6mm;background:var(--pale);border-radius:3mm}
  .foot img{height:13mm}
  .foot .name{font:800 11pt/1.3 var(--maru)}
  .foot .sub{font-size:7.6pt;line-height:1.7;color:var(--muted)}
`;

const html = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>スマホで自分だけの本をつくろう 10.2</title><style>${CSS}</style></head><body>
<div class="a4">
  <section class="hero">
    <div class="kicker">Miacis ZINE の日</div>
    <h1>${COPY.h1}</h1>
    <p class="lede">${COPY.lede}</p>
    <div class="when">
      <div class="d"><b>${EVENT.date}</b><span class="dow">${EVENT.dow}</span></div>
      <div class="t">${EVENT.issue}<small>から発行</small></div>
    </div>
    <div class="phone"><img src="../assets/flyer-app.png" alt="スマホ版の画面"></div>
    <div class="sticker">${COPY.sticker}</div>
  </section>

  <section class="scan">
    <div class="qr"><img src="../assets/qr-app.svg" alt="スマホ版の QR"></div>
    <div>
      <h2>読みこめば、<br>いますぐ作れる。</h2>
      <p class="url">${APP_URL.replace("https://", "")}</p>
      <ol class="flow">
        <li><i>1</i><span>8ページに、写真と文字を入れる<small>好きなもの図鑑・推しの本・今日の日記…なんでも</small></span></li>
        <li><i>2</i><span>「A4 にする」で保存して、公式LINE に送る</span></li>
        <li><i>3</i><span>${EVENT.date} ${EVENT.issue} から、Miacis で発行！</span></li>
      </ol>
    </div>
  </section>

  <section class="line">
    <div class="badge">${LINE_QR ? `<img src="${LINE_QR}" alt="公式LINE の QR"><span>公式LINE</span>` : "Miacis<br>公式<br>LINE"}</div>
    <div>
      <h3>${COPY.lineH(EVENT.issue)}</h3>
      <p>${COPY.lineP(EVENT.issue)}</p>
    </div>
  </section>

  <footer class="foot">
    <img src="../assets/miacis-logo.png" alt="Miacis">
    <div><p class="name">${PLACE.name}</p><p class="sub">${PLACE.where} ／ TEL ${PLACE.tel}<br>${PLACE.hours}</p></div>
  </footer>
</div></body></html>`;

const NAME = VARIANT === "b" ? "flyer-20261002-b" : "flyer-20261002";
const file = resolve(out, `${NAME}.html`);
writeFileSync(file, html);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=3.125",
  "--window-size=794,1123", `--screenshot=${resolve(out, `${NAME}.png`)}`, `file://${file}`], { stdio: "ignore" });
execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer",
  `--print-to-pdf=${resolve(out, `${NAME}.pdf`)}`, `file://${file}`], { stdio: "ignore" });
console.log("built", NAME);
