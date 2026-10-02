---
title: "Liquidity Mining vs Yield Farming vs Staking: Who Pays You"
description: "Three different activities quoted as one number. Who pays you in each, what you risk, and the same $25,000 run through all three for a year."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "liquidity mining vs yield farming"
keywords: "liquidity mining vs yield farming, yield farming vs liquidity pool, staking vs yield farming, liquidity pool vs yield farming, liquidity mining vs staking, difference between yield farming and liquidity mining"
featured: false
faq:
  - q: "What is the difference between liquidity mining and yield farming?"
    a: "Liquidity mining is the protocol-side programme: a protocol issuing its own token to attract deposits. Yield farming is the user-side activity: moving capital between venues to collect whatever combination of trading fees and issued tokens currently pays most. One is a budget line; the other is a strategy."
  - q: "Is staking the same as providing liquidity?"
    a: "No. Staking commits a single asset to secure a network or a protocol and is paid from issuance or protocol revenue. Providing liquidity commits a pair to a pricing curve and is paid from trading fees. Only the second carries divergence loss, and only the first usually carries an unbonding delay."
  - q: "Which pays more, staking or yield farming?"
    a: "Quoted rates on farms are usually higher and are funded differently. Staking rewards come from issuance and fees on a network that already has demand; farm rewards are often front-loaded emissions that taper. Compare them only after deducting divergence, gas and the price you can actually sell the reward token for."
  - q: "Does yield farming have impermanent loss?"
    a: "Whenever the farmed position is a liquidity pool deposit, yes. Farming a single-asset lending market or a staking contract does not, because no pricing curve is rebalancing your basket. The loss belongs to the underlying position, not to the farming wrapper."
  - q: "Can you do all three at once?"
    a: "That is the normal shape of a farmed position: deposit a pair into a pool, stake the resulting LP claim into a gauge, and sometimes lock the reward token for a vote-escrowed multiplier. Each layer adds a contract, and the risks add rather than offset."
---

A dashboard shows you 41%. Behind that number your money might be earning trading fees, freshly issued tokens, network rewards, or some mixture nobody has separated.

Three different activities get quoted as one figure. They have different people paying, different ways of going wrong, and different answers to one question: what happens when the incentive stops?

By the end you should be able to tell which of the three you are being offered, and what it is likely to pay once the rewards end. The worked example runs the same \$25,000 through all three for a year.

<figure class="article-figure">
  <img src="/images/guides/liquidity-mining-vs-yield-farming.webp" alt="Three columns comparing staking, liquidity provision and farming by funding source, risk and management cost." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same capital in three activities, separated by what actually funds the payment. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Split every yield figure into fee revenue and token issuance before treating it as a return. Fees depend on continuing trading activity. Incentive value depends on a token budget and a market price that can fall sharply, taking incentive-sensitive liquidity with it.

## Who pays you, in each

| | Staking | A liquidity pool | Liquidity mining | Yield farming |
| :--- | :--- | :--- | :--- | :--- |
| Who pays | The network, from issuance and fees | Traders, per swap | Existing token holders, by dilution | Whichever of the three sits underneath |
| What you put in | One token | Two, in a ratio | Your pool claim | Depends on the venue |
| Does your holding rotate | No | Yes | Inherited from the pool | Inherited |
| Lock-up | An exit queue | Usually none | Usually none | Usually none |
| How long it lasts | Built into the protocol | While volume lasts | Until the programme ends | As long as the layer beneath |
| Work required | Low | Medium to high | Medium | High |

**Staking** commits one token to a consensus mechanism. On Ethereum you are paid from new issuance, and the reward per validator falls as more ether is staked, so the rate is a mechanical output rather than anybody's marketing decision [1]. Your token does not change form, so there is nothing to diverge against. The constraints are the exit queue and penalties for going offline or misbehaving [1]. If you use a liquid staking wrapper, add whether that wrapper holds its peg.

**A liquidity pool** commits two tokens to a pricing curve. You are paid from swap fees, funded entirely by trading, with no issuance involved [5]. This is the only one of the three where your holdings change as the market moves. That rotation is the source of impermanent loss — how far a pool position falls behind simply holding the same two tokens [5]. See [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/) and [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

**Liquidity mining** is a protocol minting its own token for anyone holding a qualifying position, usually to bootstrap depth early on [2] [5]. It is funded by diluting everybody who already holds that token. It is a marketing budget, not revenue, and it is designed to end.

**Yield farming** is not a fourth source of money. It is the activity of moving capital between the other three to collect whatever pays most at the moment [2].

## Four layers, four things to trust

A farmed pool position is rarely one contract.

1. **The pool** holds your two tokens and enforces the pricing rule.
2. **Your claim** is a token or an NFT. See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).
3. **The farm** holds that claim and works out your rewards.
4. **Sometimes a vault** that compounds for you or locks the reward token for a bigger share, usually for a performance fee [2].

The risks add up rather than offset. Regulators describe the same effect at system scale: protocols built on top of each other create dependencies that are hard to trace [7]. For you, it means a vault exploit costs you even if the pool was faultless, and a governance vote can cut your reward rate without anything failing at all.

The sharpest version is in vote-escrow systems, where the split of issuance across pools is decided by token-weighted votes, and outside parties pay for those votes. See [Liquidity Mining Explained](/guides/liquidity-mining-explained/).

## The same \$25,000, three ways, one year

Round numbers, chosen to show the structure rather than to forecast any real venue. Every rate is applied to the starting \$25,000, and every line is measured against simply holding the same tokens, so the move in ETH's own price drops out. The divergence line assumes ETH ends the year 80% higher, which leaves a full-range pool \$1,459 behind holding.

| | Staked ETH | ETH/USDC pool | The same pool, farmed |
| :--- | ---: | ---: | ---: |
| What it quotes | 3.2% | 11.0% in fees | 11.0% fees plus 26.0% rewards |
| Gross on \$25,000 | \$800 | \$2,750 | \$9,250 |
| Divergence against holding | \$0 | -\$1,459 | -\$1,459 |
| Gas and rebalancing | -\$40 | -\$310 | -\$520 |
| Reward token sold at 45% of quoted value | — | — | -\$3,575 |
| **Net** | **\$760** | **\$981** | **\$3,696** |
| **Actual rate** | **3.0%** | **3.9%** | **14.8%** |

Three things survive changing the inputs:

- **The farmed position still wins** after the deductions here. That is why the activity exists.
- **Its entire advantage is the reward line**, and that line has a published end date.
- **Only the fee column looks the same in month thirteen.**

The reward haircut is the input people skip. Reward tokens accrue at one price and get sold at whatever survives everybody else selling the same issuance into the same market. Realising 45% of the quoted value is a plausible case for a token issued faster than demand for it grows, not a worst case. See [Yield Farming Explained](/guides/yield-farming-explained/) and [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## Which risk belongs to which

These are not three points on one scale. Each activity carries its own kind of risk.

| The risk | Who owns it |
| :--- | :--- |
| Divergence from holding | The pool, and anything wrapping it. Staking one token has none |
| Penalties and exit queues | Staking [1]. No equivalent in a pool |
| Rewards tapering and depth leaving | Liquidity mining. When it ends, capital moves and fees fall with it |
| Stacked contract risk | Farming, because the strategy is defined by adding layers [7] |
| Being picked off by faster traders | The pool, always, and invisible in fee statistics [4] |

Two of those deserve a note.

**Divergence** is present whether or not a farm sits on top, because it belongs to the pool underneath. One study of 17 large Uniswap v3 pools found LPs earned \$199.3 million in fees but lost \$260.1 million to impermanent loss, leaving them \$60.8 million worse off in aggregate than holding [3]. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Being picked off** is loss-versus-rebalancing — the value arbitrageurs take because the pool only updates its price when someone trades against it. It scales with the pair's volatility regardless of what any farm is paying you [4].

How fast incentive capital moves is not hypothetical. In September 2020 SushiSwap drew about \$830 million of Uniswap liquidity by paying SUSHI rewards to anyone who deposited Uniswap LP tokens [5].

## Three questions, in order

**What exposure do you actually want?** Staking keeps your single-token exposure intact. A pool turns it into a basket that sells strength and buys weakness. If you hold something because you expect it to outperform its pair, pooling it works against that. See [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

**How much work will you really do?** Staking is near zero. A full-range pool needs occasional checks. A narrow band needs monitoring and decisions, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/). A farmed narrow band adds claim schedules, selling decisions and governance watching. Many disappointing outcomes come from choosing the third and putting in the effort of the first.

**What survives the programme ending?** Model it twice, with rewards and without. If the fee-only case is unattractive, you are trading an incentive schedule rather than allocating to a pool, and it should be sized and exited that way.

## Before you deposit into any of them

1. **The split** between fee revenue and issuance, as two separate numbers.
2. **When the rewards end**, and the current daily issuance against circulating supply.
3. **What you could actually sell the reward token for**, meaning depth on a venue you would use, not its quoted price.
4. **Whether the reward requires a lock**, and what the exit looks like if it does.
5. **Every contract the position touches**, with audit status and time in production for each [6].
6. **The fee-only return**, calculated as though rewards stopped tomorrow.
7. **Gas for entry, exit and your intended claim cadence**, at your size. See [LP Gas Costs](/guides/lp-gas-costs/).

The list turns a single quoted rate back into the separate cash flows it was built from. Once those are on paper, the comparison usually answers itself, and often differently from the dashboard.

## Where to go next

Model the fee-only case in the [LP profit calculator](/tools/lp-profit-calculator/), then run the pool itself through [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). If the position is a narrow band, [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) explains the failure that ends your income while the dashboard still shows a rate.

## References

1. [Proof-of-stake rewards and penalties (ethereum.org)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/)
2. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
3. [Impermanent Loss in Uniswap v3 (Loesch et al., 2021)](https://arxiv.org/abs/2111.09192)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/ "Proof-of-stake rewards and penalties (ethereum.org)"
[2]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[3]: https://arxiv.org/abs/2111.09192 "Impermanent Loss in Uniswap v3 (Loesch et al., 2021)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[6]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity? (Uniswap Labs)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
