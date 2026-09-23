// 手書き用の台紙。ノンブルと折り・切りのしるしだけ
const corner = n => ({ html: `<div class="mark">${n}</div>` });

export default {
  slug: "zine-blank",
  title: "まいにち ZINE 台紙",
  sheet: { fullGuides: true, nombre: false },
  preview: false,
  css: `
    .mark{position:absolute;right:4.5mm;bottom:4mm;font:700 6pt/1 var(--maru);color:#b6c3d3}
    .p1 .mark::before{content:"表紙 "} .p8 .mark::before{content:"裏表紙 "}
  `,
  pages: Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, corner(n)])),
};
