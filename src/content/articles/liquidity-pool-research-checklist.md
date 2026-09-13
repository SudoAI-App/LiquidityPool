---
title: "The Liquidity Pool Research Checklist: Questions to Ask Before You Act"
description: "Five groups of checks to run before you deposit: the contract, the tokens, the trading, the maths, and getting your money back out."
category: "Advanced"
date: 2026-08-21
lastReviewed: "2026-09-12"
author: "Siddharth Mehta"
readTime: "8 min read"
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

Nobody loses money in a liquidity pool because they failed to read a whitepaper. They lose it because they saw a number on a dashboard and deposited before asking five specific questions.

This is that list. Five groups of checks: the contract holding your money, the tokens in it, who is trading against you, whether the maths works at all, and whether you can actually get out.

Work through it before you sign anything. If any check fails outright, the answer is no, whatever the yield says.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-research-checklist.webp" alt="A pool on a workbench with five inspection stations for the contract, the tokens, the traders, the arithmetic and the exit." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five groups of checks, run in order, before any money goes into a pool. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"A checklist exists to stop you allocating on feeling. The single most common failure is skipping the contract and price-feed checks because the pool is advertising a big number. One upgradeable contract nobody read, or one thin price feed, and your yield calculation stops mattering entirely."*

## One: the contract holding your money

Pools used to be simple immutable contracts. Newer ones share a single engine and attach custom code called hooks, which run at set moments and can change what happens [1].

That code is not written by the protocol. Check four things.

- **What is the hook allowed to do?** In Uniswap v4 the permissions are encoded in the hook's own address, so you can read them without trusting anyone. Look specifically for permissions around removing liquidity.
- **Can it stop you leaving?** A hook that runs code when liquidity is withdrawn can, in principle, refuse. Find out whether it can, and under what conditions.
- **Can it change the fee?** Some hooks can set the fee dynamically, in some cases up to absurd levels.
- **Can it be swapped out later?** Immutable, or behind an upgradeable proxy? If upgradeable, who holds the key, how many signatures does it need, and is there a delay before a change takes effect? Look for at least four of seven signers and a 48-hour delay.

One more, and it is not about the pool. Scope your approvals to the amount you are actually depositing, with an expiry. An unlimited approval to an unaudited router is a standing invitation.

See [Liquidity Pool Risks](/guides/liquidity-pool-risks/) for what each of these looks like when it fails.

## Two: the tokens the pool holds

A pool is only as sound as its weakest token. If one collapses, the pool's own rule makes you the buyer of last resort: it sells the good asset and fills you up with the bad one [2] [3].

- **Is the token the real one?** Natively issued, or a wrapped version that exists because a bridge is holding the original somewhere? Bridges get hacked and the wrapper goes to zero.
- **What actually backs it?** For synthetic dollars, what is the hedge and what happens if funding stays negative for months?
- **How long does redeeming take?** For staked and restaked ETH tokens, find the queue length. If redeeming takes two weeks, then in a panic your pool is the only exit, and everybody uses it [2].
- **Can somebody freeze it?** Most large stablecoins can freeze an address. Check whether the token has that function and what would trigger it.

For pegged pairs, two extra questions. How high is the amplification setting, since a high one means deep liquidity at the peg and a sharp cliff after it [3]? And is there a working primary redemption, or is the pool the only way out?

See [Stablecoin Liquidity Pools](/guides/stablecoin-liquidity-pools/).

## Three: who is trading against you

A \$100M pool can pay worse and fill worse than a \$5M one, if its money sits in dead ranges and its volume is bots [4] [5].

- **How much money is near the price?** Measure within 1% and 2% of where it trades now. Anything under about 15% of the headline figure is a fail.
- **What share of volume is arbitrage?** Add up trades from bot contracts at the top of blocks and cross-venue bundles, and divide by the total. Above 60% and the pool is an arbitrage settlement point, not a business [5] [6].
- **Is somebody stealing the fees?** Scan recent blocks for liquidity minted and burned within the same block around large trades. Above 25% of fee capture and passive depositors get very little [5].
- **Where does the good flow come from?** Trades routed by intent solvers and aggregators are the ones actually paying you. Find out what share they are.

All of that is MEV — value captured by controlling the order transactions run in. See [Onchain Liquidity Metrics](/guides/onchain-liquidity-metrics/) and [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Four: does the maths work at all

This is the check people skip, and it is the one that decides most cases.

Your pool quotes a price a block behind the market. Faster traders take the difference, every day, forever. The cost is loss-versus-rebalancing, or LVR — money handed over purely because the quote is late [4].

$$
\text{Annual cost} \approx \frac{\sigma^2}{8}
$$

Where:

- $\sigma$ is the pair's annual volatility, so 80% means $\sigma = 0.80$.

Run it on a real pair. A pair moving 90% a year costs a full-range position about 10.1% annually. If the pool pays 7.5% in real trading fees, the position loses roughly 2.6% a year before gas. Narrowing the range raises both numbers together, so it does not fix that [4] [6].

| Volatility of the pair | Full-range fee yield you need to break even |
| :--- | ---: |
| 40% | 2.0% |
| 60% | 4.5% |
| 80% | 8.0% |
| 100% | 12.5% |
| 150% | 28.1% |

Then do one more thing. Work out exactly what you would be holding if the price fell 20%, fell 50%, and doubled. If you would not want to hold that, the position is wrong regardless of the arithmetic.

This is a harder test than impermanent loss — the simple gap between a pool position and holding — because it prices what volatility costs you on average, not what happened on one lucky or unlucky path. See [Market Making on AMMs](/guides/market-making-on-amms/) and [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Five: getting your money back out

Plenty of positions look fine until you add up what it costs to run them.

- **Add up the round trip.** Depositing, claiming fees and withdrawing all cost gas. A range position can take 120,000 to 250,000 gas units to close [1] [7]. If the fees take more than three weeks to cover that, the position is too small.
- **Protect the transactions themselves.** Deposits, adjustments and withdrawals can all be front-run. Send them through a private relay.
- **If a vault runs it, ask how it rebalances.** A vault that fires market orders gets picked off. One that routes through batch auctions does not.
- **Test the emergency exit.** Can you withdraw during a congested, expensive hour without running out of gas? Do you hold enough of the native token to pay for it?
- **Check for lockups.** Some vaults settle withdrawals in epochs or enforce a cooldown. Find out before you need the money [6].

## What people get wrong on this checklist

| What people assume | What actually happens |
| :--- | :--- |
| An audit means it is safe | An audit covers one version at one moment. Check the deployed code matches, and whether a proxy can replace it |
| Gas is a rounding error | On a small position on a busy chain, the round trip can exceed a year of fees |
| A wrapped token is the same as the real one | It is a claim on a bridge. If the bridge fails, the wrapper is worthless while the pool still holds it |
| The advertised yield is mine | Fee stealing in single blocks can leave passive depositors with a fraction of what the page shows |

## The scorecard

If anything lands in the last column, the answer is no.

| What you are checking | Pass | Look closer | Reject |
| :--- | :--- | :--- | :--- |
| Hook permissions | Immutable, no control over withdrawals | Upgradeable with a 48-hour delay | Can block withdrawals, no delay |
| Contract audit | Audited by a known firm, code verified | One audit, warnings resolved | Unaudited or unverified |
| Approvals | Exact amount, with an expiry | Unlimited, on an audited protocol | Unlimited, on something unverified |
| Token origin | Natively issued | A bridge with a strong track record | A thin lock-and-mint wrapper |
| Redemption | Instant or a short queue | 7 to 14 days, with published reserves | Suspended or halted |
| Money near the price | Over 40% of the total | 15% to 40% | Under 15% |
| Share that is arbitrage | Under 40% | 40% to 60% | Over 60% |
| Fee stealing | Under 10% of fees | 10% to 25% | Over 25% |
| Yield against the bleed | At least 5 points clear | Clear, but by under 5 points | Below the bleed |
| Gas payback | Under 7 days | 7 to 21 days | Over 21 days |
| How you send transactions | Private relay | Normal wallet, tight tolerance | Public queue, loose tolerance |

## What to do with all this

1. **Run all five groups, every time.** Not from a screenshot. From the chain.
2. **Size the position on the downside, not the deposit.** Ask what you are willing to hold if the price hits your lower bound, and size to that [2].
3. **Set an alert for going out of range.** You want to know the moment a position stops earning, not next week [1] [7].
4. **Re-check against holding, regularly.** If cumulative fees are not beating the bleed, change the pair or change the strategy [4] [6].

See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/), [Liquidity Provider Fees](/guides/liquidity-provider-fees/) and [How to Provide Liquidity](/guides/how-to-provide-liquidity/).

## Where to watch the numbers

- **Contract code, proxies and admin keys:** [Etherscan](https://etherscan.io).
- **Protocol revenue and how well capital stays:** [Token Terminal](https://tokenterminal.com).
- **Pool volume, tiers and depth:** [DeFiLlama Yields](https://defillama.com/yields).

## When something fails a check

- **The contract code is not verified.** Reject it. There is no version of this where guessing is acceptable.
- **A single wallet controls upgrades.** One key can change the rules or stop your withdrawal. Require several signers and a delay before you deposit.
- **The price comes from one thin source.** That is the standard setup for a manipulation attack. Look for a widely used feed or a properly averaged one.

## Where to go next

Two calculations belong beside this list: expected fee income, in the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and the gap it has to clear, in the [impermanent loss calculator](/tools/impermanent-loss-calculator/). For the full list of ways money is lost, see [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/).

## References

1. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
2. [Concentrated Liquidity: Construction and Properties (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
3. [StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)](https://berkeley-defi.github.io/assets/material/StableSwap.pdf)
4. [Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden, Timmer, 2022)](https://arxiv.org/abs/2208.06046)
5. [Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)](https://arxiv.org/abs/1904.05234)
6. [Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)](https://arxiv.org/abs/2106.12033)
7. [Uniswap v4 Developer Documentation: Hooks Architecture](https://docs.uniswap.org/contracts/v4/concepts/hooks)
8. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
9. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper (Adams et al., 2024)"
[2]: https://uniswap.org/whitepaper-v3.pdf "Concentrated Liquidity: Construction and Properties (Adams et al., 2021)"
[3]: https://berkeley-defi.github.io/assets/material/StableSwap.pdf "StableSwap - efficient mechanism for Stablecoin liquidity (Egorov, 2019)"
[4]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing (Milionis, Moallemi, Roughgarden, Timmer, 2022)"
[5]: https://arxiv.org/abs/1904.05234 "Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability in Decentralized Exchanges (Daian et al., 2019)"
[6]: https://arxiv.org/abs/2106.12033 "Strategic Liquidity Provision in Uniswap v3 (Fan et al., 2021)"
[7]: https://docs.uniswap.org/contracts/v4/concepts/hooks "Uniswap v4 Developer Documentation: Hooks Architecture"
[8]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[9]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
