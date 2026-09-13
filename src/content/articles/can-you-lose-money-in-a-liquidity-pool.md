---
title: "Can You Lose Money in a Liquidity Pool? Six Loss Paths"
description: "Six separate ways a pool position loses money, roughly how much each one costs, and the order to check them in when a position is down."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "6 min read"
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

Yes, and in six separate ways. Most people only know one of them.

Impermanent loss — the gap between a pool position and simply holding — gets all the attention because it is the one unique to pools. In practice it is rarely the biggest number in a losing position.

This guide separates all six, gives you rough sizes for each, and gives you an order to check them in when something is down.

<figure class="article-figure">
  <img src="/images/guides/can-you-lose-money-in-a-liquidity-pool.webp" alt="Six labelled cards describing directional loss, divergence, out-of-range, contract risk, depeg and friction." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six loss paths for a pooled position, only two of which are specific to automated market making. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"When a position is down, the first question is always: down against what? Half the time the pair is simply lower and the pool did nothing wrong. Fix the benchmark before you diagnose anything, or you will spend a week tuning a range when the real problem is that you are long something you never wanted."*

## One: the market went down

The most common cause has nothing to do with pools at all.

Put ETH and dollars into a pool and you are holding roughly half an ETH position. If ETH falls 40%, your position falls by roughly a fifth, most of it simply because half your money was in ETH. No mechanism failed, and no range would have saved you.

Worth stating plainly, because this gets blamed on impermanent loss constantly. Your benchmark is holding the two tokens, not holding cash. Against that, ordinary market movement is neutral.

**Check before you deposit:** would you hold this basket outside a pool? If not, the pool is not the problem to solve.

## Two: the two tokens moved apart

When the relative price changes, the pool sells the one going up and buys the one going down. Withdraw after that and you have less than holding would have given you.

| Relative move | What it costs, full range |
| :--- | ---: |
| 25% | -0.6% |
| Doubling | -5.7% |
| 4x | -20% |

A range-based position feels amplified versions of these inside its band, then stops once it fully converts. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Check before you deposit:** apply the formula to a plausible move for this pair, and confirm expected fees over your holding period beat it.

## Three: the position stopped working

A range position outside its bounds earns nothing while staying fully exposed to whichever token it converted into.

This one does not show up on a balance sheet. It is income that stopped, plus money sitting idle. On a narrow band, a long stretch out of range can consume the entire case for the position, especially after paying gas to move it. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

**Check before you deposit:** compare the band width to how much the pair actually moves, and price one full rebalance against expected daily fees.

## Four: the code failed

This is the total-loss category. Exploited pool contracts, malicious or badly written hooks, upgradeable contracts whose keys were compromised, and vault wrappers that fail independently of the pool underneath [2].

Two cases worth naming:

- **Rug pulls.** The creator withdraws the pool, usually on a new token. Checking whether liquidity is locked or burned, and by what mechanism, is a five-minute test that eliminates most of these.
- **Blocked withdrawals.** A hook or wrapper that can stop or tax you leaving. This risk did not exist in older pool designs, and it has to be read from the hook's permissions.

**Check before you deposit:** list every contract in the stack, check audits and keys for each, and confirm the exit path has no conditions on it. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Five: a peg broke and the pool absorbed it

On curves built for pegged assets, the pool holds the price near par until its balances are badly skewed [3]. When one token breaks, traders sell it in at almost full price, and the pool keeps buying.

This applies to fiat stablecoins, staked-ETH tokens against ETH, wrapped assets against the real thing, and synthetic dollars. Small steady fees, then one large fast event.

The extreme case is a token going to zero. The pool buys it the whole way down and the position ends as a near-total loss, with no contract having failed at any point.

**Check before you deposit:** understand what backs each token, how redemption works under stress, and what you would be holding at 90/10 skew.

## Six: the friction nobody counts

The quiet one. Swapping into the right ratio, gas on minting, claiming, rebalancing and exiting, price impact — the way your own order pushes the rate — on a large deposit, plus slippage, the gap between the quote and the fill, and reward tokens losing value between earning them and selling them.

On a position under a few thousand dollars on an expensive chain, friction alone can exceed every fee you earn. On a large one it rounds to nothing. Work out which you are. See [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).

**Check before you deposit:** total the round trip at your size and divide by expected daily fees. More than a few days and the position needs a longer horizon or a wider band.

## How big each one actually is

On a \$10,000 position:

| What happened | Roughly what it costs | Could you see it coming? |
| :--- | ---: | :--- |
| ETH fell 30% in an ETH/USDC pool | -\$1,500 | Yes, from the pair you chose |
| The two tokens moved 2x apart | -\$572 | Yes, from the formula |
| A month fully out of range | -\$120 of foregone fees | Yes, from band width and volatility |
| The code failed | up to -\$10,000 | Partly, from permissions and audits |
| A peg broke | -\$1,500 to -\$4,000 | Partly, from collateral quality |
| Friction on a small position | -\$70 to -\$200 | Yes, from gas and transaction count |

Read the ordering. The biggest routine line is the one nobody calls a liquidity pool risk. The smallest is the one that gets all the attention.

## A high advertised rate is a question, not an answer

Nobody has left free money lying around. Capital moves fast. A rate that stays high is being held up by something specific:

| Why the rate is high | What that means for you |
| :--- | :--- |
| The pair is genuinely volatile | A real trade, if you size it properly |
| The pool is thin | You will not get out at the price you expect |
| Rewards are funding it | Check the schedule. It ends |
| Nobody has audited it | Not a trade. Walk away |

The useful habit is to work out which of those four is producing the number, then decide whether you are being paid enough for that particular exposure. A pool paying 60% because the pair really does move that much is legitimate. A pool paying 60% because no serious desk will touch the contract is not.

## What to do when a position is down

1. **Compare against holding the two tokens.** If the basket fell the same amount, the pool was neutral and your issue is what you chose to hold.
2. **Check how far the pair moved apart.** Apply the formula and see whether it explains the gap.
3. **Check whether you are in range**, and how long you have been out. That explains missing income, not missing principal.
4. **Reconcile fees against the divergence**, using [Revert Finance](https://revert.finance).
5. **Look at the pool's balance.** A heavy skew toward one token means a peg or a token is breaking, not ordinary rotation.
6. **Check the contracts.** Confirm the pool, the hook and any wrapper still work and that withdrawal has no conditions.
7. **Total what you actually paid in friction**, every transaction, against gross fees.

Working that list takes minutes and almost always stops before step five. Its value is that it separates the losses you agreed to take from the ones you did not notice.

## Where to go next

Measure the second and third directly: divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/), and the fees that have to offset it in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). For the same question from the revenue side, see [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
3. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
5. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
6. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[4]: https://www.bis.org/publ/bisbull58.htm "Miners as intermediaries: extractable value and market manipulation in crypto and DeFi (BIS Bulletin No 58, 2022)"
[5]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[6]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
