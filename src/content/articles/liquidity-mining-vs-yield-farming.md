---
title: "Liquidity Mining vs Yield Farming vs Staking: Where the Money Comes From"
description: "Three activities routinely quoted as one yield number. Separating them by funding source, risk, lock-up and management cost, with a worked comparison of the same capital in each."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-11"
author: "Siddharth Mehta"
readTime: "12 min read"
keywords: "liquidity mining vs yield farming, yield farming vs liquidity pool, staking vs yield farming, liquidity pool vs yield farming, liquidity mining vs staking, difference between yield farming and liquidity mining"
featured: false
faq:
  - q: "What is the difference between liquidity mining and yield farming?"
    a: "Liquidity mining is the protocol-side programme: a protocol issuing its own token to attract deposits. Yield farming is the user-side activity: moving capital between venues to collect whatever combination of trading fees and issued tokens currently pays most. One is a budget line; the other is a strategy."
  - q: "Is staking the same as providing liquidity?"
    a: "No. Staking commits a single asset to secure a network or a protocol and is paid from issuance or protocol revenue. Providing liquidity commits a pair to a pricing curve and is paid from trading fees. Only the second carries divergence loss, and only the first usually carries an unbonding delay."
  - q: "Which pays more, staking or yield farming?"
    a: "Quoted rates on farms are usually higher and are funded differently. Staking rewards come from issuance or fees on a network that already has demand; farm rewards are often front-loaded emissions that taper. Compare them only after deducting divergence, gas and the realisable price of the reward token."
  - q: "Does yield farming have impermanent loss?"
    a: "Whenever the farmed position is a liquidity pool deposit, yes. Farming a single-asset lending market or a staking contract does not, because no pricing curve is rebalancing your basket. The loss belongs to the underlying position, not to the farming wrapper."
  - q: "Can you do all three at once?"
    a: "That is the normal shape of a farmed position: deposit a pair into a pool, stake the resulting LP claim into a gauge, and sometimes stake the reward token again for a vote-escrowed multiplier. Each layer adds a contract, and the risks add rather than offset."
---

Three words get quoted as one number. A dashboard shows 41% and the capital behind it might be earning trading fees, newly issued tokens, network issuance, or some mixture nobody has separated. The three activities behind that figure have different funding sources, different failure modes, and different answers to the only question that matters before depositing: what happens when the incentive stops.

Separating them is not terminology pedantry. The funding source predicts the durability of the return, and durability is what the quoted rate never tells you.

<figure class="article-figure">
  <img src="/images/guides/liquidity-mining-vs-yield-farming.webp" alt="Three columns comparing staking, liquidity provision and farming by funding source, risk and management cost." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same capital in three activities, separated by what actually funds the payment. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When an allocator hands me a yield figure, the first thing I do is ask for the split between fee revenue and token issuance. If nobody in the room can produce it, the position is not being managed, it is being held. Fee-funded yield survives a bear market at a lower level. Emission-funded yield goes to approximately zero and takes the depth with it."*

## 1. Three Activities, Three Funding Sources

The cleanest way to tell them apart is to ask who pays and out of what.

**Staking** commits a single asset to a consensus mechanism or a protocol contract. On a proof-of-stake network the payment is protocol issuance plus a share of transaction fees and priority payments, funded by the network's own monetary policy and its users. The Ethereum protocol specification defines the reward function directly, so the rate is a mechanical output of total stake rather than a marketing decision [1]. The asset does not change form, there is no second asset to diverge against, and the main constraints are an unbonding delay and, if a liquid staking wrapper is used, the peg behaviour of that wrapper.

**Providing liquidity** commits a pair of assets to an automated pricing curve. The payment is the swap fee taken from traders routed through the pool, and it is funded entirely by trade volume. No issuance is involved. This is the only one of the three where the position's composition changes as the market moves, which is where divergence loss originates. The mechanism is set out in [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/) and priced in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

**Liquidity mining** is a protocol issuing its own token to whoever holds a qualifying position, usually an LP claim staked into a gauge contract. The payment is funded by dilution of existing token holders. It is a customer acquisition budget, not revenue, and it is designed to end.

**Yield farming** is the user-side activity of moving capital between those opportunities to collect the highest available combination. It is a strategy layered on top of the other three, not a fourth source of money.

| | Staking | Liquidity provision | Liquidity mining | Yield farming |
|---|---|---|---|---|
| Who pays | Network issuance and fees | Traders, via swap fees | Token holders, via dilution | Whichever of the three is underneath |
| Assets committed | One | A pair | The LP claim | Varies by venue |
| Divergence loss | No | Yes | Inherited from the pool | Inherited |
| Lock-up | Unbonding delay | None, usually | None, usually | None, usually |
| Durability | Structural | While volume persists | Programme-limited | As durable as the layer beneath |
| Management cost | Low | Medium to high | Medium | High |

## 2. The Capital Stack of a Farmed Position

A farmed liquidity position is rarely one contract. The usual shape has four layers, and each adds counterparty surface.

1. **The pool contract** holds the pair and enforces the invariant.
2. **The position claim** is a fungible LP token or, on concentrated designs, a position NFT. Its mechanics are covered in [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).
3. **The gauge or farm contract** holds that claim and accrues emissions against it.
4. **An optional vote-escrow or vault wrapper** stakes the reward token to boost the emission rate or auto-compounds on your behalf.

Risk at each layer is additive, not diversifying. A vault exploit costs the position even if the underlying pool was faultless, and a governance change to gauge weights can cut the emission rate without any contract failing at all. The tightest version of this problem appears in vote-escrowed systems, where the emission split across pools is decided by token-weighted votes and by bribe markets bidding for those votes. The structure is detailed in [Liquidity Mining Explained](/guides/liquidity-mining-explained/).

## 3. The Same Capital, Three Ways

Take $25,000 and a twelve-month horizon. The following comparison uses round figures to expose the structure, not to forecast any real venue.

| | Staked ETH | ETH/USDC pool, 5 bp tier | Same pool, farmed |
|---|---|---|---|
| Gross quoted rate | 3.2% | 11.0% fee APR | 11.0% fee + 26.0% emissions |
| Gross on $25,000 | $800 | $2,750 | $9,250 |
| Divergence over the year | $0 | −$1,430 | −$1,430 |
| Gas and rebalancing | −$40 | −$310 | −$520 |
| Emission token realised at 45% of accrual price | — | — | −$3,575 |
| Net result | $760 | $1,010 | $3,725 |
| Net rate | 3.0% | 4.0% | 14.9% |

Three observations survive changing every input. First, the farmed position still leads after the haircuts, which is why the activity exists. Second, its advantage is entirely the emission line, and that line has a scheduled end date. Third, the fee-funded column is the only one that looks the same in month thirteen.

The emission haircut is the input most often skipped. Reward tokens accrue at a spot price and are realised at whatever price survives everyone else selling the same emission into the same liquidity. A 45% realisation is not pessimistic for a token being issued faster than its buy-side demand grows. That arithmetic is developed in [Yield Farming Explained](/guides/yield-farming-explained/) and the distinction between fee revenue and issuance in [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## 4. Which Risks Belong to Which Activity

Risk transfer is the part most comparison tables get wrong. These are not three points on one scale.

- **Divergence loss** belongs to liquidity provision and to anything wrapping it. Staking a single asset has none; farming a single-asset lending market has none. Once the underlying is a pair on a curve, the loss is present whether or not a farm sits on top. The closed form is derived in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).
- **Slashing and unbonding** belong to staking. Validator misbehaviour can destroy principal, and an exit queue can prevent selling into a falling market. Neither has an analogue in pooled liquidity.
- **Emission decay and depth collapse** belong to liquidity mining. When a programme tapers, mercenary capital leaves, depth falls, routers send less volume, and the fee APR for whoever stayed falls with it. The Bank for International Settlements analysis of automated market making documents how thin depth and high volatility interact to raise the cost of providing liquidity in exactly the conditions where incentives have just been withdrawn [2].
- **Compounding contract risk** belongs to yield farming as an activity, because the strategy is defined by adding layers. Research measuring realised outcomes for concentrated liquidity providers finds that a majority of positions in the sampled period underperformed simply holding the deposited assets once fees and divergence were both accounted for, before any farm wrapper was added [3].
- **Adverse selection** sits under liquidity provision at all times and is invisible in fee statistics. The loss-versus-rebalancing framework shows that an LP systematically trades against better-informed flow, and that this cost scales with volatility independently of whether a farm is paying on top [4].

## 5. Choosing Between Them

A workable decision rule uses three questions, in order.

**What exposure do you actually want?** Staking keeps single-asset exposure intact. A liquidity position converts directional exposure into a rebalanced basket that sells strength and buys weakness. If you hold an asset because you expect it to outperform its pair, pooling it works against the thesis. That trade-off is worked through in [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

**How much management will you actually do?** Staking is close to zero maintenance. A full-range pool position needs periodic checks. A concentrated position needs range monitoring and rebalancing decisions, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/). A farmed concentrated position adds claim schedules, emission sell decisions and gauge-weight monitoring. Most disappointing outcomes come from choosing the third and executing the first.

**What survives the programme ending?** Model the position twice, once with emissions and once without. If the fee-only case is unattractive, the position is a trade on the incentive schedule rather than an allocation to the pool, and it should be sized and exited accordingly.

## 6. Pre-Deposit Checklist

Before committing to any of the three, establish the following in writing:

- The split between fee revenue and token issuance in the quoted rate, as two separate numbers.
- The emission schedule end date and the current daily issuance against circulating supply.
- The realisable price of the reward token, meaning depth on the venue where you would sell it, not its spot quote.
- Whether the reward requires a lock, and what the exit looks like if the lock is vote-escrowed.
- Every contract the position touches, with audit status and time in production for each.
- The fee-only return, calculated as if emissions were zero from tomorrow.
- Gas cost of entry, exit, and the claim cadence you intend to run, sized against the position. [LP Gas Costs](/guides/lp-gas-costs/) covers how quickly this dominates smaller positions.

The checklist has one purpose: to convert a single quoted rate back into the separate cash flows it was built from. Once those are on paper, the comparison between the three activities usually answers itself, and it frequently answers differently from the dashboard.

## Where to Go Next

Model the fee-only case in the [LP profit calculator](/tools/lp-profit-calculator/), then read [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) for the structured version of the diligence above. If the candidate position is concentrated, [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) explains the failure mode that quietly ends fee accrual while the dashboard still shows a rate.

## References

1. [Ethereum Proof-of-Stake Rewards and Penalties (Ethereum Foundation)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/)
2. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/ "Ethereum Proof-of-Stake Rewards and Penalties"
[2]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[3]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges with Automated Market Maker Protocols (Xu et al., 2021)"
[6]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
