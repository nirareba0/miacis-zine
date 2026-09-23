# まいにち ZINE（Miacis）

A4 1枚を折って 8 ページにする ZINE の面付けと書き出し。仕様と経緯は AIOS の
`core/projects/miacis/specs/daily-zine-format-20260923.md`。

```sh
node build.mjs   # out/ に PNG（A4 横・300dpi）・PDF・HTML を書き出す
```

- `issues/format.mjs` — フォーマット説明シート（各ページの役割）
- `issues/blank.mjs` — 手書き用の台紙（ノンブルと折り・切りのしるしだけ）
- `issues/toi-corner.mjs` — 作例「問いのZINE #000 問いコーナーから」
- 面付けは `build.mjs` の `TOP = [5,4,3,2]`（180° 回す）/ `BOTTOM = [6,7,8,1]`。見開きは 2|3・4|5・6|7
- 印刷は PDF を「実際のサイズ（100%）」で。家庭・事務所プリンタの刷れない縁を見込んで、中身は各ページの内側 6mm に置いている
- 写真は `assets/`（問いサイト `~/code/toi-site/web/assets/` と同じもの。どちらも公開済み）

## チラシ

`node build.mjs && node flyer.mjs` → `out/flyer-20261002.{png,pdf}`。日時などは `flyer.mjs` 先頭の `EVENT` だけ直す。

## アプリ（スマホ）

`docs/index.html` 1ファイル＋`docs/sample/`（GitHub Pages が docs/ を公開する）。ビルド不要。ローカルでは `cd docs && python3 -m http.server` で開く（file:// だと canvas の書き出しが止まる）。
claude.ai 上では downloads 機能で保存し、ふつうの Web 公開では共有メニューかダウンロードで保存する。

## 当日の説明用シート・チラシ案 B

- `node guide.mjs` → `out/guide-20261002.*`（作り方3通り・8ページの並び・折り方・決まり・18:00 発行）
- `node flyer.mjs b` → `out/flyer-20261002-b.*`（集客用チラシの「手書きも同格」案。`node flyer.mjs` は A 案）
- 手書き用の台紙は `node build.mjs` → `out/zine-blank.pdf`
