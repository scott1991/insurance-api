# express-es6-spa-example

Getting Started
---------------

- 重命名 `server/config/config.json.example` to `server/config/config.json`
- 編輯 `config.json`
- 在DB中新建資料庫
- `npm start` 會自動建立table `policyholders`
- 執行 `server/tests/importsample.js` 將會匯入sample data

Note
---------------
- 專案使用express ES6 modules, import
- 專案使用ES6 Importing JSON modules，目前須使用 node version > 16
- 使用sequelize來定義資料庫，方便切換DB如SQL Server, MySQL
- 匯入sample data，由於關聯性問題會先INSERT再UPDATE
- `server/tests/tree.html`內有範例樹狀圖


