---
title: "The Liquidity Pool Research Checklist: Questions to Ask Before You Act"
seoTitle: "Liquidity Pool Research Checklist: Questions Before You Act"
description: "Five groups of checks to run before you deposit: the contract, the tokens, the trading, the maths, and getting your money back out."
category: "Advanced"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "9 min read"
primaryQuery: "liquidity pool checklist"
keywords: "liquidity pool checklist, DeFi liquidity research checklist, LP due diligence checklist, hook security audit, LVR hurdle test, flow toxicity check, liquidity pool audit checklist, how to check locked liquidity, DeFi pool risk assessment"
featured: false
faq:
  - q: "What should I check before providing liquidity?"
    a: "Contract verification and audits, upgrade keys and timelocks, hook permissions, liquidity lock status, oracle dependencies, active depth at the current price, routed volume by tier, incentive schedule, and an unconditional withdrawal path."
  - q: "How do I check if liquidity is locked?"
    a: "Read the locker contract or the burn address holding the LP claim and confirm the amount and unlock time onchain. A screenshot or a claim in documentation is not verification."
  - q: "How often should a pool be re-reviewed?"
    a: "Whenever a parameter that drove the original decision changes: an incentive programme starting or ending, a governance vote on fees or gauges, a hook upgrade, or a change in the pair's volatility regime."
  - q: "How do I check whether pool liquidity is locked or unlocked?"
    a: "Read the LP token's holder list and confirm whether the balance sits in a locker contract or a burn address, then read the lock entry for the amount and unlock timestamp. Anything held in an ordinary wallet is withdrawable at any moment."
  - q: "Does a liquidity pool smart contract audit make it safe?"
    a: "An audit is evidence about a specific commit at a specific time. Confirm that the deployed bytecode matches the audited version, check for a proxy and its upgrade authority, and treat the report as one input rather than as a verdict."
---

Many avoidable losses in liquidity pools have nothing to do with obscure maths. They come from depositing on the strength of a dashboard number, before asking a few specific questions.

This is that list. It has five groups of checks: the contract holding your money, the tokens in it, who is trading against you, whether the maths works at all, and whether you can get out.

Work through it before you sign anything. By the end, you should be able to say yes, no, or "not at this size" to a specific pool. If any check fails outright, the answer is no, whatever the yield says.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-research-checklist.webp" alt="A pool on a workbench with five inspection stations for the contract, the tokens, the traders, the arithmetic and the exit." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five groups of checks, run in order, before any money goes into a pool. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> A checklist exists to stop you allocating on feeling. The most common failure is skipping the contract and price-feed checks because the pool advertises a high rate. If the contract can be changed by someone you have not identified, or the price comes from one thin feed, the yield calculation no longer describes your risk.

## One: the contract holding your money

Pools used to be simple immutable contracts. Newer designs such as Uniswap v4 share a single engine and let each pool attach custom code called hooks, which run at set moments and can change what happens [1].

That code is usually not written by the protocol team. Check five things.

- **What is the hook allowed to do?** In Uniswap v4 the permissions are encoded in the hook's own address, so you can read them without trusting anyone [1] [7]. Look specifically for permissions around removing liquidity.
- **Can it stop you leaving?** A hook that runs code before liquidity is removed can, in principle, block the withdrawal. The v4 design keeps that permission separate from the one for adding liquidity for exactly this reason [1].
- **Can it change the fee?** In a Uniswap v4 dynamic-fee pool, the hook can set the fee anywhere up to 100% of the swap [13]. Read what the code actually does.
- **Can it be swapped out later?** Immutable, or behind an upgradeable proxy? If upgradeable, find out who holds the key, how many signatures a change needs, and whether there is a delay. Governance power in DeFi is often concentrated in a founding team and its investors [9], so check the holders, not the label. The delay should be long enough for you to notice a change and withdraw first.
- **Does the audit cover what is deployed?** An audit covers one version of the code at one moment. Check that the deployed bytecode matches the audited commit, and whether a proxy can replace it.

One more, and it is not about the pool. Approve only the amount you are actually depositing. An unlimited approval to an unaudited router stays open long after you have forgotten about it.

See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) for what each of these looks like when it fails.

## Two: the tokens the pool holds

A pool is only as sound as its weakest token. If one collapses, the pool's own rule makes you its buyer of last resort: arbitrage sells you the weak token and takes the sound one.

- **Is the token the original, or a wrapper?** A natively issued token and a bridged version can share a name. A wrapper is only worth what the bridge still holds, and bridges are a known point of failure [9].
- **What actually backs it?** For synthetic dollars, what is the hedge, and what happens if funding stays negative for months?
- **How long does redeeming take?** Liquid staking tokens are redeemed through the provider's queue or sold on the market [10]. If redeeming takes two weeks, then in a panic your pool becomes the fast exit, and everyone uses it.
- **Can somebody freeze it?** Many centralised stablecoins include a function to freeze an address. Check whether the token's contract has one and who controls it.

For pegged pairs, two extra questions. How high is the amplification setting? A high one means deep liquidity at the peg and a sharp drop-off beyond it [3]. And is there a working primary redemption, or is the pool the only way out?

See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## Three: who is trading against you

A \$100M pool can pay worse and fill worse than a \$5M one. That happens when most of its money sits in ranges the price has left [2], and most of its volume is arbitrage [4].

- **How much money is near the price?** Measure liquidity within 1% and 2% of the current price, and compare it with the headline figure. The smaller that share, the less the headline tells you about the fills traders get and the fee share you would earn.
- **What share of volume is arbitrage?** Add up trades from known bot contracts at the top of blocks and cross-venue bundles, and divide by the total. Arbitrage pays fees but also costs you LVR (the value lost to faster traders, covered in check four) [4], so the higher that share, the less each dollar of volume is worth to you.
- **Is somebody taking the best fees?** Scan recent blocks for liquidity added and removed in the same block around large trades. This just-in-time liquidity captures fees on the swaps least likely to be arbitrage, and leaves passive depositors with the rest [11].
- **Where does the good flow come from?** Ordinary users trading through wallets and aggregators are usually the least informed flow, so they are the trades most likely to pay you more in fees than they cost.

All of these are forms of MEV (maximal extractable value), profit taken by whoever controls the order of transactions in a block. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/) and [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Four: does the maths work at all

This is the check people skip, and it decides most cases.

Your pool's price lags the market, and faster traders take the difference. That cost is loss-versus-rebalancing, or LVR — what you lose against a portfolio holding the same tokens but trading at market prices [4]. For a full-range position, its yearly rate before fees is:

$$
\text{Annual cost} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 80% means $\sigma = 0.80$.
- The result is a share of the position's value per year, measured against that rebalancing benchmark.

Run it on a real pair. A pair moving 90% a year costs a full-range position about 10.1% a year against the benchmark. If the pool pays 7.5% in real trading fees, the position falls behind the benchmark by about 2.6% a year before gas. Narrowing the range raises the fee share and this cost together, so it does not fix the gap [6].

| Volatility of the pair | Full-range fee yield needed to match LVR |
| :--- | ---: |
| 40% | 2.0% |
| 60% | 4.5% |
| 80% | 8.0% |
| 100% | 12.5% |
| 150% | 28.1% |

These are slightly conservative. Fees and block timing reduce how much arbitrageurs actually capture, so realised LVR usually runs below the formula [12].

Then do one more thing. Work out exactly what you would be holding if the price fell 20%, fell 50%, and doubled. If you would not want to hold that, the position is wrong regardless of the arithmetic.

This is a harder test than impermanent loss, which compares the pool only with holding and depends on where the price happens to end. LVR prices what volatility costs you on average. See [Market Making on AMMs](/guides/market-making-on-amms/) and [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Five: getting your money back out

Plenty of positions look fine until you add up what it costs to run them.

- **Add up the round trip.** Depositing, claiming fees and withdrawing all cost gas. Look up what a recent close of a similar position cost on a block explorer. On a small position on a busy chain, the round trip can exceed a year of fees. If fees would take longer to cover it than you plan to stay, the position is too small.
- **Protect the transactions themselves.** Deposits, adjustments and withdrawals sent to the public queue can be front-run [5]. A private relay removes most of that exposure.
- **If a vault runs it, ask how it rebalances.** A vault that sends market orders to the public queue is exposed in the same way. Batch auctions or private relays reduce it.
- **Test the emergency exit.** Can you withdraw during a congested, expensive hour? Do you hold enough of the native token to pay for it?
- **Check for lockups.** Some vaults settle withdrawals in epochs or enforce a cooldown. Find out before you need the money.

## The scorecard

If anything lands in the last column, the answer is no. The middle column means you need a specific reason to go ahead.

| What you are checking | Pass | Look closer | Reject |
| :--- | :--- | :--- | :--- |
| Hook permissions | Immutable, no control over withdrawals | Upgradeable, with a delay you could act within | Can block withdrawals, or upgrade with no delay |
| Contract audit | Audited, and deployed code matches | Audited, but versions differ or findings are open | Unaudited or unverified |
| Approvals | Exact amount | Unlimited, on a long-established protocol | Unlimited, on something unverified |
| Token origin | Natively issued | Bridged, with a long record and published reserves | Bridged through a thin or new wrapper |
| Redemption | Instant, or a short published queue | A queue of days to weeks | Suspended or halted |
| Liquidity near the price | Most of the headline figure | A minority of it | Almost none |
| Arbitrage share of volume | A minority | Around half | Most of it |
| Just-in-time fee capture | Rare | Regular on large swaps | Takes most large-swap fees |
| Fee yield against LVR | Clears it on 7- and 30-day windows | Clears it on one window only | Below it on both |
| Gas payback | Well within your holding period | Close to your holding period | Longer than you plan to stay |
| How you send transactions | Private relay | Public queue, tight slippage limit | Public queue, loose slippage limit |

## What to do with all this

1. **Run all five groups, every time.** Not from a screenshot. From the chain.
2. **Size the position on the downside, not the deposit.** A range position becomes entirely the weaker token below its lower bound [2]. Decide what you are willing to hold there, and size to that.
3. **Set an alert for going out of range.** Liquidity outside its range earns nothing until the price returns [2], so you want to know the moment it stops earning.
4. **Re-check against both benchmarks.** Against holding, to see what you actually made. Against LVR, to see whether the fees are covering the cost of providing liquidity [4].

## Where to watch the numbers

- **Contract code, proxies and admin keys:** [Etherscan](https://etherscan.io).
- **Protocol revenue and how well capital stays:** [Token Terminal](https://tokenterminal.com).
- **Pool volume, tiers and depth:** [DeFiLlama Yields](https://defillama.com/yields).

## When something fails a check

- **The contract code is not verified.** Reject it. You cannot assess code you cannot read.
- **A single wallet controls upgrades.** One key can change the rules or stop your withdrawal. Require several signers and a delay before you deposit.
- **The price comes from one thin source.** Price-oracle manipulation is among the most frequent causes of DeFi losses [8], and the Financial Stability Board flags reliance on a single oracle as a specific weakness [9]. Look for a widely used feed or a properly averaged one.

## Where to go next

Two calculations belong beside this list: expected fee income in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.05&capital=10000), and your result against holding in the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=2500&capital=10000). For a broader scoring method, see [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/), and for the deposit itself, [How to Provide Liquidity](/guides/how-to-provide-liquidity/). [Liquidity Provider Fees](/guides/liquidity-provider-fees/) covers the income side, and [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/) lists every way the money can go.

## References

1. [Uniswap v4 Core (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Uniswap v3 Core (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden & Zhang, 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Uniswap v4 Hooks (Uniswap developer documentation)](https://developers.uniswap.org/docs/protocols/v4/concepts/hooks)
8. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
9. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
10. [Staking withdrawals (ethereum.org)](https://ethereum.org/en/staking/withdrawals/)
11. [The Paradox Of Just-in-Time Liquidity in Decentralized Exchanges: More Providers Can Sometimes Mean Less Liquidity (Capponi, Jia & Zhu, 2023)](https://arxiv.org/abs/2311.18164)
12. [Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)](https://arxiv.org/abs/2305.14604)
13. [LPFeeLibrary.sol (Uniswap v4-core source code)](https://github.com/Uniswap/v4-core/blob/main/src/libraries/LPFeeLibrary.sol)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core (Adams et al., 2024)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core (Adams et al., 2021)"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden & Zhang, 2022)"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[7]: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks "Uniswap v4 Hooks (Uniswap developer documentation)"
[8]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[9]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[10]: https://ethereum.org/en/staking/withdrawals/ "Staking withdrawals (ethereum.org)"
[11]: https://arxiv.org/abs/2311.18164 "The Paradox Of Just-in-Time Liquidity in Decentralized Exchanges: More Providers Can Sometimes Mean Less Liquidity (Capponi, Jia & Zhu, 2023)"
[12]: https://arxiv.org/abs/2305.14604 "Automated Market Making and Arbitrage Profits in the Presence of Fees (Milionis, Moallemi & Roughgarden, 2023)"
[13]: https://github.com/Uniswap/v4-core/blob/main/src/libraries/LPFeeLibrary.sol "LPFeeLibrary.sol (Uniswap v4-core source code)"
