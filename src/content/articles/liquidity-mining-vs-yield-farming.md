---
title: "Liquidity Mining vs Yield Farming vs Staking: Who Pays You"
description: "Three different activities quoted as one number. Who pays you in each, what you risk, and the same $25,000 run through all three for a year."
category: "Advanced"
date: 2026-09-11
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
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

A dashboard shows you 41%. Behind that number your money might be earning trading fees, freshly printed tokens, network issuance, or some mixture nobody has separated.

Three different activities get quoted as one figure. They have different people paying, different ways of going wrong, and different answers to the only question that matters: what happens when the incentive stops.

This guide separates them by who pays, then runs the same \$25,000 through all three for a year.

<figure class="article-figure">
  <img src="/images/guides/liquidity-mining-vs-yield-farming.webp" alt="Three columns comparing staking, liquidity provision and farming by funding source, risk and management cost." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The same capital in three activities, separated by what actually funds the payment. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When somebody hands me a yield figure, the first thing I ask for is the split between fee revenue and token issuance. If nobody in the room can produce it, the position is not being managed, it is being held. Fee income survives a bear market at a lower level. Issuance goes to roughly zero and takes the depth with it."*

## Who pays you, in each

| | Staking | A liquidity pool | Liquidity mining | Yield farming |
| :--- | :--- | :--- | :--- | :--- |
| Who pays | The network, from issuance and fees | Traders, per swap | Existing token holders, by dilution | Whichever of the three sits underneath |
| What you put in | One token | Two, in a ratio | Your pool claim | Depends on the venue |
| Does your holding rotate | No | Yes | Inherited from the pool | Inherited |
| Lock-up | An unbonding delay | Usually none | Usually none | Usually none |
| How long it lasts | Structural | While volume lasts | Until the programme ends | As long as the layer beneath |
| Work required | Low | Medium to high | Medium | High |

**Staking** commits one token to a consensus mechanism. You get paid from the network's own issuance plus a share of transaction fees, and the rate is a mechanical output of how much is staked rather than anybody's marketing decision [1]. Your token count does not change form, there is nothing to diverge against, and the constraints are the exit queue and, if you use a liquid wrapper, whether that wrapper holds its peg.

**A liquidity pool** commits two tokens to a pricing curve. You get paid from swap fees, funded entirely by trading. No issuance involved. This is the only one where your holdings change as the market moves, which is where impermanent loss — the gap between a pool position and simply holding — comes from. See [What Is a Liquidity Pool?](/guides/what-is-a-liquidity-pool/) and [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).

**Liquidity mining** is a protocol printing its own token for anyone holding a qualifying position. It is funded by diluting everybody who already holds that token. A marketing budget, not revenue, and it is designed to end.

**Yield farming** is not a fourth source of money. It is the activity of moving capital between the other three to collect whatever pays most right now.

## Four layers, four things to trust

A farmed pool position is rarely one contract.

1. **The pool** holds your two tokens and enforces the rule.
2. **Your claim** is a token or an NFT. See [Liquidity Pool Tokens Explained](/guides/liquidity-pool-tokens/).
3. **The farm** holds that claim and works out your rewards.
4. **Sometimes a wrapper** that locks the reward token for a bigger share, or compounds for you.

The risks add up. They do not offset. A vault exploit costs you even if the pool was faultless, and a governance vote can cut your reward rate without anything failing at all.

The sharpest version is in vote-escrow systems, where the split of issuance across pools is decided by token-weighted votes, and outside parties bid cash for those votes. See [Liquidity Mining Explained](/guides/liquidity-mining-explained/).

## The same \$25,000, three ways, one year

Round numbers, chosen to show the structure rather than to forecast any real venue.

| | Staked ETH | ETH/USDC pool | The same pool, farmed |
| :--- | ---: | ---: | ---: |
| What it quotes | 3.2% | 11.0% in fees | 11.0% fees plus 26.0% rewards |
| Gross on \$25,000 | \$800 | \$2,750 | \$9,250 |
| Divergence over the year | \$0 | -\$1,430 | -\$1,430 |
| Gas and rebalancing | -\$40 | -\$310 | -\$520 |
| Reward token, realised at 45% | — | — | -\$3,575 |
| **Net** | **\$760** | **\$1,010** | **\$3,725** |
| **Actual rate** | **3.0%** | **4.0%** | **14.9%** |

Three things survive changing every input.

- **The farmed position still wins** after all the haircuts. That is why the activity exists.
- **Its entire advantage is the reward line**, and that line has a published end date.
- **Only the fee column looks the same in month thirteen.**

The haircut is the input people skip. Reward tokens accrue at one price and get realised at whatever survives everybody else selling the same issuance into the same market. A 45% realisation is not pessimistic for a token being printed faster than demand for it grows. See [Yield Farming Explained](/guides/yield-farming-explained/) and [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/).

## Which risk belongs to which

This is where most comparison tables go wrong. These are not three points on one scale.

| The risk | Who owns it |
| :--- | :--- |
| Divergence from holding | The pool, and anything wrapping it. Staking one token has none [3] |
| Penalties and exit queues | Staking. No equivalent in a pool |
| Rewards tapering and depth collapsing | Liquidity mining. When it ends, the money leaves and fees fall with it [2] |
| Stacked contract risk | Farming, because the strategy is defined by adding layers |
| Being picked off by faster traders | The pool, always, and invisible in fee statistics [4] |

Two of those deserve a note.

**Divergence** is impermanent loss — the gap between a pool position and simply holding. It is present whether or not a farm sits on top, because it belongs to the pool underneath. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Being picked off** is loss-versus-rebalancing — what a pool pays out because its quote runs a block late. It scales with volatility regardless of what any farm is paying you [4].

Research measuring real concentrated positions found most of them underperformed simply holding, once fees and divergence were both counted, before anybody added a farm on top [3].

## Three questions, in order

**What exposure do you actually want?** Staking keeps your single-token exposure intact. A pool turns it into a basket that sells strength and buys weakness. If you hold something because you expect it to outperform its pair, pooling it works directly against that. See [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

**How much work will you really do?** Staking is near zero. A full-range pool needs occasional checks. A narrow band needs monitoring and decisions, covered in [Concentrated Liquidity Strategy](/guides/concentrated-liquidity-strategy/). A farmed narrow band adds claim schedules, selling decisions and governance watching. Most disappointing outcomes come from choosing the third and executing the first.

**What survives the programme ending?** Model it twice, with rewards and without. If the fee-only case is unattractive, you are trading an incentive schedule rather than allocating to a pool, and it should be sized and exited that way.

## What people get wrong comparing the three

| What people assume | What actually happens |
| :--- | :--- |
| They are three points on one risk scale | Different risks entirely. Penalties, divergence and dilution are not comparable |
| Farming is just providing liquidity with extra yield | It is four contracts stacked, and the risks add |
| The reward token is worth its quoted price | Everyone receiving it is selling it into the same market |
| Staking and pooling are interchangeable | One keeps your tokens, the other changes them |

## Before you deposit into any of them

1. **The split** between fee revenue and issuance, as two separate numbers.
2. **When the rewards end**, and the current daily issuance against circulating supply.
3. **What you could actually sell the reward token for**, meaning depth on a venue you would use, not its quoted price.
4. **Whether the reward requires a lock**, and what the exit looks like if it does.
5. **Every contract the position touches**, with audit status and time in production for each.
6. **The fee-only return**, calculated as though rewards stopped tomorrow.
7. **Gas for entry, exit and your intended claim cadence**, at your size. See [LP Gas Costs](/guides/lp-gas-costs/).

The list has one purpose: turning a single quoted rate back into the separate cash flows it was built from. Once those are on paper, the comparison usually answers itself, and it frequently answers differently from the dashboard.

## Where to go next

Model the fee-only case in the [LP profit calculator](/tools/lp-profit-calculator/), then read [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/). If the position is a narrow band, [Out-of-Range Liquidity](/guides/out-of-range-liquidity/) explains the failure that quietly ends your income while the dashboard still shows a rate.

## References

1. [Ethereum Proof-of-Stake Rewards and Penalties (Ethereum Foundation)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/)
2. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
3. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
5. [SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)](https://arxiv.org/abs/2103.12732)
6. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)

[1]: https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/ "Ethereum Proof-of-Stake Rewards and Penalties"
[2]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[3]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[5]: https://arxiv.org/abs/2103.12732 "SoK: Decentralized Exchanges (DEX) with Automated Market Maker (AMM) Protocols (Xu et al., 2021)"
[6]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
