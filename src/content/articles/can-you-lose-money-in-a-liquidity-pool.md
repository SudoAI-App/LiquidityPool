---
title: "Can You Lose Money in a Liquidity Pool? Six Loss Paths"
description: "The six distinct ways a liquidity position loses value, how large each one typically is, and which of them a headline yield figure never prices."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Siddharth Mehta"
readTime: "11 min read"
keywords: "can you lose money in a liquidity pool, liquidity pool risks, why is my liquidity position losing money, what happens if one token goes to zero, is high APY safe, rug pull liquidity"
featured: false
faq:
  - q: "Can you lose money in a liquidity pool?"
    a: "Yes, through six distinct routes: both assets falling, divergence against holding, time out of range, contract or hook failure, a depeg that fills the pool with the failing asset, and friction costs including gas and slippage. Only two of those are specific to automated market making."
  - q: "Why is my liquidity position losing money?"
    a: "Work through the causes in order. Check whether both assets are simply down, then whether the pair diverged, then whether the position is out of range, then whether fees have covered the gap. Most cases resolve at one of the first three checks."
  - q: "What happens if one token in a pool goes to zero?"
    a: "The invariant keeps buying it as it falls, so the pool ends up holding almost entirely the worthless asset. The position is close to a total loss even though no contract failed. This is why the credibility of both assets matters more than the pool's fee tier."
  - q: "Is a high APY liquidity pool safe?"
    a: "A high quoted rate is compensation for something. It usually reflects high volatility, thin liquidity, emission funding that will taper, or an unaudited contract. The rate itself is evidence about the risk, not about the opportunity."
---

Yes, and in more ways than the familiar one. Impermanent loss dominates the conversation because it is the mechanism unique to automated market making, but in practice it is rarely the largest line in a losing position. Sorting the loss paths by mechanism makes each one testable in advance instead of diagnosable afterwards.

Six paths, in rough order of how often they explain a disappointing outcome.

<figure class="article-figure">
  <img src="/images/guides/can-you-lose-money-in-a-liquidity-pool.webp" alt="Six labelled cards describing directional loss, divergence, out-of-range, contract risk, depeg and friction." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six loss paths for a pooled position, only two of which are specific to automated market making. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When a position is down, the first question is always the same: down against what? Half the time the pair is simply lower and the pool did nothing wrong. Establish the benchmark before you diagnose the mechanism, or you will spend a week optimising a range when the actual issue is that you are long an asset you did not want."*

## 1. Directional Loss: The Market Went Down

The most common cause has nothing to do with pools. Supplying ETH and USDC into a pool leaves you holding roughly half an ETH position; if ETH falls 40%, the position falls with it. No mechanism failed, and no range adjustment would have helped.

This is worth stating explicitly because it is routinely misattributed to impermanent loss. The benchmark for an LP is holding the deposited basket, not holding dollars, and against that benchmark ordinary market movement is neutral.

**Test in advance**: would you hold this basket unpooled? If not, the pool is not the problem to solve.

---

## 2. Divergence Loss: The Pair Moved Apart

When the two assets' relative price changes, the invariant sells the appreciating asset and accumulates the depreciating one. Withdrawing after that rotation yields less than holding the original basket would have.

Magnitudes for an unbounded constant-product pool: 0.6% at a 25% relative move, 5.7% at a 2x, 20% at a 4x. Concentrated positions experience amplified versions of these figures inside their range, bounded once the position converts fully. The full derivation is in [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Test in advance**: apply the formula to a plausible price move for the pair, and check that expected fee income over the holding period exceeds it.

---

## 3. Out-of-Range: The Position Stopped Working

A concentrated position outside its bounds earns nothing while remaining fully exposed to the asset it converted into. The loss is not on the balance sheet; it is the income that stopped and the opportunity cost of capital sitting idle.

For a position designed around a narrow band, extended time out of range can consume the entire economic case, particularly after gas costs for rebalancing. See [Out-of-Range Liquidity: Why an LP Position Stops Earning Fees](/guides/out-of-range-liquidity/).

**Test in advance**: compare band width to trailing realised volatility, and price one full rebalance against expected daily fee income.

---

## 4. Contract, Hook and Governance Failure

This is the discrete, total-loss category. It includes exploited pool or periphery contracts, malicious or misconfigured hooks in v4-style pools, upgradeable proxies whose admin keys are compromised, and vault wrappers that fail independently of the pool beneath them [2].

Two sub-cases deserve naming:

- **Rug pulls**, where deployer privileges or unlocked liquidity allow the creator to withdraw the pool, usually on a newly launched token. Checking whether liquidity is locked or burned, and by what verifiable mechanism, is a five-minute test that eliminates most of these.
- **Permissioned withdrawal**, where a hook or wrapper can block or tax removal. This is a v4-era risk that did not exist in earlier pool designs and must be read from the hook's permissions.

**Test in advance**: enumerate every contract in the stack, check audits and upgrade keys for each, and confirm the withdrawal path is unconditional. The full method is in [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

---

## 5. Depeg and Tail Absorption

On amplified curves designed for pegged assets, the pool holds price near par until reserves are heavily skewed [3]. When one asset breaks its peg, traders sell it into the pool at near-par prices, and the pool absorbs it. LPs end up holding predominantly the failing asset.

This applies to fiat stablecoins, liquid staking receipts against their base asset, wrapped assets against their canonical version, and synthetic dollars. The fee income during normal conditions is small; the tail event is large and fast.

The limiting case is an asset going to zero. The invariant buys it the entire way down, and the position ends as a near-total loss with no contract failure involved.

**Test in advance**: understand what backs each asset, how redemption works under stress, and what the pool holds at 90/10 skew.

---

## 6. Friction: Gas, Slippage and Emission Decay

The quiet category. Entry swaps to reach the required ratio, gas on mint, collect, rebalance and exit, price impact on large deposits, and the price decay of emitted tokens between accrual and sale.

For positions under a few thousand dollars on a high-fee network, friction alone can exceed all fee income for the period. For larger positions it is a rounding error. The threshold is worth computing explicitly rather than assumed. See [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).

**Test in advance**: total the round-trip cost at your position size and divide by expected daily fee income. If the answer is more than a few days, the position needs a longer horizon or a wider range.

### Reading a high quoted yield as a risk signal

High advertised rates are not free money that others have overlooked. Competitive capital moves quickly, so a rate that stays high is being sustained by something: volatility that makes the pair expensive to quote, thin liquidity that will not absorb your exit, emissions that will taper on a published schedule, or an unaudited contract that most desks refuse to touch. Each of those is a specific, checkable condition.

The useful habit is to treat an unusually high rate as a question rather than an answer. Identify which of the four conditions is producing it, then decide whether you are being paid enough for that specific exposure. A pool paying 60% because it is genuinely volatile is a legitimate trade for someone sized correctly. A pool paying 60% because nobody has audited it is not a trade at all.

### Typical magnitudes, side by side

| Loss path | Typical size on a \$10,000 position | Visible in advance? |
| :--- | ---: | :--- |
| Directional move (pair falls 30%) | −\$3,000 | Yes, from the pair you chose |
| Divergence at a 2x relative move | −\$572 | Yes, from the formula |
| One month fully out of range | −\$120 of foregone fees | Yes, from band width and volatility |
| Contract or hook failure | up to −\$10,000 | Partly, from permissions and audits |
| Depeg absorbed at par | −\$1,500 to −\$4,000 | Partly, from collateral quality |
| Friction on a small position | −\$70 to −\$200 | Yes, from gas and transaction count |

The ordering is instructive. The largest routine line is the one nobody calls a liquidity pool risk, and the smallest is the one that gets the most attention.

---

## 7. Diagnostic Order When a Position Is Down

1. **Compare against holding the basket.** If the basket is down the same amount, the pool is neutral and the issue is asset selection.
2. **Check the relative price move.** Apply the divergence formula and see whether the gap is explained.
3. **Check range status and time in range.** Idle capital explains missing income, not missing principal.
4. **Reconcile fees collected** against the divergence, using position accounting on [Revert Finance](https://revert.finance).
5. **Check the pool's composition.** A heavy skew toward one asset signals a depeg or a collapsing token rather than ordinary rotation.
6. **Verify contract state.** Confirm the pool, hook and any wrapper are functioning and that withdrawal is unconditional.
7. **Total the friction** actually paid, including every transaction, and compare it against gross fee income.

Working the list in order takes minutes and almost always terminates before step five. The value of the sequence is that it separates the losses you chose to underwrite from the ones you did not notice you were taking.

## Where to Go Next

Measure the second and third loss paths directly: divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/), and the fee income that has to offset it in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[5]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
