# 全球上市公司业绩指引监控｜商业版网页项目

这是一个完整的静态网页项目，不是单独 HTML 文件。用于把 Feishu 正式文档和 Base 中的“全球上市公司业绩指引监控”成果包装成可商用展示的数据产品落地页。

## 项目内容

- `index.html`：Vite 入口
- `src/main.js`：页面结构渲染
- `src/styles.css`：商业版视觉样式
- `src/data/product-data.js`：页面数据源，包含事件类型、信号强度、方向、产业链、解读、日期、官方来源链接、Base 记录和原文摘录等证据字段，后续可替换为接口或构建时同步脚本
- `scripts/check-data.mjs`：数据契约检查，确保关键展示字段和证据字段齐全
- `package.json`：项目脚本

## 已接入的正式链接

- 正式文档：<https://ycn3zdw6f1p7.feishu.cn/wiki/WgK3wNP7yioPkck7Hl2cwHkgnJh?from=from_copylink>
- Base：<https://ycn3zdw6f1p7.feishu.cn/base/Wl13bilQjadaiSsU8RmcJOPjnde?from=from_copylink>

## 本次实际改动在网页中的表达

1. 正式文档升级为全球版，新增欧洲、中国香港、中国台湾观察。
2. Base 升级为全球上市公司口径。
3. 业绩事件表补齐上市地/交易所、股票代码、国家/地区、行业板块、来源链接和原文摘录。
4. 新增 ASML、Infineon、Nokia、STMicroelectronics、Lenovo Group、Hon Hai 等全球上市公司样本。
5. 将材料整理成商业数据产品叙事：首屏、核心指标、覆盖范围、洞察、事件样本、商用展示边界。
6. 新增最新事件面板，以及按地区、板块、信号强度、方向和关键词筛选的样本表。
7. 新增表格/卡片双视图、筛选摘要、CSV 导出、数据方法论和官方来源复核入口。
8. 重新设计为高端情报指挥台前端：深色矿物底、金色证据链、青绿色状态、动态信号网络、滚动 reveal、数字动效和 spotlight 微交互。

## 开发命令

```bash
npm install
npm run check
npm run build
npm run dev
```

## 商用注意

页面声明了“非投资建议”和来源边界。正式商用前建议补充品牌 Logo、产品名、联系方式、隐私条款和服务条款。
