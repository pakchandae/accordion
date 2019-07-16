# accordion


## 開発環境

* node (8.11.3)
* パッケージマネージャー: yarn (1.7.0)
* タスクランナー: gulp (3.9.1)
* モジュールバンドラ: webpack (4.31.0)


## 使用言語

* HTMLテンプレート: pug
* CSSメタ言語: Sass (scss)
* JavaScript: ES2015 (ECMAScript6)


## ファイル構成

* `package.json`
  * 使用パッケージの管理ファイル
* `gulpfile.babel.js`
  * gulpのタスク定義
* `public`
  * 公開フォルダ
* `src`
  * ビルド前の開発用ソースコード


## タスク

`gulp` コマンドでローカルサーバー立ち上げ＆各開発用ファイルをwatch、ビルドする