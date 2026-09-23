// 作例: 問いコーナーから抜粋した号。
// 問い・返事は問いサイト（https://nirareba0.github.io/toi-site/）で公開済みのものだけを使う。
// 返事を書いた人は名前ではなく立場（responder_role）で出す（DECISIONS 2026-09-18）。
// 外部から借りた問い（credit あり）は使わない。
const A = "../assets/";

const LIFE = [
  "手づくりの舟",
  "使いかけの消しゴム",
  "寄り道を楽しむ旅",
  "タピオカミルクティー",
  "相手を許し、自分が進化するもののくり返し",
];

const MORE = [
  "昨日のよるごはんを思い出せないのはどうして？？？",
  "結婚式はチャペルでやるのに、葬式はお寺でやるのはなぜ？",
  "なんで人間はペンギンより偉いの？",
  "校則っていらなくない？",
  "子供はいつから大人になるの？",
  "心の安らぎが欲しい。",
];

export default {
  slug: "zine-toi-corner-000",
  title: "問いのZINE #000 問いコーナーから",
  css: `
    .kicker{font:700 6.5pt/1.4 var(--sans);letter-spacing:.12em;color:var(--blue)}
    .q{font:800 17pt/1.5 var(--maru);letter-spacing:.01em}
    .by{font-size:6pt;color:var(--muted);letter-spacing:.04em}

    /* 1 表紙 */
    .p1{background:var(--yellow);padding:5.5mm 4.5mm 4.5mm}
    .p1 .title{margin-top:1.5mm;font:800 23pt/1.1 var(--maru);letter-spacing:.02em}
    .p1 .title small{display:block;margin-top:1.8mm;font:700 9pt/1.3 var(--maru)}
    .p1 .photo{margin-top:auto;height:44mm;border-radius:2mm;overflow:hidden;border:.6mm solid #fff}
    .p1 .photo img{width:100%;height:100%;object-fit:cover;object-position:50% 12%}
    .p1 .meta{margin-top:2.5mm;display:flex;justify-content:space-between;font:700 6.5pt/1 var(--sans);letter-spacing:.06em}

    /* 2|3 見開き①: 問い｜こたえ */
    .p2{justify-content:center;background:#fbfdff;outline:.2mm solid var(--line);outline-offset:-.2mm}
    .p2 .q{font-size:24pt;line-height:1.35}
    .p2 .kicker{margin-bottom:5mm}
    .p3{background:var(--pale);justify-content:center}
    .p3 .body{font-size:7.4pt;line-height:1.9}
    .p3 mark{background:linear-gradient(transparent 55%,var(--apricot) 55%);color:inherit;font-weight:700}
    .p3 .by{margin-top:4mm}

    /* 4|5 見開き②: 付箋のスキャン｜ほかにも届いた問い */
    .p4{padding:0;outline:.2mm solid var(--line);outline-offset:-.2mm}
    .p4 img{width:100%;height:100%;object-fit:cover;object-position:0% 30%}
    .p5{background:#fbfdff;outline:.2mm solid var(--line);outline-offset:-.2mm}
    .p5 ul{margin:4mm 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2.2mm}
    .p5 li{padding:1.6mm 2.2mm;border-radius:1mm;font:700 6.8pt/1.45 var(--maru);background:var(--c)}
    .p5 .cap{margin-top:auto;padding-bottom:3mm}

    /* 6|7 見開き③: 人生の比喩｜あなたの番 */
    .p6{background:#fbfdff;outline:.2mm solid var(--line);outline-offset:-.2mm}
    .p6 .q{font-size:12.5pt;line-height:1.5}
    .p6 ol{margin:5mm 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2.4mm}
    .p6 li{font-size:7pt;line-height:1.5;padding-left:3.2mm;border-left:.7mm solid var(--blue)}
    .p6 li b{font:800 7.8pt/1.5 var(--maru)}
    .p6 .by{margin-top:auto;padding-bottom:3mm}
    .p7{background:#fff4ee}
    .p7 .lead{font:800 12pt/1.5 var(--maru);margin-top:6mm}
    .p7 .blank{margin-top:9mm;height:9mm;border-bottom:.3mm solid var(--ink)}
    .p7 .blank + .blank{margin-top:4mm}
    .p7 .da{margin-top:3mm;text-align:right;font:800 12pt/1 var(--maru)}
    .p7 .note{margin-top:auto;padding-bottom:3mm;font-size:6pt;line-height:1.6;color:var(--muted)}

    /* 8 裏表紙 */
    .p8{background:var(--blue);color:#fff}
    .p8 .kicker{color:#fff;opacity:.8}
    .p8 .about{margin-top:3mm;font-size:6.8pt;line-height:1.85}
    .p8 .qr{margin-top:auto;display:flex;gap:3mm;align-items:flex-end}
    .p8 .qr .box{background:#fff;padding:1.5mm;border-radius:1mm;flex:none}
    .p8 .qr img{width:17mm;height:17mm;display:block}
    .p8 .qr p{font-size:5.8pt;line-height:1.6}
    .p8 .colophon{margin-top:3.5mm;padding-top:2.5mm;border-top:.2mm solid rgba(255,255,255,.4);font-size:5.8pt;line-height:1.7}
  `,
  pages: {
    1: { html: `
      <div class="kicker">まいにち ZINE</div>
      <div class="title">問いの<br>ZINE<small>問いコーナーから</small></div>
      <div class="photo"><img src="${A}toi-corner-miacis.jpg" alt=""></div>
      <div class="meta"><span>#000</span><span>2026.9.23</span></div>` },
    2: { html: `
      <div class="kicker">届いた問い</div>
      <p class="q phrase">幸せって<br>何？</p>` },
    3: { html: `
      <div class="kicker" style="margin-bottom:4mm">大人の返事</div>
      <p class="body phrase">生きていれば幸せなんじゃないでしょうか。<br>美味しい食べ物を食べることができることだったり、好きなことをできたり、友達と何気ない会話したり、、。<br>そう言った<mark>気づいてないだけで、当たり前と感じてることは全て幸せ</mark>だとおもいます！</p>
      <p class="by">— Miacis の大人スタッフ</p>` },
    4: { html: `<img src="${A}toi-corner-notes.jpg" alt="付箋に書かれた問い">` },
    5: { html: `
      <div class="kicker">ほかにも届いた問い</div>
      <ul>${MORE.map((q, i) => `<li class="phrase" style="--c:${["#fff6b8", "#ffe0ea", "#dcecff"][i % 3]}">${q}</li>`).join("")}</ul>
      <p class="by cap">左：問いコーナーの付箋</p>` },
    6: { html: `
      <div class="kicker" style="margin-bottom:3mm">届いた問い</div>
      <p class="q phrase">人生の比喩として最も適当なものを教えてください</p>
      <ol>${LIFE.map(x => `<li class="phrase">人生とは<b>${x}</b>だ。</li>`).join("")}</ol>
      <p class="by">— Miacis のスタッフ 5人の返事から</p>` },
    7: { html: `
      <div class="kicker">あなたの番</div>
      <p class="lead">あなたにとって、<br>人生とは</p>
      <div class="blank"></div><div class="blank"></div>
      <p class="da">だ。</p>
      <p class="note phrase">書いたら、問いコーナーに貼っていってください。</p>` },
    8: { html: `
      <div class="kicker">この号について</div>
      <p class="about phrase">Miacis の問いコーナーには、年に約100件の問いが届きます。この号は、問いコーナーのサイトで公開している問いと大人の返事から抜き出しました。返事を書いた人は、名前ではなく立場で載せています。</p>
      <div class="qr"><div class="box"><img src="${A}qr-site.svg" alt="問いサイトの QR"></div><p>ほかの問いと返事は<br>サイトで読めます</p></div>
      <p class="colophon">まいにち ZINE #000 ／ 2026.9.23<br>つくった人：にしむー<br>青少年育成プラザ Miacis ／ 韮崎市</p>` },
  },
};
