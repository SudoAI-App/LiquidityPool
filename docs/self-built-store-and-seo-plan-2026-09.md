# 自建独立站 + SEO 实施方案（2026-09-14）

> 这是《方案全景与可行性调研 v2》的实施篇。前提：新加坡 Pte Ltd 作为主体，深圳 DDP 专线起步、后期美国 3PL；首选品类为 AI 设计桌面物件（艺术键帽、USB 设计灯），备选穿戴甲；创始人自己开发、自己每天写内容。技术底座直接复用本仓库（Astro 7 + Cloudflare Workers）。三条调研线：仓库栈扫描、2026 年自建电商栈、新站 Google/AI 搜索 SEO。标 ⚠ 的为二手来源或推算。

---

## 0. 一页结论

1. **技术栈：全自定义，Astro + Cloudflare Workers + Stripe Checkout 托管页，不用 Shopify、不用 Medusa。** 单人开发者在 Cloudflare 上只有两条现实路径：全自定义，或 Shopify Basic 作无头后端但结账必须跳 Shopify 托管页（非 Plus 不能改结账）。Medusa 不能跑在 Workers 上，要另租 Node + Postgres；Saleor 起步 $1,599/月；Commerce Layer 免费档 100 单/月、Crystallize 超额 $2.50/单；Lemon Squeezy/Paddle 只做数字商品；Commerce.js 已归档。四条路线年现金成本差距都在 $1,000 以内（全自定义约 $1,660/年 + Stripe 费），决定因素是开发时间和运营摩擦，而你已经有 Astro/Cloudflare/GA4/sitemap 管线。
2. **切换到无头 Shopify 的触发条件**：月单量 >1,000、需要店小秘/马帮原生同步、或需要多人客服后台。店小秘没有自建站 API 入口，只能手工/Excel 导入订单，所以早期用云途/4PX 开放 API 直连。
3. **支付**：Stripe 新加坡账户，本地卡 3.4% + S$0.50、国际卡 +0.5%；开 USD/EUR/GBP 结算账户避开 2% 换汇；用 Adaptive Pricing 做本币展示。Klarna 和 Afterpay 对新加坡主体均不可用，无头 Shopify 在支付上没有额外优势。
4. **税费在结账页的算法**：美国用 DDP 专线"税全包"报价把关税摊进运费/售价，不注册销售税（经济联结阈值 $10 万/州）；英国 ≤£135 由 Stripe Tax 代收 20% VAT，需注册 UK VAT；欧盟 IOSS（通过中介，€20/月起）代收 VAT + 自算每税则行 €3 作为独立 line item。Stripe Tax 0.5%/笔。
5. **SEO 现实**：Ahrefs 追踪 100 万个新页面，一年内进前 10 的只有 1.74%；上线后前 6 个月自然搜索收入预期接近零，早期流量靠 TikTok/Shorts/Pinterest。产品页、集合页、品牌词受 AI Overviews 侵蚀最轻；"vs"和问句类内容的 AIO 触发率 85–95%，其价值是被引用而不是点击。第一年收入模型不应假设自然搜索贡献 >20%。
6. **GEO 是上线即做的事，不是后期**：Google/Microsoft Merchant Center 免费列表、OpenAI 商家 feed（放行 OAI-SearchBot）、Perplexity 商家计划、每个 PDP 全量 Product/Offer/Review JSON-LD、Reddit 真实参与（AI 引擎引用份额约 40%）。llms.txt 可放但 Google 不用。IndexNow 只对 Bing/Yandex 有效，本仓库脚本可直接复用。

---

## 1. 从 LiquidityPool 复用什么，改什么

| 现有资产（文件） | 电商站用法 | 需要的改动 |
|---|---|---|
| `astro.config.mjs`（`output: 'static'`，`@astrojs/sitemap`） | 商品页/集合页/指南继续静态生成 | 改 `output: 'server'` + `@astrojs/cloudflare` adapter，商品页用 `prerender = true` |
| `wrangler.jsonc` + `worker/index.js`（仅 ASSETS 绑定，HTTPS/HSTS 中间件） | 边缘入口 | 加 D1（订单/设计/退货）、R2（上传图/印刷稿/GLB）、KV（购物车/汇率缓存）、Queues（履约任务）、Cron Triggers（弃购扫描） |
| `src/pages/sitemap.xml.ts` + `src/lib/public-routes.mjs`（git lastmod）+ `sitemap-index.xml` 并存 | 商品/集合/指南全部进 sitemap | 路由清单改为从商品数据生成；商品页 lastmod 用库存/价格更新时间 |
| `src/pages/robots.txt.ts`（已放行 GPTBot/ClaudeBot/PerplexityBot/CCBot） | 保留 | 加 OAI-SearchBot；结账/账户路径 Disallow |
| `src/layouts/BaseLayout.astro`（canonical、OG、Organization/WebSite JSON-LD） | 保留 | 加 hreflang 槽位（后期）、货币切换 |
| `src/pages/guides/[slug].astro`（TechArticle + BreadcrumbList + FAQPage） | 指南页直接复用 | 新增 `Product`/`ProductGroup`/`Offer`/`AggregateRating`/`VideoObject` 组件 |
| `src/components/Analytics.astro`（GA4 + Clarity，hostname 白名单，内部流量标记） | 保留 | 事件改为 `view_item`、`add_to_cart`、`begin_checkout`、`purchase`（GA4 电商标准事件），purchase 由 Stripe webhook 服务端上报 Measurement Protocol |
| `scripts/content-audit.mjs`（≥1,300 词、primaryQuery 去重、禁用词） | 指南质量闸门直接复用 | 加商品文案规则：title ≤70、description ≤160、每个集合页人工文案 ≥300 词 |
| `scripts/indexnow-submit.mjs` | Bing/Yandex 推送 | 不变 |
| `src/lib/articles.ts`（glob 读 markdown，无 content collections） | 指南 | 商品建议改用 Astro content collections + zod schema（变体、价格、GTIN、重量、HS 编码） |
| `src/lib/calculators/*.mjs` 的 URL-state 模式 | 集合页筛选、键帽兼容查询器、穿戴甲尺寸计算器 | 复用 |
| `tests/*.test.mjs`（node:test） | 保留 | 加 Stripe webhook 签名、税费计算、€3 行数计算的单元测试 |

缺失且必须新建：购物车、结账、支付、商品集合与变体/库存、动态 OG 图（satori/resvg 在 Workers 上生成）、站内搜索（Pagefind）、评论、退货、邮件。

---

## 2. 架构

```
Astro（预渲染商品页/集合页/指南，SEO 层）
  └ islands: <model-viewer> 3D 配置器、购物车（KV + localStorage）、货币切换

Cloudflare Workers（Hono 路由）
  POST /api/checkout        → Stripe Checkout Session
      line_items(price_data, tax_behavior=inclusive for EUR/GBP)
      automatic_tax=true（Stripe Tax：UK VAT / IOSS VAT；美国不开销售税）
      shipping_options：按目的国给 DDP 运费（美国含关税摊销）
      EU 订单追加 line item「EU customs €3 × 税则行数」
      adaptive_pricing=on，metadata{design_ids, market}
  POST /webhooks/stripe     → checkout.session.completed
      D1 写 orders/items/addresses → Queue 投递 fulfill 任务 → GA4 purchase（Measurement Protocol）
  Queue consumer（fulfill）
      生成印刷稿（satori/resvg → R2）→ 云途/4PX Open API 建单 → 回写 tracking
      → 17TRACK 注册 → Resend 订单确认 → Klaviyo Track「Placed Order」
  POST /webhooks/17track    → D1 shipments → 顾客状态页 /orders/{token}
  POST /api/returns         → D1 return_requests（自建 RMA 状态机）
  Cron（30 min）            → 扫 KV 购物车 → Klaviyo「Started Checkout」弃购流
  后期：按目的国路由到 ShipBob API（美国仓）

存储：D1（products 镜像、orders、order_items、designs、shipments、returns）
     R2（客户上传图、印刷稿、GLB、动态 OG 图）
     KV（购物车、汇率、运费表缓存）
第三方：Stripe Tax、Stripe Radar、Judge.me（平台无关 widget + REST）、Klaro 同意、GA4（已有）
```

**数据模型（D1）**：`products(id, slug, title, hs_code, weight_g, gtin, origin)`、`variants(id, product_id, sku, price_usd, stock, attrs_json)`、`designs(id, variant_id, source_r2, print_r2, status)`、`orders(id, token, stripe_session, market, currency, subtotal, tax, duty_line, shipping, status)`、`order_items`、`shipments(order_id, carrier, tracking, status, events_json)`、`returns(order_id, reason, status, resolution)`。

**落地顺序**：① Stripe SG 激活 + USD/EUR/GBP 结算 → ② IOSS 中介 + UK VAT 登记 → ③ Stripe Tax 录入登记号 → ④ Checkout + webhook + D1（1–2 周）→ ⑤ 云途 API 建单 → ⑥ 配置器与印刷稿 → ⑦ Klaviyo / Judge.me / 17TRACK。

---

## 3. 支付、税费、关税在结账页的实现

| 市场 | 结账价 = | 实现 | 注册/成本 |
|---|---|---|---|
| 美国 | 商品价 + DDP 运费（含关税摊销） | 不开 Stripe Tax 销售税；关税用深圳 DDP 专线"税全包"每公斤报价摊入，或 Easyship Tax & Duties API（$0.11/次）实时算后作为 shipping_option | 年 GMV ~$16 万分散 50 州触发不了 $10 万/州经济联结；2026-08 已有 17 州取消 200 笔门槛 |
| 英国 | 商品价 + 20% VAT（≤£135 无关税） | Stripe Tax `automatic_tax`，注册号录入 Dashboard | UK VAT 自办登记 £0 |
| 欧盟 | 商品价 + 目的国 VAT + €3 × 税则行数 | Stripe Tax（IOSS 号）+ 自算 €3 行 item；同 HS 品目多件只算一行 | IOSS 中介 €20/月起或 €99–400 开户 + €50–300/月 |
| 其他 | 商品价 + DDP 运费 | Adaptive Pricing 本币展示，顾客承担 2–4% 换汇 | — |

- Stripe Tax 覆盖 US/GB/全部 EU/SG，Basic 无代码 0.5%/笔；⚠ 需确认 SG 账户可添加 US/GB/IOSS 登记号与外币结算账户。
- Klarna（Business location 无 SG）与 Afterpay/Clearpay（仅 AU/CA/GB/NZ/US）对新加坡账户不可用。
- Stripe SG 受限业务清单对"从中国发货"无限制，激活时如实填写"自有品牌设计商品、深圳仓发货"，店内明示时效控争议率。Radar S$0.08/笔。
- PayPal SG 跨境 4.4% + 固定费 + 换汇 3–4%，只作备选。
- 落地成本 API 备选：Zonos $2 + 10%（关税+税）/订单；DHL Duty & Tax Calculator API；Passport/Global-e 企业级不适合起步。
- 关税税率变动极频繁（2026 年已换过三轮），**不要硬编码**，用 Zonos US Tariff Tracker 或 API。

---

## 4. 履约与物流对接

| 环节 | 方案 | 备注 |
|---|---|---|
| 深圳直发建单 | 云途 OPEN API（open.yunexpress.cn，OMS API v1.2.5：建单、面单、轨迹订阅）或 4PX FOP（open.4px.com，有 PHP/Java SDK） | 燕文开放平台文档未能抓取 ⚠ |
| ERP | 店小秘只支持白名单平台（36 个），自建站只能手工/Excel 导入；马帮/易仓宣称开放 API ⚠ | 早期跳过 ERP，Worker 直连专线 API；月 >1,000 单再评估无头 Shopify + 店小秘 |
| 轨迹 | 17TRACK API（Basic $119/12 个月，100 免费额度/月，含 webhook）比 AfterShip API（Premium ~$219/月 ⚠）省 | 顾客状态页 `/orders/{token}` |
| 美国 3PL（第二阶段） | ShipBob Developer API（Orders/Returns/Shipments/Webhooks + 沙盒）、ShipMonk REST + webhooks | Worker 按目的国路由 |
| 美国段聚合（可选） | EasyPost 3,000 单/月内免费；Shippo $0.05/单 | 3PL 阶段用 |
| 退货 | 自建表单 + 状态机；Loop 仅 Shopify，ReturnGO 非 Shopify 约 $417/月 ⚠ | 300 单/月自建更划算 |

---

## 5. 产品定制器

- 3D 预览：`<model-viewer>`（GLB + AR）或 Three.js，Astro 岛屿化按需加载，零成本。
- 上传：客户图 → Workers 预签名 URL 直传 R2 → D1 记 design_id。
- 印刷稿：下单后 Queue 触发 Worker 用 satori/resvg 生成 PNG/SVG 存 R2，链接写入云途建单备注并邮件给深圳作坊。
- 商用定制器备选：Zakeke REST API 2.0 可拉印刷文件 zip，但 API/白标属企业档 ⚠；Customily 无公开 headless API ⚠。自建更贴合"AI 图生 3D"流程。

---

## 6. 自建店必备清单

| 项目 | 方案 | 成本 |
|---|---|---|
| 欺诈 | Stripe Radar + 3DS | S$0.08/笔 |
| 弃购邮件 | Klaviyo Track API（251–500 profiles $20/月）或 Resend（免费 3,000 封/月） | $0–30/月 |
| 评论 | Judge.me 平台无关 widget + REST（Free / Awesome $15/月）；AggregateRating 只用自有一方真实评论 | $0–15/月 |
| 退货 | 自建 RMA | $0 |
| Cookie 同意（EU） | Klaro 或 orestbida/cookieconsent 开源 | $0 |
| PCI | Stripe Checkout 托管页 → SAQ A；结账链路不加载可疑第三方脚本（PCI 4.0.1） | $0 |
| 运行时 | Cloudflare anycast；Better Stack/UptimeRobot 免费 | $0 |
| 订单状态页 | D1 + 17TRACK webhook | $0 |
| 站内搜索 | Pagefind（静态索引） | $0 |
| 动态 OG 图 | satori + resvg-wasm 在 Workers 生成 | $0 |

**第一年成本（300 单/月，AOV $45，年 GMV ≈ $162k）**：Workers Paid $60 + Klaviyo $360 + Judge.me $180 + 17TRACK $119 + Easyship 关税调用 ≈$130 + Stripe Tax ≈$810 ≈ **$1,660**；另加 Stripe 处理费约 4.5–5% ≈ $7,500、IOSS 中介 €240–1,200。对比 Shopify Basic 主题店 ≈$1,500–2,100、无头 Shopify ≈$1,550–2,150、Medusa 自托管 ≈$1,700–2,400。

---

## 7. SEO：2026 年的现实

| 事实 | 数据 | 来源 |
|---|---|---|
| AI Overviews 对第 1 位 CTR | −58%（2023-12 vs 2025-12，30 万词） | Ahrefs 2026-02-04 |
| AIO 出现率 | 信息型 36%、商业型 8%、交易型 5%；对比类 95.4%、问句类 85.9% | Seer 2026-04-24 |
| 商业意图 AIO 覆盖 | 6 个月 +71%，电脑/电子类 +107.6%；交易型电子类 +80.45% | Semrush 2026-07-02 |
| 品牌词 | 有 AIO 时 CTR 反而 +18.68% | Amsive 2025-04 |
| 零点击 | 68.01%（2024 年 60.45%） | Similarweb/SparkToro 2026-06-09 |
| 新页面一年内进前 10 | 1.74%；能进者 40.8% 在 1 个月内完成 | Ahrefs |
| 2026-08 垃圾更新 | 程序化 + AI 拼贴站丢 20 万+ 查询；AI 内容本身不违规，"批量无附加值"才是 | GSQI；Google 生成式 AI 指南 2025-12-10 |
| ChatGPT 购物 | Instant Checkout 2026-03 停用，改为"AI 内发现、商家站内成交"；非 Shopify/Etsy 商家需提交 feed 并放行 OAI-SearchBot | Forbes 2026-03-10；OpenAI 文档 |
| AI 引擎引用来源 | Reddit ≈40%；YouTube 在 AIO 占 20.9%、Perplexity 占 31.2% ⚠ 口径差异大 | everything-pr 2026 |
| GSC 生成式 AI 报告 | 2026-06-03 上线，仅展示 impressions | Google |
| 键盘/桌搭品牌自然流量 | Keychron 49%、Oakywood 21.85% 来自自然搜索 | Similarweb 2025-06 |

**含义**：键帽属"电脑/电子"交易型，AIO 覆盖增长最快，商业词点击会继续下降；靠集合页、PDP、品牌词和"被引用"取胜。穿戴甲的 sizing 类词 SERP 被 Etsy market 页占满，质量低，可用工具页 + 视频突破。

### 7.1 关键词簇（量级为估算 ⚠，精确值需 Ahrefs/Semrush/Keyword Planner）

| 簇 | 核心词 | 量级 | 意图 | 现占位者 | 切入 |
|---|---|---|---|---|---|
| A 键帽核心 | mechanical keyboard keycaps / keycap sets / custom keycaps | 高 | 商业 | Amazon、Drop、Keychron、KBDfans、Etsy | 首年不打头部词，集合页承接长尾 |
| B 手工键帽 | artisan keycaps / resin keycaps / 3D printed keycaps | 中 | 商业+信息 | Etsy、Jellykey、keycap-archivist | "AI 设计一物一码"故事 + 制作过程页；3D printed keycaps 竞争弱 |
| C 兼容/尺寸 | keycap profiles explained / Cherry vs OEM vs SA / keycap compatibility 65% 75% | 中 | 信息（AIO 高触发） | Keychron blog、Switch and Click | 交互式兼容查询器 + 对照图，争取被引用 |
| D 桌搭 | desk setup / desk accessories / aesthetic desk setup ideas | 高 | 信息→商业 | Hexcal、Reddit、Pinterest、YouTube | 图片 SEO + Pinterest 主战场；套装集合页 |
| E 灯具 | sunset lamp / ambient lamp / aesthetic desk lamp / 3D printed lamp / USB desk lamp | 中高 | 商业 | Amazon、Etsy、Wayfair | "3D printed lamp""USB ambient lamp"长尾竞争低 |
| F 对比 | best artisan keycaps / Drop vs Novelkeys | 低中 | 商业调查 | Reddit、YouTube | 目标是被 AIO/ChatGPT 引用 |
| G 穿戴甲（备选） | press on nails / custom press on nails / press on nail sizing / how to measure nails | 高 | 商业+信息 | Etsy、Olive & June、Glamnetic | 尺寸测量工具页 + 定制流程页 |
| H 品牌/礼品 | [品牌] keycaps、gift for keyboard enthusiast、desk gift ideas | 低→随品牌增长 | 导航/礼品 | — | Q4 礼品专题 |

### 7.2 12 个月计划（2026-10 → 2027-09）

| 阶段 | 月份 | 目标 | 关键动作 |
|---|---|---|---|
| 0 上线前 | 2026-10 | 技术与数据底座 | Product/ProductGroup/Offer/Review/FAQ/VideoObject JSON-LD；双 sitemap；robots 放行 AI 爬虫 + OAI-SearchBot；CWV 全绿（首图不 lazy、预加载字体、INP <200ms）；GSC/GA4/Clarity；Google + Microsoft Merchant Center 免费列表（GTIN 或申报豁免）；OpenAI 与 Perplexity 商家申请；IndexNow；Pinterest 商家号 + 商品目录；首批 20 篇簇 C/E 指南待发 |
| 1 索引期 | 11–12 月 | 全站可索引，品牌词第 1 | 每周 3 篇指南（兼容/尺寸/制作过程）；Q4 礼品专题；TikTok/Shorts 每条带落地页；Reddit 每日 1 条真实回答（r/MechanicalKeyboards、r/battlestations、r/desksetup）；首批 10 条低价外链（设计博客/寄样） |
| 2 长尾试探 | 2027-01–03 | 50+ 非品牌长尾进前 30 | 程序化集合页第一批（≤50 页，人工文案 ≥300 词）；对比页 6 篇；YouTube 长视频 4 条（profile、lamp setup、AI 设计流程）；GSC 生成式 AI 报告基线 |
| 3 引用期 | 4–6 月 | 被 AIO/ChatGPT/Perplexity 引用；非品牌点击占比 >40% | 交互式工具页（键帽兼容查询器）；数据型数字 PR（"1,000 位桌搭用户调查"）；评论系统上线，AggregateRating 生效；复核 Q1 内容更新 lastReviewed |
| 4 扩张期 | 7–9 月 | 自然收入占比 15–25%；UK/EU 子目录 | /en-gb/ /en-eu/ 子目录 + hreflang + 本地运费页；第二批集合页；Pinterest 与 Google Images 图片矩阵；季度垃圾更新回顾（程序化页占比 <50%） |

### 7.3 内容运营与测量

- 节奏：每周 3 篇指南（≥1,300 词，走 `pnpm content:audit`）+ 2 个集合/PDP 文案 + 1 个 Reddit 深度回答；季度回顾更新旧文。超过此量而缺一手素材（实拍、实测、数据）即接近 scaled content 风险。
- E-E-A-T 落点：创始人作者页、制作过程记录、真实评论、媒体/社区提及。
- 外链：2026 行业均价每条 $370–500，数字 PR 每条 $600–1,500；首年以设计媒体投稿 + 寄样评测 + 数据型内容换链接，预算 <$1k/月。
- 国际化：首年一个 en 主站 + 货币切换 + 各市场配送/税费页；有流量后再拆 /en-gb/ /en-eu/ 子目录 + hreflang（Mueller 立场：子目录优于子域）。
- 测量：GSC（含生成式 AI 报告）、GA4 电商事件、Merchant Center AI Mode 品牌报告、UTM/referrer 分离 chatgpt.com / perplexity.ai / copilot。

---

## 8. 上线前技术 SEO 清单（Astro 专项）

- [ ] `Product` + `ProductGroup`（变体）+ `Offer`（价格、货币、availability、shippingDetails、hasMerchantReturnPolicy）+ `AggregateRating` JSON-LD，与 Merchant Center feed 同源（价格/库存不一致会被同时降权，GTIN 缺失掉出多商家簇）
- [ ] 指南页 `TechArticle`/`Article` + `BreadcrumbList` + `FAQPage` + `VideoObject`（复用现有组件）
- [ ] 集合页人工文案 + 筛选参数 canonical 归一，分面 URL `noindex`
- [ ] 首屏图 `loading="eager"` + `fetchpriority="high"`，其余 lazy；WebP/AVIF，多角度图，文件名与 alt 含产品词；`ImageObject`
- [ ] 字体 preload、关键 CSS 内联、岛屿按需 hydrate（INP）
- [ ] 双 sitemap + sitemap-index，商品 lastmod 取更新时间；robots 放行 GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot，Disallow `/checkout` `/orders` `/api`
- [ ] Merchant Center（Google + Microsoft）feed 由构建脚本生成 TSV/XML；OpenAI 商家 feed 同源
- [ ] 动态 OG 图；`hreflang` 槽位预留；货币切换不改 URL（首年）
- [ ] GA4 电商事件 + Measurement Protocol 服务端 purchase；Clarity
- [ ] `content-audit` 扩展商品文案规则；`tests` 覆盖 JSON-LD 必填字段与 feed 一致性

---

## 9. 8 周构建排期（单人）

| 周 | 交付 |
|---|---|
| 1 | 新仓库从 LiquidityPool 派生：改 adapter、绑定 D1/R2/KV/Queues；products content collection + zod schema；PDP/集合页模板 + Product JSON-LD |
| 2 | Stripe SG 激活、USD/EUR/GBP 结算；`/api/checkout` + Stripe Checkout Session + Adaptive Pricing；webhook → D1 orders；订单确认邮件（Resend） |
| 3 | 税费：UK VAT 登记、IOSS 中介签约、Stripe Tax 录号；EU €3 行计算 + 单测；DDP 运费表（云途/4PX 试算结果）→ shipping_options |
| 4 | 云途/4PX Open API 建单 Worker + Queue；17TRACK 注册与 webhook；`/orders/{token}` 状态页 |
| 5 | 定制器：model-viewer + R2 上传 + 印刷稿生成；设计确认页；GA4 电商事件 |
| 6 | 购物车（KV）、弃购 Cron → Klaviyo；Judge.me；Klaro 同意；退货表单 + RMA 状态机 |
| 7 | SEO 底座：双 sitemap、robots、Merchant Center feed 生成脚本、OpenAI/Perplexity 商家申请、Pinterest 目录、动态 OG、Pagefind；CWV 调优 |
| 8 | 首批 20 篇指南入库（content-audit 通过）、10 个 SKU 上架、端到端下单测试（美/英/德各一单）、上线 |

---

## 10. 待验证

1. Stripe SG 账户能否添加 USD/EUR/GBP 外币结算账户、录入 US/GB/IOSS 登记号；Chargeback Protection 在 SG 是否可用。
2. 云途/4PX Open API 的开发者账号审核条件（需深圳贸易公司主体）；燕文开放平台文档。
3. 键帽/灯具的精确 Google 月搜索量（Ahrefs/Semrush）；Semrush"2.8 万域名 6 个月 19%"原文。
4. Merchant Center 对无 GTIN 自制商品的豁免流程；OpenAI 商家 feed 审核周期。
5. 店小秘/马帮是否有未公开的自建站 API 通道。
6. Zakeke API 档位价格（若不自建定制器）。

---

## 来源（均于 2026-09-14 访问）

**技术栈与支付**
- Shopify pricing https://www.shopify.com/pricing ；Storefront Cart https://shopify.dev/docs/api/storefront/latest/objects/Cart ；结账定制限制 https://www.shopify.com/enterprise/blog/customize-shopify-checkout
- Medusa pricing https://medusajs.com/pricing ；Medusa 自托管成本（Swell 2026-04-04）https://swell.is/content/medusa-pricing ；Medusa on Cloudflare 限制 https://github.com/casualchic/medusa-payload-cloudflare
- Swell https://swell.is/help/pricing/pricing-plans ；Commerce Layer https://commercelayer.io/pricing ；Crystallize https://crystallize.com/pricing
- Lemon Squeezy 禁售 https://docs.lemonsqueezy.com/help/getting-started/prohibited-products ；Snipcart https://snipcart.com/pricing ；Foxy https://foxy.io/pricing ；Commerce.js 归档 https://github.com/chec
- Stripe SG pricing https://stripe.com/en-sg/pricing ；Klarna https://docs.stripe.com/payments/klarna ；Afterpay https://docs.stripe.com/payments/afterpay-clearpay ；Adaptive Pricing https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing ；受限业务 https://stripe.com/en-sg/legal/restricted-businesses
- Stripe Tax pricing https://stripe.com/tax/pricing ；覆盖国家 https://docs.stripe.com/tax/supported-countries
- Cloudflare Workers pricing https://developers.cloudflare.com/workers/platform/pricing ；D1 https://developers.cloudflare.com/d1/platform/pricing

**税费、关税与物流**
- GOV.UK 海外卖家 VAT https://www.gov.uk/guidance/vat-and-overseas-goods-sold-directly-to-customers-in-the-uk
- TAXUD €3 指引（2026-06-08）https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en ；IOSS 中介费用 https://avask.com/blog/ioss-registration-cost
- Avalara 经济联结（2026-08-03）https://www.avalara.com/blog/en/north-america/2025/07/economic-nexus-thresholds.html ；Zonos US tariff tracker https://zonos.com/docs/guides/us-tariff-changes
- Zonos Landed Cost pricing https://zonos.com/docs/global-ecommerce/landed-cost/pricing ；Easyship API（2026-01）https://www.easyship.com/blog/easyships-upgraded-global-shipping-api-for-ecommerce
- 云途开放平台 https://open.yunexpress.cn/openApi/doc ；4PX FOP https://open.4px.com/apiInfo/introduce ；店小秘平台授权 https://help.dianxiaomi.com/article/platformAuthorization/1482 ；手工订单 https://help.dianxiaomi.com/article/orderManagement/328
- EasyPost https://www.easypost.com/pricing ；Shippo https://goshippo.com/pricing ；ShipBob API https://developer.shipbob.com ；ShipMonk API https://apidocs.shipmonk.com ；17TRACK API https://www.17track.net/en/api
- Klaviyo 自定义集成 https://developers.klaviyo.com ；Judge.me API https://judge.me/help/en/articles/8394958 ；ReturnGO 自定义平台 https://support.returngo.ai/custom-ecommerce-platform ；Zakeke API https://docs.zakeke.com/docs/API/designs-API

**SEO 与 AI 搜索**
- Ahrefs, AIO −58%（2026-02-04）https://ahrefs.com/blog/ai-overviews-reduce-clicks-update ；新页面排名（1.74%）https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/
- Seer, AIO CTR 2026（2026-04-24）https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-2026-update
- Semrush 商业意图 AIO（2026-07-02）https://www.semrush.com/blog/ai-overviews-commercial-search-study/
- Amsive AIO CTR（2025-04）https://www.amsive.com/insights/seo/google-ai-overviews-new-research-reveals-how-to-navigate-click-drop-off/
- SparkToro/Similarweb 零点击（2026-06-09）https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/
- Google AI features https://developers.google.com/search/docs/appearance/ai-features ；生成式 AI 内容指南（2025-12-10）https://developers.google.com/search/docs/fundamentals/using-gen-ai-content ；Merchant listing schema https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- GSQI 2026-08 垃圾更新案例 https://www.gsqi.com/marketing-blog/august-2026-google-spam-update-case-studies/
- Forbes, OpenAI checkout retreat（2026-03-10）https://www.forbes.com/sites/jasongoldberg/2026/03/10/why-openais-checkout-retreat-spells-trouble-for-its-commerce-strategy/ ；OpenAI feed spec https://developers.openai.com/commerce/specs
- Perplexity 商家计划 https://aiadvantageagency.com/perplexity-merchant-program/ ；Microsoft Copilot 购物 https://almcorp.com/blog/microsoft-copilot-checkout-brand-agents-guide/ ；Merchant Center for AI Mode https://www.paz.ai/guides/google-merchant-center-for-ai-mode
- AI 引用来源 https://everything-pr.com/ai-platform-citation-source-index-2026 ；Mueller on llms.txt https://www.searchenginejournal.com/googles-mueller-says-llms-txt-cant-help-llms-differentiate-sites/579304/ ；IndexNow 支持范围 https://www.indexernow.com/google-indexnow
- GSC 生成式 AI 报告 https://crawlraven.com/blog/gsc-ai-performance-reports ；Reddit SEO 案例 https://www.seoasis.io/blog/how-to-use-reddit-for-ecommerce-seo ；外链定价 https://outreachdesk.com/link-building-pricing/
- Pinterest 统计 https://sproutsocial.com/insights/pinterest-statistics/ ；Astro CWV https://nodeascend.com/blog/astro-js-seo-guide-2026/
- Break The Web 案例（2026-07-16）https://breaktheweb.agency/ecommerce/shopify-seo-case-studies/ ；Similarweb keychron.com https://www.similarweb.com/website/keychron.com/
- 键帽 profile 竞品内容 https://www.keychron.com/blogs/news/keycap-profiles ；Etsy sizing SERP https://www.etsy.com/market/press_on_nail_sizing
