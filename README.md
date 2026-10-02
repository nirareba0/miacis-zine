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

**箱で組む・ひながた・動画の QR（2026-10-02）**: テンプレート（8つのかたち）はやめ、どのページも写真・文字・QR の「箱」を mm 座標で `items` に持つ。
ドラッグで移動・四隅か2本指で大きさ（QR は正方形・15mm 以上）・「写真の中身を動かす」で切り取り。
ひながたは表紙3（写真＋タイトル／写真いっぱい／文字だけ）・中のページ4（写真＋文／写真＋見出し／写真のみ／複数写真）・裏表紙3。当てると中身を新しい箱へ順に移す（`PRESETS`・`fillPreset()`）。
「写真から作る」は8枚まで・表紙から順に1ページ1枚（`photoSlots()`）。最初の画面でテーマ（自己紹介・好きなもの紹介・最近の話・好きな動画集。`THEMES`）を選ぶと表紙のタイトルが入る。
「＋動画・QR」は YouTube の URL からサムネイル（i.ytimg.com、CORS 可）・タイトル（oEmbed）・`youtu.be` の QR を置く。ほかの URL は QR だけ。
QR は `docs/vendor/qrcode.min.js`（qrcode-generator 2.0.4・MIT）。写真とサムネイルの中身は IndexedDB（`mainichi-zine-photos`）、localStorage には `idb:<key>` だけ。
作例は「にしむ〜の好きな動画集」（`VIDEOS`。**いまの6本は仮**）。10/2 より前の版で作っていたデータは、読み込み時に既定のひながたへ移す。

## 当日の説明用シート・チラシ案 B

- `node guide.mjs` → `out/guide-20261002.*`（作り方3通り・8ページの並び・折り方・決まり・18:00 発行）
- `node flyer.mjs b` → `out/flyer-20261002-b.*`（集客用チラシの「手書きも同格」案。`node flyer.mjs` は A 案）
- 手書き用の台紙は `node build.mjs` → `out/zine-blank.pdf`

## ハイブリッド版チラシ・公式LINE の配信画像（2026-09-27）

- `node build.mjs && node flyer-hybrid.mjs` → `out/flyer-20261002-hybrid.*`（A「アプリで作って公式LINE に送る」と B「紙に直接書く」を同格に並べ、ショップカードのスタンプを案内。紙の絵に `out/zine-format.png` を使う）
- `node line.mjs` → `out/line-rich-20261002.{png,jpg}`（公式LINE のリッチメッセージ用 1040×1040。配信文面と設定の手順は AIOS の spec §7）

## 自己紹介本のチラシ（2026-09-28）

- `node flyer-intro.mjs` → `out/flyer-intro-20261002.*`（「あなたの自己紹介本をつくろう！」。推し・すきなもの・顔の写らない自分の写真を8ページに詰めこむ例と、「読者が生まれるかも」の帯。日時は先頭の `EVENT`）
- キャッチコピーは先頭の `COPY`。`node flyer-intro.mjs b` / `c` で別案（`out/flyer-intro-20261002-b.*` / `-c.*`）。見比べは `out/flyer-intro-copy-compare.png`

## CM（2026-09-28）

- `cm/prompts.md` — 絵コンテ・Veo の指示文・生成結果
- `cm/src/` — Flow（Veo 3.1 Fast）からの素材（`-720p` が生成そのままの正本、`-1080p` は Flow のアップスケール）
- `node cm/endcard.mjs && node cm/build.mjs` → `cm/out/zine-cm-20261002.mp4`（1080×1920・24fps・18.3 秒・−14 LUFS 前後）。カットの秒と字幕は `cm/build.mjs` 先頭の `CUTS`
- **v3（採用・2026-09-28）**: `node cm/covers.mjs && node cm/v3/render.mjs` → `cm/out/zine-cm-v3-20261002.mp4`（1080×1920・24fps・19.5 秒）。絵コンテ `cm/storyboard-v3.md`。動きは `cm/v3/scene.html` の `render(t)`、背景は `cm/v3/desk.jpg`・`wall.jpg`（Flow の Nano Banana 2 で生成）
