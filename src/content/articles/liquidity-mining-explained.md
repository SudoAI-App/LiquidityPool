---
title: "Liquidity Mining Explained: Incentives, Emissions and Lasting Depth"
seoTitle: "Liquidity Mining Explained: Incentives, Emissions and Depth"
description: "Where a headline yield really comes from, four generations of incentive design, and how to tell a pool that outlives its rewards from one that empties."
category: "Advanced"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "liquidity mining"
keywords: "liquidity mining, DeFi incentives, ve-tokenomics, bribe markets, Hidden Hand, Votium, points programs, Uniswap v4 hook incentives, mercenary capital, liquidity incentives"
featured: false
faq:
  - q: "What is liquidity mining?"
    a: "A protocol issuing its own token to reward deposits, usually to bootstrap depth on pairs that would not attract enough liquidity from fees alone. It is the incentive programme, distinct from the user-side activity of farming it."
  - q: "What is the difference between liquidity mining and yield farming?"
    a: "Liquidity mining describes the protocol issuing incentives. Yield farming describes the user moving capital toward whatever combination of fees and incentives currently pays most."
  - q: "What happens when liquidity mining rewards end?"
    a: "Capital that arrived for the rewards tends to leave quickly, depth falls, routers send less volume, and fee income for the LPs who stay declines. Pools that were viable on fees alone survive the transition; others usually do not."
  - q: "Do liquidity mining rewards create durable liquidity?"
    a: "Only if the rewards buy depth that stays after emissions taper. Capital that follows the rate leaves when the rate falls, so headline TVL during a programme says little. Measure depth after the taper, not during it."
---

A pool advertising 45% is rarely earning 45% from trading. Usually most of that figure is a protocol issuing its own token to persuade you to deposit.

That is liquidity mining: newly minted tokens paid to depositors on top of the trading fees they already earn [1]. It is a marketing budget paid in the protocol's own token, and it works for as long as the budget lasts. The people it is trying to recruit, and what they sign up to do, are profiled in [What Is a Liquidity Provider?](/guides/what-is-a-liquidity-provider/).

By the end you should be able to split a headline rate into its parts and judge whether a pool will still be worth holding when the rewards stop.

<figure class="article-figure">
  <img src="/images/guides/liquidity-mining-explained.webp" alt="A fading reward-emission stream and a separate trade-flow channel feed a liquidity pool." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Incentive-funded liquidity and organic market flow are different inputs. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> For the protocol, liquidity mining is a customer acquisition cost. For you, it is a temporary payment, not an income stream. A common cycle runs like this: capital arrives while rewards are high, farms the token and sells it, the token price and the advertised rate fall, and the capital leaves. The pools worth holding are the ones whose fees would still justify the position once rewards end.

## Split the headline number first

Before anything else, break the advertised rate into where the money comes from.

| Where it comes from | In a 45% headline | What happens to it |
| :--- | ---: | :--- |
| Real trading fees, paid by swappers | 4.5% | Continues as long as people trade |
| The protocol issuing its own token | 28.5% | Ends when the programme ends |
| Payments from outside sponsors | 12.0% | Ends when the sponsor stops paying |

Only the first row is income from the market. The other two follow a schedule with an end date, and everyone farming alongside you can read that schedule too. Work out your own split — fee APR from routed volume against incentive APR from the reward stream — with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

Then run the protocol's side of the same sum. It tells you whether the programme is buying trading activity or just renting deposits.

$$
\text{Efficiency} = \frac{\text{trading fees the pool generated}}{\text{value of tokens handed out}}
$$

Where:

- The top is real revenue paid by traders over a period.
- The bottom is the market value of the reward tokens the protocol gave away over the same period.

Say a protocol hands out \$1,000,000 of its token a month to attract \$20,000,000 of deposits, and the pool generates \$40,000 in monthly fees. Efficiency is 0.04: the protocol spends \$25 of its own token for every \$1 of fees traders pay. A programme can run like that for a while, but only while the token holds its value and the treasury is willing to keep diluting holders. See [Liquidity Provider Fees](/guides/liquidity-provider-fees/).

Watch the direction as well as the level. A ratio climbing from 0.1 toward 0.5 over a few months suggests the rewards are turning into trading that may stay. A ratio stuck near zero suggests the depth is rented and will probably leave with the rewards.

## Four generations, and what each one broke

### First: issue tokens, watch them get sold

The model took off in mid-2020, when Compound began paying newly minted COMP to lenders and borrowers and many protocols copied it for liquidity pools [1]. Deposit, and the contract credits you new tokens every block.

The weakness showed quickly. Farmers harvest often and sell straight away, which pushes the token price down. A lower token price lowers the advertised rate, so farmers move to the next programme. Depth falls, the token falls further, and the pool can end up nearly empty.

### Second: make people lock up, then sell the votes

Curve's answer was to tie rewards to locking. You lock CRV for anywhere from one week to four years and receive veCRV, a voting balance that shrinks steadily as the unlock date approaches [2]. That balance votes on which pools receive the weekly CRV emissions, and it can boost the CRV paid on your own deposits by up to 2.5 times [2].

A second market then formed on top. Instead of buying and locking tokens themselves, outside protocols pay lockers to vote for their pool through marketplaces such as Hidden Hand [3]. That turned emission routing into an open auction. It also gave the largest lockers outsized say over where emissions go, in a sector where governance voting is often highly concentrated already [7].

Locking has its own cost. The governance token can fall a long way while you are unable to sell it, and the boost you locked for may not cover that.

### Third: promise points, decide later

Many newer protocols award points instead of tokens. Deposit, bridge or trade, and a number rises on an off-chain ledger.

Protocols get large headline deposits with no immediate dilution and no fixed commitments. Depositors get no contractual right to anything: no conversion rate, no timeline, no guarantee of a token at all. When tokens do arrive, the allocation often disappoints, and deposits tend to leave soon after.

### Fourth: pay only for liquidity that actually works

The current generation ties rewards to whether your money is doing anything. In range-based pools, reward programmes can target where liquidity sits rather than how much was staked [4]. Uniswap v4 hooks — code attached to a pool that runs when liquidity is added or removed and when swaps happen — give programmes a direct way to see that [8]. The patterns look like this:

- **Pay only in-range positions.** PancakeSwap Infinity farms, for example, reward only in-range positions, recalculated every eight-hour epoch [5].
- **Pay in proportion to fees earned**, which means paying for volume actually executed rather than capital parked nearby. The same Infinity farms split rewards by the fees each position earned [5].
- **Pay more when it is hardest.** A hook can track volatility and raise rebates when arbitrage is draining the pool fastest.

## The exploit the old designs allowed

The older designs left a gap that explains why the new generation exists.

In a range-based pool, you can put \$1,000,000 into a range 50% away from the current price. If the reward contract only looks at how much liquidity you staked, the two positions below are paid the same.

| | An honest in-range position | A parked far-away position |
| :--- | :--- | :--- |
| Does it fill trades | Yes, constantly | Not unless price travels 50% |
| Does it carry trading risk | Yes, it is rotated by every move | No rotation. It just sits in one token |
| Does it earn rewards | Yes | Yes, the same |

So a farmer taking almost no risk and contributing no depth collected the same rewards as the person actually making the market. Designs that weight rewards by price location or by fees earned close that gap [4] [5]. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/).

## What to check before farming a pool

| What to check | What good looks like | Walk away if |
| :--- | :--- | :--- |
| What the reward is paid in | A liquid asset, or a token with real depth | A farm token nobody can sell in size |
| When you can sell it | Immediately | A long vest, during which the price can fall |
| How stable the routing is | A predictable programme with a published schedule | A gauge vote next week can send it elsewhere [2] |
| Whether you must be in range | Rewards require active liquidity [5] | Parked money earns the same as working money |
| Whether it clears the cost of the pair | Fees plus rewards beat the pair's volatility cost | A huge rate hiding heavy losses to arbitrage [6] |

The last row matters most. Loss-versus-rebalancing — the value a pool hands to arbitrageurs because its quote lags the market — grows with the pair's volatility whatever the reward rate [6]. A full checklist is in the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Where to watch the numbers

- **Token issuance, unlock dates and vesting cliffs:** [Token Unlocks](https://tokenunlocks.app) and [DeFiLlama](https://defillama.com).
- **How much of the reward token is being sold daily:** [Dune Analytics](https://dune.com).
- **Your own position, rewards and net result:** [Revert Finance](https://revert.finance).

## When something goes wrong

- **The advertised rate halved in two days.** New deposits diluted the rewards per dollar. Recalculate, and if the rate no longer covers what the pair costs you, consider leaving.
- **The reward token keeps falling.** Farmers' selling is outrunning demand for it. A fixed rule, such as selling each harvest into a liquid asset, keeps you from holding it by default.
- **You cannot withdraw because of a lock-up.** Next time, ask before you lock: would the maximum reward still justify the position if the reward token fell sharply while you were stuck?

## Where to go next

Read the user's side of the same mechanism in [Yield Farming Explained](/guides/yield-farming-explained/), and the three activities side by side in [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/). To test whether a pool's income outlasts its rewards, use [Real Yield in Liquidity Pools](/guides/real-yield-liquidity-pools/) and read the rate correctly with [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/). For one programme in practice, see [PancakeSwap Liquidity Pools](/guides/pancakeswap-liquidity-pools/), and for a single-asset alternative, [Liquidity Pool vs Staking](/guides/liquidity-pool-vs-staking/).

## References

1. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
2. [What is veCRV? (Curve Knowledge Hub)](https://docs.curve.finance/user/vecrv/what-is-vecrv)
3. [Hidden Hand Overview (Hidden Hand Documentation)](https://learn.hiddenhand.finance/)
4. [On Liquidity Mining for Uniswap v3 (Yin and Ren, 2021)](https://arxiv.org/abs/2108.05800)
5. [Farms (PancakeSwap Infinity Documentation)](https://docs.pancakeswap.finance/trade/pancakeswap-infinity/farms)
6. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
8. [Uniswap v4 Hooks (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)

[1]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[2]: https://docs.curve.finance/user/vecrv/what-is-vecrv "What is veCRV? (Curve Knowledge Hub)"
[3]: https://learn.hiddenhand.finance/ "Hidden Hand Overview (Hidden Hand Documentation)"
[4]: https://arxiv.org/abs/2108.05800 "On Liquidity Mining for Uniswap v3 (Yin and Ren, 2021)"
[5]: https://docs.pancakeswap.finance/trade/pancakeswap-infinity/farms "Farms (PancakeSwap Infinity Documentation)"
[6]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[8]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap Developer Documentation)"
