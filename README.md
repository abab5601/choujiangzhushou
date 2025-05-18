# 抽獎助手

一個簡單易用的抽獎工具，幫助您管理和進行抽獎活動。

## 分支說明

本專案使用以下分支管理策略：

### main 分支
- 主要開發分支
- 不包含追蹤代碼
- 用於開發和測試新功能
- 包含所有核心功能

### tracking 分支
- 生產環境分支
- 包含 Google Analytics 追蹤代碼
- 用於部署到生產環境
- 包含所有追蹤和分析功能

### gh-pages 分支
- 部署分支
- 包含構建後的文件
- 用於 GitHub Pages 部署
- 自動從 tracking 分支更新

## 功能特點

- 隨機抽獎
  - 支持設置抽獎數量
  - 多種動畫效果
  - 記住動畫偏好設置
- 手動輸入中獎號碼
  - 批量輸入
  - 自動比對
  - 即時反饋
- 歷史記錄
  - 查看歷史開獎記錄
  - 按時間排序
- 搜索和篩選
  - 搜索特定號碼
  - 篩選中獎/未中獎
- 數據管理
  - 本地存儲
  - 導入/導出功能
- 用戶界面
  - 響應式設計
  - 暗色主題支持
  - 動畫效果
- 開發相關
  - TypeScript 支持
  - Vue 3 組合式 API
  - Pinia 狀態管理
  - Vuetify UI 框架

## 開發指南

### 安裝依賴

```bash
pnpm install
```

### 開發環境運行

```bash
pnpm dev
```

### 生產環境構建

```bash
pnpm build
```

### 預覽構建結果

```bash
pnpm preview
```

## 部署說明

1. 確保您在正確的分支上（main 用於開發，tracking 用於生產）
2. 運行構建命令：`pnpm build`
3. 提交更改到對應分支
4. GitHub Actions 會自動部署到 GitHub Pages

## 貢獻指南

1. Fork 本專案
2. 創建您的特性分支：`git checkout -b feature/AmazingFeature`
3. 提交您的更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 開啟一個 Pull Request

## 待辦事項

- [ ] 添加更多動畫效果
- [ ] 優化移動端體驗
- [ ] 添加多語言支持
- [ ] 改進錯誤處理
- [ ] 添加單元測試

## 授權協議

本專案基於 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解更多詳情。

## 致謝

- Vue.js 團隊
- Vuetify 團隊
- 所有貢獻者 