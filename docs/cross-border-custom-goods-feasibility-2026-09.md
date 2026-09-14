# 中国产能 × 定制商品 × 欧美独立站：可行性调研（2026-09-14）

> 背景：创始人常驻新加坡，姐姐在深圳，家里有一家具备进出口权的深圳贸易公司。计划做自有网站下单、从中国发货到欧美的定制类商品，并每天用 TikTok 内容 + TikTok 搜索做获客。本报告基于 2026 年 9 月 14 日的公开信息，四条线并行调研（关税/免税额、小包物流、品类、合规/收款），共 280 余次检索，关键数字均附来源。标注 ⚠ 的为单一来源、二手转述或推算值，上线前需实测。

---

## 0. 一页结论

1. **2026 年"中国一件代发免税小包"模式已经结束。** 美国 $800 免税额已被 CBP 无限期暂停（2026-06-24 规则），邮政件也按从价征税；欧盟 2026-07-01 起每个税则品目征 €3 定额关税；只有英国 £135 以下免关税制度保留到 2028 年 10 月。这意味着**每一单都要交税**，选品必须满足：单价高、克重轻、一单只含一个税则品目。
2. **推荐主线：AI 设计的定制穿戴甲（press-on nails），不随货附胶水。** 出厂 ¥30–120/副（手工定制）、美国零售 $40–60、Etsy 手工款 $17–60、头部创作者定制款 $210–527；单套 30–110 g；美国关税 25.3%（HTS 3926.90，含新一轮 §301 12.5%）；胶水分开卖则避开化妆品监管。TikTok #pressonnails 累计超 54 亿次观看。
3. **副线（提客单价、复购）：AI 图生 3D 定制手办/键帽/光刻画 + 同图案手机壳。** 3D 手办的 AI 护城河最强（自拍→3D 模型→深圳树脂打印），Temu 无法一键复制。
4. **物流：从深圳走 DDP 专线（云途/燕文/4PX），不要从新加坡发货。** 关税按原产国而非发运地征收，新加坡本身也被美国加征 12.5%，中转只会多付一段头程。DDU 商业快递因 $17 起的关税垫付费已不可行。月单量过 300 后，把美国订单改为"每周集货 → 美国海外仓 → 本土派送"，关税按 B2B 转让价计，毛利可从约 43% 提到 54%（⚠ 推算，见第 5 节）。
5. **主体：新加坡 Pte Ltd 做店铺所有者与收款主体（Shopify Payments / Stripe），深圳贸易公司做出口方，走 0110 一般贸易出口给新加坡公司。** 大陆主体接不了 Stripe/Shopify Payments，TikTok 广告和 TikTok Shop 美区也偏向本地/新加坡主体。
6. **市场顺序：美国 + 英国先上，欧盟第二阶段。** 英国目前是三大市场里对 $20–150 小包最友好的，只需在结账时代收 VAT。欧盟要先做 GPSR 责任人 + 德国包装法授权代表 + IOSS。
7. **TikTok 路线：独立站 + TikTok 内容/搜索引流，不依赖 TikTok Shop 美区。** TikTok Shop 美区 2026 年对中国主体直邮已改为邀约制、要求美国仓；而独立站不受此限制。注意受众在欧美，做的是 TikTok 国际版，不是抖音。

---

## 1. 决定一切的前提：2026 年小包关税现实

### 1.1 美国

| 事项 | 现状（2026-09） | 来源 |
|---|---|---|
| $800 de minimis | 2025-05-02 对中国/香港取消，2025-08-29 对全球取消；2026-06-24 CBP 两份临时最终规则将邮政/非邮政渠道豁免**无限期暂停**，法定永久废止日 2027-07-01 | Federal Register 2026-12669/12670；CBP 2026-06-24 |
| 邮政渠道（USPS/ETOE） | 2026-02-28 起不再有每件定额税，改按从价；2026-07-24 起 ≤$2,500 邮件需货主或持牌报关行做"邮政非正式报关"；2026-09-22 起 ET13 电子申报测试 ⚠ | Tandom；Zonos 2026-09-08；仓盛 2026-09-14 |
| IEEPA 关税 | 最高法院 2026-02-20 以 6:3 裁定 IEEPA 不授权征税，"芬太尼"与"对等"关税 2026-02-24 起停征；CBP 已受理 $1,325 亿退税 | Supreme Court；Covington；GHY |
| 替代关税 | §122 全球 10% 于 2026-07-24 到期；同日起新 §301"强迫劳动"附加税生效：中国、香港、**新加坡**、越南均为 **12.5%** | Honigman 2026-07-24；Mothership 2026-07 |
| 快递垫付费 | DHL 最低 ≈$17、FedEx 2026-07-20 起最低 $17.50 另加 $9.75 录入费、UPS 2026-05-11 起最低 $17 | Tariffstool；FedEx 2026 附加费表；Reveel |
| 转运伪报 | 2025-08-07 起对转运伪报原产地加征 40% 惩罚性关税 | E2open |

**典型品类的中国原产综合税率**（MFN + §301 清单 + 12.5%，不含 MPF/HMF）：

| HTS | 品类 | MFN | 中国原产合计 | 备注 |
|---|---|---|---|---|
| 3926.90.99 | ABS 甲片、3D 打印件、塑料手机壳 | 5.3% | **25.3%** | List 4A 7.5% ⚠ 若子目属 List 3 则 42.8% |
| 7117.19.90 | 仿首饰 | 11% | **31%** | 同上 |
| 6109.10 | 棉 T 恤 | 16.5% | **36.5%** | 服饰税负最高 |
| 4911.99.60 | 印刷品 | 0% | **20%** | |

来源：Gateway 关税计算器（2026-09-14）、CBP 裁定 N345479/N329705、TariffLens。**新加坡组装不改变原产地**：仅包装、印刷、分拣不构成"实质性转变"，申报新加坡原产会被 CBP 视为转运伪报。

### 1.2 欧盟

- **€150 免税额 2026-07-01 已废止**，过渡期至 2028-07-01 按**每个 4 位 HS 税则品目 €3** 征收定额关税（5 副同款甲片 = €3；1 副甲片 + 1 条项链 = €6），IOSS 渠道同样要缴。（欧盟委员会 TAXUD 指引 2026-06-08，更新 2026-07-20）
- **€2 海关处理费**：ECOFIN 2025-11 同意推进，目标 2026-11-01，⚠ 尚未最终确认。
- **法国** 2026-03-01 起单独征收的 €2/件小包税已于 2026-07-01 因欧盟 €3 生效而暂停（KPMG；WWD）。德国无单独收费，但 DHL 代垫费 €7.50（DDU 时）。
- IOSS 增值税规则不变：注册后在结账时代收 VAT。

### 1.3 英国

- ≤£135 免关税，海外卖家注册 UK VAT 后在结账时代收。取消时间已提前到 **2028 年 10 月**，草案立法 2026-07-13 发布。（GOV.UK；Zmartly 2026-08-04）
- 结论：**2028 年前英国是最友好的市场**。

---

## 2. 物流方案对比

### 2.1 三条路的取舍

| 方案 | 适用阶段 | 优点 | 缺点 |
|---|---|---|---|
| **深圳 DDP 专线**（云途、燕文、4PX、菜鸟） | 0–300 单/月，长尾 SKU、定制预售 | 无库存、Shopify 有官方 App、ERP（店小秘/马帮）直连；燕文美线 8–15 工作日、菜鸟优先线 5–10 天 | 关税按零售价（交易价值）计，落地成本约占客单价 32–38% |
| **美国/欧洲海外仓**（万邑通、4PX、仓盛、ShipBob、Amazon MCF） | 300 单/月以上，或 SKU 集中 | 一次批量清关，关税按 B2B 价计；美国本土尾程 $4–8；退货有本地地址 | ShipBob 月最低 $275 + 建仓 $975；中资仓通常无月费但操作费 $2–4/单；头程空运 $4.5–8.2/kg |
| **DDU 商业快递** | 不建议 | 快 | 收件人被收 $17+ 垫付费和税，退货率飙升 |

**从新加坡发货不成立**：JustShip 0.5 kg 到美 S$12.30 起，SingPost Speedpost 国际件 S$26.50 起，均高于深圳专线（燕文 0.5 kg 约 ¥50 ⚠），且不省关税。新加坡的价值是**主体与收款**，不是仓库。

### 2.2 各专线实价需自行试算

2026 年各专线的分量级报价均不公开，需注册账号试算。行业区间：空运专线普货 ¥30–40/kg、敏感货 ¥40–55/kg，清关服务费 ¥50–200/票（JIYUNAPP 2026-03-28）；燕文美国专线 DDP 首重 0.5 kg ≈ ¥50、续重 ¥20/kg（⚠ 二手引用）。**建议深圳公司立刻注册云途、燕文、4PX 三家账号，用 100 g / 200 g 两个档做美、英、德三地试算。**

### 2.3 退货

客单 $15–120 的跨境定制品，退运运费 + 清关基本都高于货值，行业做法是"**保留商品即退款**"或换货；进入海外仓阶段后用 3PL 提供本地退货地址。定制品在结账页强制预览确认 + 明示"定制品不可退"可压低争议率。

---

## 3. 品类评估

筛选标准：轻小、非易碎、无电池无液体；目标 5–10 倍加价；AI 能形成差异化；深圳周边可小批量或按单生产；监管负担低；**一单一个税则品目**。

| 品类 | 物流 | 启动 | 毛利/加价 | AI 护城河 | 监管 | 综合 |
|---|---|---|---|---|---|---|
| **定制穿戴甲（不附胶）** | 1 | 2 | 1（¥30–120 → $40–60，手工可 $200+） | 2 | 2 | **A** |
| **3D 打印手办/键帽/光刻画** | 2 | 3 | 1 | **1** | 2（IP、玩具） | **A-** |
| AI 图案手机壳 | 1 | 1 | 2（$1.4–6 → $25–35） | 3 | 1 | B+ |
| 定制首饰（投影/名字） | 1 | 1 | 2（$0.3–12 → $26–80） | 3（Temu 撞款） | 2（REACH 镍铅；关税 31%） | B |
| 珐琅徽章/亚克力谷子 | 2 | 2 | 1 | 3 | 3（IP 授权） | B |
| AI 宠物肖像（纸/亚克力） | 2 | 1 | 2 | 4（人人可做） | 1 | B- |
| 定制服饰/帽 | 3 | 1 | 4（关税 36.5%） | 4 | 1 | C |
| 定制毛绒 | 4 | 3 | 3 | 2 | 2 | C |
| 簇绒地毯/霓虹灯/乐高画 | 5 | 3 | 3 | 3 | 3 | D |

（1 = 最好，5 = 最差；排名为基于事实的分析判断。）

### 3.1 主线：定制穿戴甲

- **需求**：全球市场 2025 年约 $8 亿（Fortune BI），美国 2024 年 $1.92 亿、CAGR 5.9%；TikTok #pressonnails 超 54 亿次观看；Etsy 上大量"sizing kit"listing，说明"先卖尺码套件再做定制"已是成熟玩法。
- **供给**：江苏东海产全国约 70% 穿戴甲，2024 年产量 15 亿副、出口约 35 国，出口单价从 $2 升至 $19.99–50；深圳/东莞有手工定制作坊。机制基础款出厂 $0.50–1.00，品牌高级设计款 $1.80–3.00+（MOQ 100–300）；手工定制单副估计 ¥30–120 ⚠。
- **价格带**：Olive & June $10–12、Glamnetic $15–25、Static Nails $16–22、Etsy 手工/luxury $17–60（原价常见 $40–74）；头部案例 Pamper Nail Gallery（280 万粉）定制款 $210–527/副。
- **克重**：轻薄包装整套 <110 g，可做到 30–60 g；尺码套件约 20 g。
- **合规关键**：欧盟边界产品手册明确"主要功能是粘合"的胶水**不是化妆品**（走 REACH/CLP），甲片本身是一般物品（GPSR）；美国 MoCRA 对"改变外观超 24 小时且不常规自行移除"的产品不给小企业豁免，可自行摘除的 press-on 是否落入该例外 FDA 未明示 ⚠。**默认不随货附胶水**，改用无胶粘胶片或让顾客本地购买，同时让 EU 责任人书面判定分类。
- **AI 用法**：用户上传灵感图/穿搭照 → 生成 10 指设计预览 → 确认后生成给作坊的打印/工艺单；AI 从手部照片估算尺码只能作辅助，仍需尺码套件兜底。

### 3.2 副线：AI 图生 3D 手办 / 键帽 / 光刻画

- AI 工具已成熟：Meshy Pro $20/月约 1000 积分；Tripo Pro $19.9/月，约 $0.30/模型。
- 深圳供应：JLC3DP 在线报价 $0.30 起（2026-07 多种材料降价）；树脂全彩人像手办按 Accio 汇总 MOQ 1–20，单件出厂跨度大；TikTok 关节玩具单款月销 7,484 单。
- 零售：Etsy 3D 打印树脂键帽 $15–30、光刻画灯 $7–52、定制钥匙扣 $29、宠物纪念品 $39–199。
- 风险：面向儿童会触发玩具法规（EN71/CPSIA），产品与包装标"14+ 收藏品"；严禁用动漫/名人形象，只做"自己的宠物/自己的脸/原创 OC"。

### 3.3 排除项

服饰（关税最高、竞争最烈、加价难到 5 倍）、地毯/霓虹灯/乐高画（重、体积大、含电源需 CE）、毛绒（打样 20–30 天、体积大）。宠物肖像纸品可作为引流赠品或加购，不作为主线。

---

## 4. TikTok 与获客

- **TikTok Shop 美区 2026**：2026-02-01 起跨境直邮改为邀约制、类目白名单、要求达成 FBT 渗透与 T3 等级；跨境 POP 店定向邀约仅面向美国本土发货或品牌出海商家。中国主体稳定可直邮的 TikTok Shop 站点目前只有东南亚部分国家、**英国、西班牙**。
- **含义**：独立站 + TikTok 内容/搜索引流不受 TikTok Shop 邀请制限制，是更可行的路线；后期可用英国 TikTok Shop 做平台试点。TikTok Shop 2026-06-15 起新增奥地利、比利时、荷兰、波兰，欧洲扩张中。
- **TikTok SEO 2026 要点**：2026-06 推出 Search Ads Campaign（关键词定向，支持 broad/phrase/exact，有搜索词报表）；排序权重最高的是关键词相关性与完播率，其次互动、新鲜度、账号权威、字幕/标签；标题前 50 字放主关键词，前几秒口播关键词（自动字幕被索引），1 个宽泛 + 1 个细分 hashtag；how-to、对比、幕后三类内容最易被搜索。定制品天然适合"制作过程揭晓"视频（设计生成 → 手工 → 开箱）。
- **广告账户**：TikTok Ads Manager 可投地区由账户注册国决定，新加坡账户投美/欧受限，常见解法是通过目标地区的 TikTok 代理账户；用 VPN 伪造会被封。2026 起所有广告须绑定已验证 Business 账号。
- **内容分工**：英文内容可由新加坡端产出（口播、字幕、AI 设计演示），深圳端拍摄手工制作与打包过程素材。

---

## 5. 单位经济测算（穿戴甲，⚠ 全部为推算）

假设：手工定制款零售 $45 + 运费 $5.99；手工出厂 ¥60（≈$8.4）；包装 + 尺码套件摊销 ¥8；美国关税 25.3%；支付手续费 3.6% + S$0.50。

| 成本项 | A. 深圳直邮 DDP | B. 每周集货 → 美国海外仓 |
|---|---|---|
| 产品 + 包装 | $9.5 | $9.5 |
| 国际运费 | $4.2（≤100 g 专线 ⚠） | $0.6（空运 $6/kg 摊到 100 g）+ $1.0 清关摊销 |
| 关税 | $11.4（按 $45 交易价值） | $2.5（按 $10 B2B 转让价 ⚠） |
| 报关/清关摊销 | $1.5 | 已含上行 |
| 海外仓操作 + 本土尾程 | — | $7.5（操作 $3 + USPS ≈$4.5） |
| 支付手续费 | $2.2 | $2.2 |
| **合计** | **≈ $28.8** | **≈ $23.3** |
| **毛利（营收 $50.99）** | **≈ $22（43%）** | **≈ $28（54%）** |

结论：关税是直邮模式最大的单项成本；集货模式的关税按 B2B 价计，但**关联公司转让价必须符合独立交易原则**，上线前需报关行书面意见。时效上 B 比 A 多 3–5 天，对预售制定制品可接受。43% 毛利足以支撑有机 TikTok 流量，但不足以大规模投付费广告，因此前 6 个月以内容获客为主。

英国同款：零售 £35、结账代收 20% VAT、无关税、燕文英国专线 ≈¥30 ⚠，毛利明显高于美国，适合作为第一批"高毛利验证市场"。欧盟：IOSS 代收 VAT + €3/品目关税，单品目包裹影响可控。

---

## 6. 主体、收款与出口链路

### 6.1 新加坡 Pte Ltd 作为 Merchant of Record

| 方案 | 费率（新加坡主体） | 备注 |
|---|---|---|
| Shopify Payments | Basic 本地 3.2% + S$0.50 / 国际 3.6% + S$0.50；2026-06 起可 EUR/GBP 出款 | 需 UEN + 新加坡 FAST 银行账户 |
| Stripe | 本地卡 3.4% + S$0.50，国际卡 +0.5% ⚠，换汇 +2%，争议费 S$15 | 大陆主体不可开户 |
| PayPal | 跨境 3.9% + S$0.50 | 作为补充支付方式 |
| Airwallex 收单 | 本地卡从 2.8% + S$0.30 ⚠ | 自有博客数据 |

- 深圳公司直接做 MoR 技术上可行（Shopify + PingPong/连连），但 Shopify 第三方网关附加费 2%，且失去 Shopify Payments/Stripe，不推荐。
- 新加坡 Pte Ltd 成本：ACRA 注册 S$315，秘书公司套餐 S$500–1,500，公司秘书 S$300–900/年，注册地址 ≈S$300/年；创始人为居民可任本地董事，首年预算 S$1,500–2,500。银行：Aspire 首年免月费，DBS Starter S$10/月，Airwallex 免费。
- Shopify 新加坡计价：Basic S$39/月（年付 S$29）。定制器 App：Zakeke $19–99/月 + 1.7–1.9% 定制订单费；Customily $49/月 + 每件 $1.00→$0.10，可自动生成打印/雕刻文件；Teeinblue $19 起。ERP：店小秘免费直连 Shopify + 云途/4PX/燕文。
- Shopify Tax：美国销售税每年前 $10 万免费，之后 0.35%/单。经济联结阈值多为 $10 万/州，早期不会触发。

### 6.2 深圳贸易公司的角色与出口方式

- **0110 一般贸易（推荐）**：深圳公司向作坊取得增值税专票 → 出口给新加坡公司 → 免退税。2026 年财税第 11 号公告要求进项发票品名/规格/数量与报关单 100% 一致。
- **9610 零售直邮**：综试区无票免税，适合直邮单件；⚠ 2026 年综试区核定征收政策据报道在收紧，需向深圳税局确认。
- **9810 海外仓**：离境即退税，进入海外仓阶段时使用。
- **1039 市场采购**：主体必须在试点集聚区备案，单票 ≤$15 万，免征不退；对定制作坊无票采购是备选。
- ⚠ 深圳公司 → 新加坡关联公司的定价需符合独立交易原则，本次未检索转让定价细则。

---

## 7. 最小合规清单

| 市场 | 必做 | 费用/备注 |
|---|---|---|
| 欧盟 | GPSR 授权代表（Responsible Person）；产品/包装标注其名称地址 | €150–400/年（Westwood €150；Comply EU £360/5 款） |
| 欧盟 | IOSS 注册（通过中介） | 入门 ≈€20/月，或 €99–400 开户 + €50–300/月 |
| 德国 | 2026-08-12 起 VerpackDG 要求境外卖家委任德国授权代表 + 双元系统 | ≈€209/年（20 kg 纸类示例） |
| 法国 | Citeo 注册 + IDU + Triman 标识 | 包装 <10 cm² 可电子化 |
| 全欧 | PPWR 2026-08-12 起每个销售成员国需注册包装 EPR，无规模豁免 | 先做德/法，其余国家按销量逐步加 |
| 欧盟 | 首饰 REACH：铅 <0.05%、镉 ≤0.01%、镍释放 ≤0.5 µg/cm²/周 | 让供应商出检测报告 |
| 欧盟 | 手办标"供 14 岁以上收藏者"以豁免玩具指令 | |
| 美国 | 产品显著标注 "Made in China"（19 CFR 134） | |
| 美国 | Prop 65 警示（首饰铅/镉/邻苯，手机壳邻苯/BPA） | 警示法非禁售 |
| 美国 | MoCRA：不附胶水则甲片按一般物品；若附胶需美国代理人 | 让 EU/US 顾问书面判定 |
| 美国 | 儿童用品 CPSIA/CPC；手办标 14+ | |
| 英国 | 注册 UK VAT，结账代收 | GPSR 不适用于大不列颠 |
| 澳洲 | 12 个月低值货物销售 >A$75,000 才需注册 GST | 早期无需 |
| IP | 纯 AI 生成作品美国版权局不予保护；"in the style of X"、动漫/球队/名人形象会被下架；Shopify 收到 DMCA 先下架再通知，重复侵权可关店冻结资金 | 禁词/形象过滤 + 用户上传条款含赔偿 + 人工审核 |

---

## 8. 90 天启动计划与分工

| 周 | 新加坡（你） | 深圳（姐姐 + 贸易公司） |
|---|---|---|
| 1–2 | 注册 Pte Ltd、Aspire/Airwallex 账户、Shopify + Shopify Payments；确定品牌与 3 个 AI 设计模板系列 | 注册云途/燕文/4PX 账号，试算 100 g/200 g 到美英德；筛 3 家手工穿戴甲作坊，各打样 5 副 |
| 3–4 | 上线尺码套件（$8–12）+ 3 个预设系列 + AI 定制入口（Customily/Zakeke）；TikTok 账号起号，每天 1–2 条 | 定包装（≤60 g）、拍摄制作过程素材；确认 0110 出口流程与开票 |
| 5–8 | 英国 + 美国开卖；UK VAT 注册；结账页 DDP 含税定价；追踪完播率/搜索词 | 首批 50 单履约，记录每单实际运费、税费、时效 |
| 9–12 | 复盘单位经济；决定是否集货模式；启动 GPSR 责任人 + IOSS + 德国包装代表，准备欧盟 | 接入 3D 打印副线（JLC3DP 报价 + 1 家树脂全彩作坊）；考察万邑通/4PX 美国仓 |

关键指标：TikTok 搜索来源占比、尺码套件 → 定制款转化率、每单实际落地成本、争议率 <0.5%。

---

## 9. 上线前必须实测的不确定项

1. 云途/燕文/4PX 各分量级实价，以及 DDP 关税按申报价百分比还是每单固定。
2. 手工定制穿戴甲单副 1688 实际报价与 3–7 天交期。
3. press-on 甲片在 MoCRA "24 小时"例外与 EU 化妆品/一般物品的正式分类（书面意见）。
4. 3926.90 / 7117.19 具体子目属 §301 List 4A（7.5%）还是 List 3（25%），按 10 位 HTS 查 9903.88.xx。
5. 关联公司转让价在 CBP 估价下的可辩护性（集货模式前提）。
6. 欧盟 €2 处理费 2026-11-01 是否落地；美国 ET13 邮政申报 9/22、10/22 节点（仅单一中文来源）。
7. 深圳综试区 9610 核定征收 2026 年走向。
8. 新加坡主体投放美国 TikTok 广告的官方渠道（代理 vs 直投）。

---

## 来源（节选，均于 2026-09-14 访问）

**关税与免税额**
- Federal Register 2026-12669 / 2026-12670（2026-06-24）https://www.federalregister.gov/documents/2026/06/24/2026-12669/
- CBP, "CBP modernizes low-value shipment processing"（2026-06-24）https://www.cbp.gov/newsroom/national-media-release/cbp-modernizes-low-value-shipment-processing
- Supreme Court, Learning Resources v. Trump（2026-02-20）https://www.supremecourt.gov/opinions/25pdf/24-1287_4gcj.pdf
- Covington（2026-02-20）https://www.cov.com/en/news-and-insights/insights/2026/02/ieepa-tariffs-terminated-replacement-section-122-tariffs-take-effect
- Honigman, §301 forced-labor tariffs（2026-07-24）https://www.honigman.com/alert-3462
- Zonos, US Tariff Updates（2026-09-08）https://zonos.com/us-tariff-updates
- Gateway tariff calculator 3926.90.99.89（2026-09-14）https://tariff.gatewaylines.com/examples/other-plastic-articles-3926-90-99-89-from-china
- 欧盟委员会 TAXUD，临时定额关税指引（2026-06-08，更新 2026-07-20）https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en
- KPMG，法国小包税（2026-02-10）https://kpmg.com/us/en/taxnewsflash/news/2026/02/tnf-france-new-temporary-small-parcel-tax-effective-march-1-2026.html ；WWD，法国暂停（2026-07）https://wwd.com/business-news/government-trade/france-suspends-parcel-tax-eu-3-euro-customs-fee-1239047928/
- GOV.UK, Reforming customs rules for low value imports（2026-07-13）https://www.gov.uk/government/publications/reforming-customs-rules-for-low-value-imports
- Mothership，新加坡 12.5%（2026-07）https://mothership.sg/2026/07/trump-new-tariffs-singapore-forced-labour/

**物流**
- 仓盛，ET13 详解（2026-09-14）https://www.shipsage.cn/warehousing-news/2026/15709/ ；海外仓收费（2026-09-02）https://www.shipsage.cn/warehousing-news/2026/15633/
- JIYUNAPP，北美专线费用（2026-03-28）https://www.jiyunapp.com/blog/shipping-cost-to-usa-2026/
- 燕文美国专线价格（2026-08-20，二手）https://www.guigangbj.com/zblog/?id=11382
- 云途 Shopify App https://apps.shopify.com/yunexpress-app ；菜鸟 Global Express https://www.cainiao.com/en/global-express.html
- FedEx 2026 附加费 https://www.fedex.com/content/dam/fedex/us-united-states/services/surcharge_and_fee_changes_2026.pdf ；Reveel UPS（2026-05）https://reveelgroup.com/resources/surcharge-watch-may-2026/
- JustShip vs SingPost（2025-10-10）https://www.justship.sg/singpost-vs-justship-usa-shipping-after-the-de-minimis-rule-change
- Simpl, ShipBob pricing（2026-07-14）https://www.simplfulfillment.com/breakdowns/shipbob-pricing ；AMZ Prep MCF（2026-08-18）https://amzprep.com/amazon-mcf-fees/
- King-Hor 空运 2026（2026-04-22）https://king-hor.com/air-freight-from-china-cost-per-kg-2026-rate-guide/
- Shopify Managed Markets 终止 DDU（2026-08-11）https://changelog.shopify.com/posts/managed-markets-is-ending-delivered-duty-unpaid-ddu-support
- E2open，转运惩罚 https://www.e2open.com/blog/navigating-the-transshipment-crisis/

**品类**
- Ecommop，美国穿戴甲畅销分析（2026-07）https://www.ecommop.com/blog/best-selling-press-on-nails-in-the-us
- 腾讯新闻/新华报业，东海穿戴甲出海（2025-09-11）https://news.qq.com/rain/a/20250911A05FSY00
- Ennio Nails, OEM press-on nails（2026-01-30）https://ennionails.com/blogs/nail-guide/oem-press-on-nails-tiktok-shop-sellers
- AMZ123，280 万粉美甲案例 https://www.amz123.com/t/iLAHrW9v
- GLOW by JL, Best Press-On Nails 2026（2026-05-13）https://glowbyjl.com/blog/best-press-on-nails-2026/
- Grand View Research / Fortune BI 穿戴甲市场 https://www.grandviewresearch.com/industry-analysis/press-on-nails-market-report
- Meshy 定价 https://docs.meshy.ai/en/webapp/pricing ；JLC3DP 2026-07 调价 https://jlc3dp.com/news/materials-finishing-pricing-update-july2026 ；Accio 3D 手办 https://www.accio.com/business/3d-custom-figurines
- Alibaba 投影项链批发 https://www.alibaba.com/wholesale/custom-photo-projection-necklace.html
- Podbase, POD 成本（2026-08-12）https://www.podbase.com/blogs/cheapest-print-on-demand
- Chinesellers, TikTok Shop US direct-shipping rules（2026-01-29）https://chinesellers.substack.com/p/tiktok-shop-us-releases-new-rules ；探行（2026-07-22）https://www.getfollow.net/en/article/286.html
- Chapters Agency, TikTok SEO 2026（2026-05-24）https://chapters-agency.com/blog/social-media-management/tiktok-seo-2026/ ；TikAdSuite Search Ads https://tikadsuite.com/blog/tiktok-search-ads/

**合规与收款**
- Stripe SG pricing https://stripe.com/en-sg/pricing ；Shopify SG pricing https://www.shopify.com/sg/pricing ；Shopify Payments SG 要求 https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/singapore/requirements
- 财政部/税务总局 2026 年第 11 号公告（2026-01-31）https://szs.mof.gov.cn/zhengcefabu/202601/t20260131_3983038.htm
- EUR-Lex GPSR 2023/988 https://eur-lex.europa.eu/eli/reg/2023/988/oj/eng ；euverify AR 费用 https://euverify.com/resource/authorised-representative-costs-guide/
- rep-germany.de（VerpackDG 2026-08-12）https://rep-germany.de/en/ ；Certivo 法国 EPR https://www.certivo.com/blog-details/france-packaging-epr-2026-citeo-idu-authorized-rep-guide
- Certified Cosmetics，胶水边界产品 https://www.certifiedcosmetics.com/blog/cosmetic-borderline-products/are-nail-and-lash-glues-considered-cosmetic-products/ ；FDA MoCRA 小企业指南 https://www.fda.gov/media/170732/download
- Compliance Gate，欧盟首饰 REACH https://www.compliancegate.com/jewelry-products-regulations-european-union/ ；Prop 65 https://www.compliancegate.com/california-proposition-65/
- Shopify Tax 定价 https://help.shopify.com/en/manual/taxes/shopify-tax/pricing ；GOV.UK 海外卖家 VAT https://www.gov.uk/guidance/vat-and-overseas-goods-sold-directly-to-customers-in-the-uk
- Customily https://www.customily.com/pricing ；Teeinblue https://teeinblue.com/pages/pricing ；Zakeke（G2）https://www.g2.com/products/zakeke/pricing
- Red Points, Shopify DMCA https://www.redpoints.com/blog/shopify-dmca-notice/ ；Printful AI 版权 https://www.printful.com/blog/copyrighting-ai-generated-designs
