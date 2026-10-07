# 生成AI活用セミナー 特設サイト（2026/11/27）

ひかりデジタルパートナーズ主催「中小企業の生成AI活用について」オンラインセミナーの特設ランディングページです。
ビルド不要の静的HTML/CSS/JSのみで構成しており、GitHub → Cloudflare Pages でそのまま公開できます。

## ファイル構成

```
index.html   ページ本体
style.css    スタイル（既存LP「JUST.DB教育プログラム」のデザイントークンを踏襲）
script.js    カウントダウン・カレンダー追加・残席バー・QRコード・申込ボタン制御などの挙動
assets/      画像を追加する場合はここに配置
```

## 公開前に必ず確認・更新すること

1. **申込フォームURL**（最重要）
   [script.js](script.js) 冒頭の `CONFIG.FORMS_URL` を、Microsoft Forms で作成した申込フォームのURLに書き換えてください。
   未設定（プレースホルダーのまま）だと、申込ボタンは押しても「準備中」アラートが出るだけで遷移しません。

   ```js
   FORMS_URL: "https://forms.office.com/REPLACE_WITH_YOUR_FORM_URL",
   ```

2. **登壇者情報**
   現在は社名・役職ともに「（仮）」表記でプレースホルダーになっています。
   登壇者が確定したら [index.html](index.html) の `#program`（プログラム）と `#speakers`（登壇者紹介）セクションを更新してください。
   顔写真をもらえた場合は、`.speaker-face` のイニシャル円を `<img>` タグに差し替えると自然に反映されます。

3. **残席表示**（任意）
   `script.js` の `CONFIG.REGISTERED_SEATS` を実際の申込人数に合わせて更新すると、
   お申込みセクションの残席バーの表示が変わります（自動連携ではなく手動更新です）。

4. **OGP画像**（任意）
   SNSやメールでシェアされた際のプレビュー画像を用意する場合は `assets/ogp.png` を配置し、
   `index.html` の `<head>` に `og:image` / `twitter:card` のmetaタグを追加してください。

## アンケート・申込データについて

申込フォームは **Microsoft Forms** を利用し、Forms標準機能で回答を
**SharePoint上のExcelブック（Excelへのエクスポート/リアルタイム連携）** に自動蓄積する想定です。
このサイト自体にはフォーム送信・データ保存の機能は持たせていません（Formsへの導線のみ）。

## ローカルでの確認方法

ビルド不要です。`index.html` をブラウザで直接開くか、簡易サーバーで確認してください。

```bash
# 任意: ローカルサーバーで確認する場合
python -m http.server 8080
# http://localhost:8080 を開く
```

## デプロイ手順（GitHub → Cloudflare Pages）

### 1. GitHubにリポジトリを作成してpush

GitHub上で新規リポジトリ（Public）を作成した後、このフォルダで以下を実行してください
（リポジトリURLは作成時に表示されるものに置き換えてください）。

```bash
git remote add origin https://github.com/<あなたのアカウント>/<リポジトリ名>.git
git branch -M main
git push -u origin main
```

### 2. Cloudflare Pagesと連携

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) にログイン
2. 「Workers & Pages」→「Pages」→「Create application」→「Connect to Git」
3. 先ほど作成したGitHubリポジトリを選択
4. ビルド設定は以下の通り（静的サイトのためビルドコマンド不要）
   - Framework preset: `None`
   - Build command: （空欄のまま）
   - Build output directory: `/`
5. 「Save and Deploy」を実行すると、`https://<プロジェクト名>.pages.dev` で公開されます

以降は `main` ブランチにpushするたびに自動で再デプロイされます。

### 独自ドメインを使う場合（任意）

Cloudflare Pagesのプロジェクト設定 →「Custom domains」から、取得済みのドメインを追加してください
（Cloudflareでドメインを管理している場合はDNS設定も自動で反映されます）。
