---
title: "Can You Lose Money in a Liquidity Pool? Six Loss Paths"
description: "Six separate ways a pool position loses money, roughly how much each one costs, and the order to check them in when a position is down."
category: "Risk & Research"
date: 2026-09-10
lastReviewed: "2026-09-12"
author: "LiquidityPools Editorial Team"
readTime: "8 min read"
primaryQuery: "can you lose money in a liquidity pool"
keywords: "can you lose money in a liquidity pool, liquidity pool risks, why is my liquidity position losing money, what happens if one token goes to zero, is high APY safe, rug pull liquidity"
featured: false
faq:
  - q: "Can you lose money in a liquidity pool?"
    a: "Yes, through six distinct routes: both assets falling, divergence against holding, time out of range, contract or hook failure, a depeg that fills the pool with the failing asset, and friction costs including gas and slippage. Only two of those are specific to automated market making."
  - q: "Why is my liquidity position losing money?"
    a: "Work through the causes in order. Check whether both assets are simply down, then whether the pair diverged, then whether the position is out of range, then whether fees have covered the gap. Most cases resolve at one of the first three checks."
  - q: "What happens if one token in a pool goes to zero?"
    a: "The pool keeps buying it as it falls, so it ends up holding almost entirely the worthless asset. The position is close to a total loss even though no contract failed. This is why the credibility of both assets matters more than the pool's fee tier."
  - q: "Is a high APY liquidity pool safe?"
    a: "A high quoted rate is compensation for something. It usually reflects high volatility, thin liquidity, emission funding that will taper, or an unaudited contract. The rate itself is evidence about the risk, not about the opportunity."
---

Yes, and in six separate ways. Most people only know one of them.

Impermanent loss — how far a pool position falls behind just holding the same two tokens — gets all the attention because only pools have it. In practice it is rarely the biggest number in a losing position.

Below, each of the six gets a rough size on a \$10,000 position and a check you can run before you deposit. By the end you should be able to look at a losing position and say which of the six you are looking at.

<figure class="article-figure">
  <img src="/images/guides/can-you-lose-money-in-a-liquidity-pool.webp" alt="Six labelled cards describing directional loss, divergence, out-of-range, contract risk, depeg and friction." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Six loss paths for a pooled position, only two of which are specific to automated market making. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> When a position is down, the first question is always: down against what? Often the pair is simply lower and the pool did nothing wrong. Fix the benchmark before you diagnose anything, or you can spend a week tuning a range when the real problem is that you are long a token you never wanted.

## One: the market went down

The most common cause has nothing to do with pools at all.

Put ETH and dollars into a full-range pool and about half your money is in ETH. If ETH falls 40%, the position falls about 22.5%. Twenty points of that is simply the ETH you held. The other 2.5 points is the pool's rebalancing, and no range choice would have saved you from the twenty.

This gets blamed on impermanent loss constantly. Measured against holding the same two tokens, ordinary market movement is neutral. Only the pool's 2.5 points belongs to the pool.

**Check before you deposit:** would you hold this basket outside a pool? If not, the pool is not the problem to solve.

## Two: the two tokens moved apart

When the relative price changes, the pool sells the token going up and buys the one going down. Traders do this to it: they buy whatever the pool is underpricing until its price matches the wider market. Withdraw after that and you have less than holding would have given you, and the fees may not be enough to make up the gap [1].

| Relative move | Shortfall against holding, full range |
| :--- | ---: |
| Up 25%, or down 20% | -0.62% |
| Doubling, or halving | -5.72% |
| Four times, either way | -20.0% |

A range position takes amplified versions of these inside its band. Once price leaves the band, the position holds only one token [2]. It stops trading, but its shortfall against holding keeps growing as the price moves further away. See [The Impermanent Loss Formula](/guides/impermanent-loss-formula/).

**Check before you deposit:** apply the formula to a plausible move for this pair, and confirm expected fees over your holding period beat it. The structural ways to keep that gap small are collected in [How to Avoid Impermanent Loss](/guides/how-to-avoid-impermanent-loss/).

## Three: the position stopped working

A range position outside its bounds earns no fees, while staying fully exposed to whichever token it converted into [2] [3].

This one does not show up on a balance sheet. It is income that stopped, plus money sitting idle. On a narrow band, a long stretch out of range can erase the case for the position, especially once you pay gas to move it [3]. See [Out-of-Range Liquidity](/guides/out-of-range-liquidity/).

**Check before you deposit:** compare the band width to how much the pair actually moves, and price one full rebalance against expected daily fees.

## Four: the code failed

This is the total-loss category. One survey of DeFi incidents counted at least \$3.24 billion lost by users, liquidity providers and protocol operators across 181 incidents between April 2018 and April 2022 [4].

For a pool position, the failure points are the pool contract itself, any hook attached to it, upgradeable contracts whose admin keys get compromised, and vault wrappers that can fail independently of the pool underneath [3].

Two cases worth naming:

- **Rug pulls.** If the token team is the main liquidity provider and its liquidity is not locked, it can withdraw that liquidity whenever it chooses [3]. Checking whether liquidity is locked or burned, and by which contract, is a quick test that rules out the commonest version.
- **Blocked or taxed withdrawals.** On Uniswap v4, a pool's hook can be allowed to run code when you remove liquidity, and can charge withdrawal fees through custom accounting. The protocol's own whitepaper notes that hooks able to affect adding liquidity, but not removing it, are the safer kind for providers [5]. Read the hook's permissions before you deposit.

**Check before you deposit:** list every contract in the stack, check audits and keys for each, and confirm the exit path has no conditions on it. See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) and [The Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/).

## Five: a peg broke and the pool absorbed it

Curves built for pegged assets hold the price near par until the balances are badly skewed, and only then start behaving like an ordinary pool [6]. When one token breaks, traders sell it in at close to full price, and the pool keeps buying.

This applies to fiat stablecoins, staked-ETH tokens against ETH, wrapped assets against the real thing, and synthetic dollars. In May 2022, for example, stETH fell in value relative to ETH, and a lender that had promised its depositors easy redemption had to halt withdrawals [7]. The pattern is small steady fees, then one large, fast event.

The extreme case is a token going to zero. The pool buys it the whole way down and the position ends as a near-total loss, with no contract having failed at any point.

**Check before you deposit:** understand what backs each token, how redemption works under stress, and what you would be holding at 90/10 skew.

## Six: the friction nobody counts

The quiet one. Gas on minting, claiming, rebalancing and exiting. The swap to get into the right ratio. Price impact — how far your own order moves the rate — on a large deposit. Slippage, the gap between the quote and the fill. And reward tokens losing value between earning them and selling them.

On a position under a few thousand dollars on an expensive chain, friction alone can exceed every fee you earn. On a large one it rounds to nothing. Work out which you are. See [Slippage and Price Impact](/guides/slippage-and-price-impact/) and [APR vs APY in DeFi](/guides/apr-vs-apy-in-defi/).

**Check before you deposit:** total the round-trip cost at your size and divide by expected daily fees. The answer is how many days of income the position spends just paying for itself. Compare that with how long you actually plan to stay.

## How big each one actually is

On a \$10,000 position, with the scenario stated so you can rerun each line:

| What happened | Rough cost | Measured against | Could you see it coming? |
| :--- | ---: | :--- | :--- |
| ETH fell 30% in a full-range ETH/USDC pool | -\$1,633, of which -\$133 is the pool | Cash | Yes, from the pair you chose |
| ETH doubled against USDC | -\$858 | Holding the two tokens | Yes, from the formula |
| A month out of range, on a band earning 15% a year in range | -\$125 of fees not earned | Staying in range | Yes, from band width and volatility |
| The code failed | Up to -\$10,000 | Cash | Partly, from permissions and audits |
| One stablecoin settles at \$0.90, or at \$0.80 | About -\$870 to -\$1,820 | Cash | Partly, from collateral quality |
| Eight transactions at \$9 to \$25 each | -\$72 to -\$200 | Cash | Yes, from gas and transaction count |

The stablecoin line assumes a two-token StableSwap pool with an amplification setting of 100, before fees.

Read the ordering. The largest routine line is plain market exposure, which nobody calls a liquidity pool risk. The divergence line that gets all the attention is real, but usually smaller.

## A high advertised rate is a question, not an answer

Capital moves fast toward easy returns. A rate that stays high for long is usually being held up by something specific:

| Why the rate is high | What that means for you |
| :--- | :--- |
| The pair is genuinely volatile | A real trade, if you size it properly |
| The pool is thin | You will not get out at the price you expect |
| Rewards are funding it | Check the schedule. It ends |
| Nobody has audited it | You are underwriting contract risk with no outside review |

The useful habit is to work out which of those four is producing the number, then decide whether you are being paid enough for that particular exposure. Research on Uniswap v3 providers found the same split: simple strategies were profitable in pools with negligible volatility but paid modest returns, and higher returns came only with more risk and active management [8].

A pool paying 60% because the pair really does move that much can be a fair trade. A pool paying 60% because no serious desk will touch the contract is not.

## What to do when a position is down

1. **Compare against holding the two tokens.** If the basket fell the same amount, the pool was neutral and your issue is what you chose to hold.
2. **Check how far the pair moved apart.** Apply the formula and see whether it explains the gap.
3. **Check whether you are in range**, and how long you have been out. That explains missing income, not missing principal.
4. **Reconcile fees against the divergence**, using [Revert Finance](https://revert.finance).
5. **Look at the pool's balance.** A heavy skew toward one token means a peg or a token is breaking, not ordinary rotation.
6. **Check the contracts.** Confirm the pool, the hook and any wrapper still work and that withdrawal has no conditions.
7. **Total what you actually paid in friction**, every transaction, against gross fees.

Working that list takes minutes, and it usually stops early. Its value is that it separates the losses you agreed to take from the ones you did not notice.

## Where to go next

Measure the second and third paths directly: divergence in the [impermanent loss calculator](/tools/impermanent-loss-calculator/#mode=weighted&a0=2000&a1=4000&b0=1&b1=1&capital=10000&weight=0.5), and the fees that have to offset it in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/#feeTier=0.3&capital=10000&volume=1000000). For the same question from the revenue side, see [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/). If the pool mechanics themselves are still new, start with [Liquidity Pools for Beginners](/guides/liquidity-pools-for-beginners/).

## References

1. [DeFi risks and the decentralisation illusion (Aramonte, Huang & Schrimpf, BIS Quarterly Review, December 2021)](https://www.bis.org/publ/qtrpdf/r_qt2112b.htm)
2. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [What are the risks when providing liquidity? (Uniswap Labs)](https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity)
4. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
5. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
6. [StableSwap: efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
8. [Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)](https://arxiv.org/abs/2205.08904)

[1]: https://www.bis.org/publ/qtrpdf/r_qt2112b.htm "DeFi risks and the decentralisation illusion (BIS Quarterly Review, December 2021)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[3]: https://support.uniswap.org/hc/en-us/articles/37113550065549-What-are-the-risks-when-providing-liquidity "What are the risks when providing liquidity?"
[4]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[5]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[6]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap: efficient mechanism for Stablecoin liquidity"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[8]: https://arxiv.org/abs/2205.08904 "Risks and Returns of Uniswap V3 Liquidity Providers (Heimbach et al., 2022)"
