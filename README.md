# このリポジトリについて

WordPressのテーマをgulpで作成するためのものです。

# 出来ること
- SCSSのコンパイル
- ブラウザシンク
- 画像の圧縮
- CSSの圧縮
- JSの圧縮
- スタイルガイドの作成（[aigis](https://pxgrid.github.io/aigis/)を使用しています。）

# 使い方

## インストール
```
git clone https://github.com/contiki9/wp-theme-template.git
```
clone後WordPressの本体をインストールしてください。


下記コマンドはnode.jsとgulpをインストールした上でしてください。
```
npm install
```
## 各タスク

###デフォルトのタスクの起動
これで、SCSSのコンパイル、画像圧縮、JSの圧縮のタスクが動きます。
```
gulp
```

###ブラウザシンク
デフォルトのタスクに加え、ブラウザシンクのタスクが起動します。
```
gulp sync
```

###スタイルガイド
スタイルガイドがコンパイルされます。
```
gulp styleguide
```
