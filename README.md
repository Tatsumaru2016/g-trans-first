# G.trans (v5)

G.trans の新規プロジェクト。7 ステージの 3D スクロール体験です。

旧フォルダ（`G:\g.trans.first` など）は使用せず、**`G:\g.trans.5`** を作業ディレクトリとしてください。

## 技術スタック

- React 19 + TypeScript + Vite 6
- Three.js + GSAP
- Tailwind CSS v4 + Motion

## ローカル起動

```bash
cd G:\g.trans.5
npm install
npm run dev
```

ブラウザ: http://localhost:3015

## 操作

- スクロールで 7 ステージを進行
- 左 HUD からステージジャンプ可能

## ビルド / GitHub Pages

```bash
npm run build:pages
```

GitHub Pages 用 workflow は `.github/workflows/pages.yml` に含まれています。
