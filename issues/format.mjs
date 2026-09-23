// フォーマット説明シート。各ページの役割と書くときの目安（配布・掲示用。これ自体は折らない）
// 見開きは 2|3・4|5・6|7 の3つ。役割は見開き単位で決める
const role = (no, name, hint, ex, spread) => ({
  html: `
    <div class="no">${no}${spread ? `<span class="spread">${spread}</span>` : ""}</div>
    <div class="name">${name}</div>
    <p class="hint phrase">${hint}</p>
    ${ex ? `<p class="ex phrase">例：${ex}</p>` : ""}`,
});

export default {
  slug: "zine-format",
  title: "まいにち ZINE フォーマット",
  sheet: { fullGuides: true, nombre: false },
  preview: false,
  css: `
    .page{background:#fbfdff;outline:.2mm solid var(--line);outline-offset:-.2mm}
    .no{font:800 26pt/1 var(--maru);color:var(--blue);display:flex;align-items:baseline;gap:2mm}
    .spread{font:700 6.5pt/1 var(--sans);color:#fff;background:var(--blue);padding:1mm 1.6mm;border-radius:1mm;letter-spacing:.05em}
    .name{margin-top:2mm;font:800 12pt/1.35 var(--maru)}
    .hint{margin-top:3mm;font-size:7pt;line-height:1.7}
    .ex{margin-top:auto;padding:2.5mm;border-radius:1.5mm;background:var(--pale);font-size:6.5pt;line-height:1.6;color:var(--muted)}
    .p1{background:var(--yellow)}
    .p8{background:#fff4ee}
  `,
  pages: {
    1: role("1", "表紙", "タイトル・号数・日付・今日のテーマ。写真か絵を1つ。", "問いのZINE #000<br>問いコーナーから"),
    2: role("2", "問い", "今日いちばん考えたい問いを1つ、大きく。", "幸せって何？", "見開き①"),
    3: role("3", "こたえ", "2の問いへの答え。長ければ1〜2行だけ抜き出す。書いた人はニックネームか立場で。", "「当たり前は全部幸せ」— スタッフ", "見開き①"),
    4: role("4", "写真／絵", "1枚を大きく。顔・名札・制服・学校名は写さない。", "付箋の問いのスキャン", "見開き②"),
    5: role("5", "写真のこと", "4の写真に写っているもの・そのとき思ったこと。4と合わせて1枚の絵にしてもいい。", "ほかにも届いた問い", "見開き②"),
    6: role("6", "もう一つの問い", "2とちがう角度の問い。答えがいくつもあるものが向く。", "人生を何かにたとえると？", "見開き③"),
    7: role("7", "あなたの番", "読んだ人が書き込める余白。6に答える形の問いかけを1つ置く。", "人生とは ＿＿ だ。", "見開き③"),
    8: role("8", "裏表紙", "この号について2〜3行。作った日・作った人（ニックネーム）・場所。借りた問いや言葉は出どころも。", "Miacis 問いコーナー ／ QR"),
  },
};
