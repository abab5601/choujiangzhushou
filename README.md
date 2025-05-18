# 彩票助手 (Lottery Assistant)

一個使用 Vue 3 + TypeScript + Vuetify 3 開發的彩票管理應用。

## 功能特點

- 🎫 多種彩票輸入方式
  - 單張輸入
  - 批量輸入（支持逗號分隔或換行）
  - 範圍輸入（自動生成連續號碼）
- 🎯 中獎管理
  - 手動標記中獎
  - 批量輸入中獎號碼
  - 隨機抽獎功能
- 🎪 抽獎動畫效果
  - 老虎機效果（多數字滾動）
  - 翻牌效果（逐個揭曉）
  - 抽獎箱效果（搖動開獎）
  - 支持無動畫模式
  - 記住動畫選擇功能
- 📊 數據統計
  - 總彩票數量統計
  - 中獎數量統計
  - 最近添加記錄
- 📝 歷史記錄
  - 開獎歷史記錄
  - 中獎記錄查詢
- 💾 數據管理
  - 本地數據持久化
  - 數據導入導出功能

## 在線演示

訪問 [GitHub Pages 演示](https://abab5601.github.io/choujiangzhushou/) 查看應用。

## 技術棧

- Vue 3
- TypeScript
- Vuetify 3
- Vite
- Pinia (狀態管理)
- Vue Router

## 本地開發

### 環境要求

- Node.js (推薦 v18 或更高版本)
- pnpm (v8.6.12 或更高版本)

### 安裝依賴

```bash
pnpm install
```

### 開發模式

```bash
pnpm dev
```

### 構建生產版本

```bash
pnpm build
```

### 預覽生產版本

```bash
pnpm preview
```

## 部署

本項目使用 GitHub Pages 進行部署。當推送到 `gh-pages` 分支時，會自動觸發部署流程。

### 手動部署步驟

1. 構建生產版本：
```bash
pnpm build
```

2. 將 dist 目錄推送到 gh-pages 分支：
```bash
git add dist -f
git commit -m "Add dist for GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## 開發者

開發過程中的主要工作：
- 需求分析和功能設計
- Vue 3 + TypeScript 技術選型
- Vuetify 3 組件庫的運用
- Pinia 狀態管理的實現
- 本地存儲的實現
- 用戶界面優化
- 代碼質量保證
- 動畫效果實現
- Google Analytics 整合

## 許可證

本項目採用 MIT 許可證，詳見 [LICENSE](LICENSE) 文件。

## 貢獻

歡迎提交 Issue 和 Pull Request 來改進本項目。

## 更新日誌

### v1.1.0
- 新增抽獎動畫效果
  - 添加老虎機動畫效果
  - 添加翻牌動畫效果
  - 添加抽獎箱動畫效果
  - 支持無動畫模式
  - 添加記住動畫選擇功能
- 優化動畫顯示效果
  - 支持自動換行
  - 改進動畫流暢度
  - 優化動畫組件結構
- 添加 Google Analytics 追蹤功能
  - 追蹤頁面訪問
  - 追蹤用戶行為
  - 追蹤動畫使用情況

### v1.0.0
- 初始版本發布
- 實現基本的彩票管理功能
- 添加數據持久化支持 