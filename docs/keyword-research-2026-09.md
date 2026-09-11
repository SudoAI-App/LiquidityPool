# LiquidityPools.app 关键词研究报告（2026-09-11）

> 目标：找出「liquidity pools / AMM / LP」方向上应尽可能命中的关键词，评估站内覆盖缺口，给出优先级与执行建议。

---

## 1. 方法论与数据源

| 数据源 | 方法 | 产出 |
|---|---|---|
| Google Autocomplete | 10 个种子词 × a–z 字母扩展 + 疑问词/修饰词模板，共 343 次查询 | 1,316 个唯一建议词 |
| Bing Autocomplete | 同一批种子 | 417 个唯一建议词 |
| DuckDuckGo Autocomplete | 同一批种子 | 374 个唯一建议词 |
| Google Trends | 直连 API 抓取相关查询 | **被限流（429），未取得** |
| SERP 采样 | 8 组目标聚类的人工搜索 | 竞品格局 + 意图验证 |
| 站内 | sitemap.xml（28 URL）+ 24 篇文章 frontmatter `keywords` | 覆盖映射 |

**去噪**：1,636 → 1,160 个有效词（剔除 "impermanent loss" 误展开出的医学类 ~130 词、crop/OSRS farming ~25 词、无关词）。

**需求量级为代理指标**：以「该词在 343 次扩展查询中出现的次数」（下称 **F**）分层：
- **T1 高需求**：F ≥ 6；**T2 中需求**：F 3–5；**T3 长尾**：F 1–2。

**局限**：无 GSC / 付费工具（Ahrefs、SEMrush）绝对搜索量；Google Trends 被限流。建议接入 Google Search Console 后，用真实曝光/点击数据校准本报告的分层。

---

## 2. 需求总览：15 个主题簇

按 Google suggest 有效词聚类（一词归一簇）：

| 簇 | 规模 | 代表词（F） | 站内覆盖 |
|---|---|---|---|
| 收益/费率语义场 | 159 | yield farming explained (11)、liquidity pools with highest APY (4)、yield farming guide (3) | **缺失主体**（仅 liquidity-mining 侧写） |
| 定义/是什么 | 105 | what is liquidity pools (29)、lp tokens meaning (8)、liquidity pool meaning in trading (4) | ✅ 强（what-is-a-liquidity-pool 等 5 篇） |
| 无常损失 | 66 | what is impermanent loss (6)、IL calculator with range (3)、IL formula (3) | ⚠️ 文章强、**工具缺失** |
| AMM | 56 | automated market maker explained (19)、AMM 学术论文词群 | ✅ 强 |
| 流动性挖矿 | 53 | what is liquidity mining (20)、liquidity mining vs yield farming (3) | ✅ 有；缺对比位 |
| 计算器/工具 | 40 | liquidity pool calculator (4)、IL calculator uniswap v3、xrp pool calculator | ❌ **全缺** |
| How-it-works | 40 | how liquidity pools work (10)、how do LPs make money (4) | ⚠️ 部分 |
| 平台·Solana | 31 | raydium / meteora / jupiter / pump fun | ⚠️ 仅 DLMM 一篇 |
| 平台·其他 | 32 | pancakeswap / binance / bybit / aerodrome | ❌ 缺 |
| Forex/SMC 语义场 | 26 | liquidity pool vs sweep、FTMO/Exness liquidity provider | ❌ 有意**不覆盖主体**（见 §4） |
| LP Token | 24 | what is an lp token (8)、lp tokens meaning (8) | ✅ |
| 对比类 | 23 | pool vs yield farming (6)、staking vs YF vs LM、pool vs staking | ❌ **缺** |
| 平台·Uniswap | 18 | best liquidity pools uniswap、create pool uniswap、v3/v4 calculator | ⚠️ 仅 v4 架构 |
| 风险/安全 | 18 | are liquidity pools safe (8)、are pools legit (3)、pool dried up | ⚠️ 机构视角，缺大众视角 |
| 合规（Halal） | 12 | is providing liquidity halal/haram (各 3) | ❌ 缺 |

补充高频散点（other 簇中值得单独注意）：
`liquidity pool explained` (18)、`liquidity provider example` (12)、`liquidity pool example` (11)、`liquidity pool strategy` (4)、`liquidity pool taxes` (4)、`liquidity pool delta neutral` (3)、`liquidity pools for beginners` (3)、`which liquidity pool is best` (3)、`liquidity pool formula` (3)、`liquidity pool burned meaning` (3)。

多语言信号出现在建议词中：`que es`（西语 ×9）、`was ist ein`（德语）、`c'est quoi`（法语）、`là gì`（越南语）——证明非英语需求真实存在（见 §6 P2）。

---

## 3. 站内覆盖映射（24 篇 → 簇）

**已覆盖且强的簇**：定义、AMM、无常损失（文章面）、LP Token、流动挖矿、TVL/链上指标、MEV、跨链、稳定币池、做市、协议专文（Uniswap v4 / Curve v2 / Balancer / DLMM / 范围订单 / 恒定乘积）。
→ 结论：**机制/学术纵深已是站点护城河**（LVR、hooks、bin math 这类词大站不写、竞争极低）。

**结构性缺口**（按簇）：
1. **Yield farming 主体内容缺失**——最大缺口。需求侧 yield farming 词群规模第二大（237 bigram 命中），站内只有 liquidity mining 一篇。
2. **对比类全缺**——staking vs yield farming vs liquidity mining 三方对比、pool vs staking 等 23 词无人认领。
3. **工具全缺**——IL 计算器（v3/range 变体）、pool APY/APR 计算器等 40 词，SERP 全是独立小工具站（poolfish.xyz、otomato.xyz、loris.tools、metrix.finance、Desmos 图表），**没有大站认真做**。
4. **大众风险/收益视角缺**——"are pools safe / profitable / worth it"、"how do LPs make money"（Reddit、Quora、YouTube 占位）。
5. **平台生态内容缺**——Uniswap LP 实操、Solana（Raydium/Meteora/Jupiter）、PancakeSwap、Base（Aerodrome）。
6. **税务缺**——liquidity pool taxes / liquidity mining 报税（含德语 cointracking 信号）。

---

## 4. 语义边界警告（避免误伤）

1. **Forex/SMC「liquidity pools」是另一个市场**：指 swing high/low 附近的挂单聚集区（ICT、LuxAlgo、ThinkMarkets 主导），与 DeFi 池完全不同意图。FTMO/Exness/FundedNext 的 "liquidity provider" 指 broker 上游。**不要**把这些词混进 DeFi 文章（会稀释主题相关度）。仅建议一篇清晰的消歧文章承接困惑流量（`liquidity pool vs liquidity sweep` F=3、`liquidity pool vs market cap` F=4、`liquidity pool meaning in trading/forex`）。
2. **Creator-side 词群**（how to create a liquidity pool on pump fun/raydium、liquidity pool burned/locked meaning）是发行者/项目方意图，与 LP 投资者意图不同，单独成篇或放弃。
3. **"best liquidity pools" 数据页**需要真实 APY 数据（fensory、CoinMarketCap/yield 占位）。没有数据管道就只做方法论文章（how to find/evaluate），不做空壳 listicle——与站内 anti-fluff 标准一致。

---

## 5. 机会清单（按优先级）

### P0 —— 30–60 天可赢，需求强、竞争弱、内链支撑好

| # | 目标关键词 | F | SERP 现状 | 动作 |
|---|---|---|---|---|
| 1 | `yield farming explained` / `what is yield farming` / `how does yield farming work` | 11/5/3 | Binance Academy、gate.com 等大站泛文 + 弱博客 | **新支柱文章**：Yield Farming Explained（机制+数字演算，按站内 5 阶段标准），内链 liquidity-mining、impermanent-loss、how-to-provide-liquidity |
| 2 | `staking vs yield farming vs liquidity mining` / `liquidity pool vs staking` / `yield farming vs liquidity mining` | 6/3/3 | blockchain-council、101blockchains 等弱教育站 | **新文章**：三方对比（费用来源/风险/资本效率矩阵表），同一篇覆盖 pool vs staking、pool vs farming 变体 |
| 3 | `impermanent loss calculator`（+uniswap v3/range/raydium 变体） | 3–4/变体 | 独立小工具站，无大站 | **建交互工具** `/tools/impermanent-loss-calculator`：价格比率→IL%，支持 concentrated range；配套短文讲公式（内链 IL 文章）。Astro 静态站 + 客户端 JS 可行 |
| 4 | `liquidity pool explained` / `liquidity pools explained` | 18/14 | 大站泛文 | **改造** what-is-a-liquidity-pool：标题/H1/描述植入 "explained"，开头 BLUF 直答 |
| 5 | `liquidity pools for beginners` / `how to invest in liquidity pools for beginners` | 3/2 | YouTube + 弱博客 | **改造** /guides/ 索引页为 "Beginner's track" 落地页（curated 学习路径） |

### P1 —— 中期（1–3 个月），需要数据支持或更多投入

| # | 目标关键词 | F | 动作 |
|---|---|---|---|
| 6 | `how do liquidity pools make money` / `how do liquidity providers make money` / `are liquidity pools profitable` / `worth it` | 6/4/4/4 | 新文章：LP 收益解剖（fee APR − IL − gas 的真实算术，引用 2026 数据），大众语气，内链 fees/IL 文章 |
| 7 | `are liquidity pools safe` / `legit` / `what happens when liquidity pool dries up` | 8/3/2 | 新文章：安全性的大众版问答结构（PAA 式 H2），从 risks 文章派生并内链 |
| 8 | `liquidity pool calculator` / `apy calculator` / `profit calculator` | 4/4/4 | 工具 #2：LP 收益计算器（fee tier × volume/TVL）；与工具 #3 共建 `/tools/` 目录 |
| 9 | `best liquidity pools uniswap` / `uniswap liquidity pool apr` / `how do pools work on uniswap` | 2–6 | 新文章：Uniswap LP 平台指南（v3/v4 费档、range 选择、真实 APR 数据来源） |
| 10 | `best liquidity pools on solana` / `how do raydium liquidity pools work` / `meteora` | 2–3 | 新文章：Solana 生态 LP 指南（Raydium CPMM/CLMM + Meteora DLMM，内链已有 DLMM 文） |
| 11 | `liquidity pool strategy` / `best liquidity pool strategy` / `delta neutral` | 4/3/3 | 新文章：LP 策略总览（宽窄区间、stable-only、delta-neutral、JIT），内链 range-orders、market-making |
| 12 | `liquidity pool taxes`（含德语信号） | 4 | 新文章：LP 税务处理框架（add/remove/IL/奖励的应税事件分类），加"非税务建议"声明 |
| 13 | `liquidity pool tracker` / `best liquidity pool tracker` | 2–3 | 工具评测型对比文章（Zerion/Zapper/DeBank/Metrix/De.Fi），不做自有 tracker |
| 14 | `liquidity provider example` / `liquidity pool example` | 12/11 | 在 what-is/how-to 两文中增补端到端 dollar 例（比新开文章性价比高） |

### P2 —— 长尾/实验性，需求小但竞争极低或需新能力

| # | 方向 | 关键词证据 | 说明 |
|---|---|---|---|
| 15 | Halal/Islamic finance | `are liquidity pools halal`、`is providing liquidity haram`（各 F=3，簇 12 词） | 引用 AAOIFI 意见与学者观点的谨慎综述；E-E-A-T 风险需作者背书，无竞品 |
| 16 | Forex/SMC 消歧 | `liquidity pool vs liquidity sweep`、`meaning forex` | 单篇消歧 + 明确互链到 DeFi 语义；防止词群混 Intent |
| 17 | Dark pools | `what are dark liquidity pools` (3) | 机构流动性 vs 链上池子的科普短文 |
| 18 | Creator-side | `create liquidity pool on raydium/pump fun` (3/2)、`pool burned/locked meaning` (3) | 发行者视角指南；与 LP 内容互链但不混类目 |
| 19 | XRP 生态 | `best liquidity pool for xrp`、`xrp liquidity pool calculator` (各 2) | XRPL 原生 AMM；需求小、竞品近零 |
| 20 | CeFi 平台挖矿 | `binance/bybit liquidity mining` (2–3) | Binance/Bybit 挖矿对比 CeFi/DeFi 风险；可承接从交易所溢出的查询 |
| 21 | 多语言 | 西语 `que es` 簇、德语 `was ist`/报税、法语 `c'est quoi`、越南语 | 建议先做 /es/ 子目录试点（hreflang 全套 + sitemap 分片，遵守 AGENTS 部署规则）；每语言内容必须整页翻译 |
| 22 | 学术 AMM 词群 | `automated market makers: designs beyond constant functions` 等论文题 (2–5) | 已有 AMM 文章可引用这些论文锚点；不必单独成篇 |

### 头部词策略（长期战）

`what is a liquidity pool`、`liquidity pool`、`liquidity provider` 由 Binance Academy、CoinGecko、Kraken Learn、Gemini、Chainlink 占位。站内 what-is 文章按 BLUF/结构化数据/内链深度持续优化即可；这些词的胜负在域名权重，不在页内——**不要为它们牺牲长尾产出节奏**。差异化护城河：LVR、DLMM bin math、hooks 安全、JIT、toxic flow 这类词大站不碰、需求真实（suggest 中 `loss-versus-rebalancing`、`lvr` 有出现）、与站点 E-E-A-T 完全一致。

---

## 6. 执行顺序建议

1. **本周**：改造 what-is-a-liquidity-pool（#4）+ /guides/ 落地页（#5）——零新增页面吃掉 F=32 的 explained 词群。
2. **第 2–3 周**：Yield Farming 支柱文（#1）+ 三方对比文（#2）——补最大缺口，两文互链 + 链 liquidity-mining。
3. **第 3–6 周**：IL 计算器（#3）+ LP 收益计算器（#8）——建立 /tools/ 目录，是站点从"内容站"升级为"内容+工具站"的关键，也是最容易拿外链的资产。
4. **之后**：按 P1 顺序每两周一篇；平台文优先 Uniswap LP > Solana > 其他。
5. 每篇遵守仓库规范：≥1,300 词、lastReviewed、≥3 信源、≥2 内链、`pnpm content:audit` → `pnpm check` → `pnpm build` → push main（严禁本地 wrangler）；新路由同步 sitemap.xml.ts；上线后 `pnpm indexnow`。
6. 接入 GSC 后回填真实曝光数据，用季度 review 校准本报告分层（建议把本文件当作 v1 基线）。

---

## 附：原始数据

- `/tmp/kw_research/suggest_raw.json` —— 4 引擎原始建议词（1,636 词）
- `/tmp/kw_research/clustered.json` —— 去噪 + 频次 + 21 簇归属（1,160 词）
- 采样时间：2026-09-11；引擎：Google / Bing / DuckDuckGo / YouTube（YouTube 端点已失效，返回空）
