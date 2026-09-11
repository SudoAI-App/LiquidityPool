---
title: "Yield Farming Explained: Fee Income, Emissions, and Dilution"
description: "What yield farming actually pays: separating trading fee income from token emissions, pricing dilution, and testing whether a farm survives the end of its incentive programme."
category: "Advanced"
date: 2026-09-10
lastReviewed: "2026-09-10"
author: "Siddharth Mehta"
readTime: "12 min read"
keywords: "yield farming liquidity pools, yield farming explained, liquidity mining vs yield farming, farming emissions, real yield, mercenary capital"
featured: false
faq:
  - q: "What is yield farming in DeFi?"
    a: "Supplying assets to a protocol and collecting a return made up of trading fees, lending interest, or newly issued protocol tokens. In liquidity pools it usually means depositing a pair, receiving an LP claim, and staking that claim into a gauge or farm contract that pays additional token emissions."
  - q: "What is the difference between yield farming and liquidity mining?"
    a: "Liquidity mining is the narrower term for the incentive programme itself: a protocol issuing its own token to attract deposits. Yield farming is the user-side activity of moving capital between opportunities to collect whatever combination of fees and incentives is available."
  - q: "Is yield farming still profitable?"
    a: "It depends entirely on whether the yield is funded by fees or by issuance, and on what you pay in divergence and gas to collect it. Fee-funded returns persist while trading activity persists. Emission-funded returns end with the programme, and the token used to pay them is usually being sold by everyone receiving it."
  - q: "What are the main risks of yield farming?"
    a: "Divergence loss on the underlying pair, smart contract risk across every contract in the stack including the farm and any vault wrapper, emission token price decay, and the depth collapse that follows when incentives taper and mercenary capital leaves."
---

Yield farming describes moving capital toward whichever protocol is currently paying the most to attract it. The mechanics are simple; the accounting is where positions are won and lost. A farm pays from two distinct sources, and they behave nothing alike: fees collected from users, and tokens created out of nothing.

Treating those two lines as one number is the single most expensive habit in the activity.

<figure class="article-figure">
  <img src="/images/guides/yield-farming-explained.webp" alt="Flow diagram from swap flow to pool fee to LP position to emissions to realised profit and loss." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>The two revenue paths into a farmed position, and the deductions that separate quoted yield from realised result. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Siddharth Mehta:**
> *"Ask one question about any farm: if emissions stopped tomorrow, what would this position earn? If the answer is close to zero, you are not being paid for supplying liquidity, you are being paid to hold a token that is being printed. That can still be a reasonable trade, but it should be underwritten as a token position, with a token position's sizing."*

## 1. The Capital Stack of a Farmed Position

A typical farm has four layers, and each adds an exposure:

1. **The underlying pair.** Two assets deposited into a pool, subject to the pricing rule of its invariant and to divergence as relative prices move.
2. **The pool contract.** The AMM itself, plus any hook in a v4-style architecture [2].
3. **The farm or gauge contract.** Holds the staked LP claim and computes emission entitlements.
4. **Optional vault wrapper.** Auto-compounds harvests, adds a performance fee and another contract to trust.

Each layer must be solvent and correct for the position to return capital. This is why the security review of a farm is not the review of one contract but of a chain, and why the composition itself is a risk rather than a convenience. The taxonomy is developed in [Liquidity Pool Risks: A Complete Framework for LP Due Diligence](/guides/liquidity-pool-risks/).

---

## 2. Separating the Two Revenue Lines

Fee income is a claim on activity that already happened. Emission income is a claim on future token supply. The distinction shows up in every property that matters:

| Property | Fee income | Emission income |
| :--- | :--- | :--- |
| Source of funds | Traders paying the pool fee | Protocol issuance |
| Dependent on | Routed volume and your share of active liquidity | Emission schedule and total staked |
| Ends when | Trading stops | The programme ends or the vote reallocates it |
| Dilutes | Nobody | Every existing token holder |
| Realisable at quote | Yes, in pool assets | Only at whatever the order book absorbs |

The practical test is the one in the field note above: model the position with emissions set to zero. What remains is the durable part.

For the design side of incentive programmes, including vote-escrow systems and bribe markets, see [Liquidity Mining Explained: Incentives, Emissions, and Durable Market Depth](/guides/liquidity-mining-explained/).

---

## 3. Pricing Dilution Properly

Suppose a farm emits 2% of circulating supply per week to LPs in a pool. Every recipient faces the same decision, and in aggregate a large share of emissions are sold promptly. For the quoted yield to be realised, the market must absorb that supply without a matching price decline.

A workable model:

- Let $e$ be the weekly emission as a fraction of circulating supply.
- Let $\alpha$ be the fraction of recipients who sell within the week.
- The weekly selling pressure is $\alpha e$ of supply, met by whatever organic demand exists.

If organic demand does not grow at least as fast as $\alpha e$, the token price declines and the quoted yield falls with it, on a schedule that is knowable in advance from the emission curve. This is the mechanism behind the familiar pattern of a farm launching at a spectacular rate and settling at a fraction of it within weeks.

A defensible approach is to value emissions at a conservative haircut, sell on a fixed schedule rather than accumulating, and treat any retained tokens as a deliberate directional position rather than as yield.

---

## 4. What Happens When Incentives End

Incentive programmes create a specific failure mode. Capital that arrived for emissions leaves when they taper, and it leaves quickly because it was never underwriting the pair.

The sequence is consistent:

1. Emissions taper or a governance vote reallocates them.
2. Quoted yield falls below the level that justified the divergence exposure.
3. Liquidity withdraws, often within days.
4. Depth collapses, execution worsens, and routers send less volume to the pool.
5. Fee income falls for the LPs who remained, compounding the reason to leave.

The pools that survive this are the ones where fee income alone justified the position. Checking that in advance is a matter of computing fee-only yield at current volume and asking whether you would supply at that rate.

### Worked example of a taper

A pool with \$40m of liquidity attracted by a programme paying 30 points of emissions and generating 6 points of fee yield. The programme halves. Quoted yield falls from 36% to 21%, and roughly half the liquidity leaves within two weeks. Fee yield for the remaining LPs rises mechanically, because the same volume is now shared among less liquidity, but only if volume holds. In practice routed volume falls as depth thins and aggregators find better execution elsewhere, so the fee yield gain is smaller than the naive calculation suggests.

The LP who modelled fee-only yield at entry knew the floor. The LP who annualised the launch week did not, and is now deciding whether to exit into a thinner book than the one they entered through.

---

## 5. Measurement Stack

- **Yield decomposition**: [DeFiLlama](https://defillama.com/yields) separates base fee yield from reward yield for most major pools, which is the fastest way to run the emissions-to-zero test.
- **Position accounting**: [Revert Finance](https://revert.finance) reconstructs net performance against a hold benchmark, so emission income can be compared with the divergence it was supposed to compensate.
- **Emission schedules**: read the farm contract directly, or the protocol's gauge documentation, for the rate and its decay. Do not rely on an interface's current figure.
- **Flow quality**: [EigenPhi](https://eigenphi.io) shows how much of the pool's volume is arbitrage. A farm whose volume is mostly arbitrage is paying you emissions to warehouse inventory for searchers.
- **Contract review**: verify the farm and any vault on a block explorer, and simulate a full deposit, harvest and withdrawal cycle on [Tenderly](https://tenderly.co) before committing size.

---

## 6. Pre-Deposit Checklist for a Farm

- [ ] Compute fee-only yield with emissions set to zero, and decide whether you would supply at that rate.
- [ ] Read the emission schedule and its decay, and calculate weekly issuance as a share of circulating supply.
- [ ] Establish an exit rule for emitted tokens before the first harvest.
- [ ] Confirm the divergence hurdle for the pair, using the arithmetic in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/).
- [ ] Enumerate every contract in the stack and check audits, upgrade keys and timelocks for each.
- [ ] Check the lockup and withdrawal path, including whether unstaking has a delay or penalty.
- [ ] Model gas for the harvest cadence the quoted rate assumes, at your position size.
- [ ] Set a monitoring alert for governance proposals that change the gauge weight for your pool.

Farming is not a category error, and incentive programmes serve a real function in bootstrapping depth on pairs that would otherwise have none. The discipline is refusing to count issuance as income without pricing what issuing it costs.

## Where to Go Next

Separate the durable part of any farm's yield using the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/), and read the protocol-side design in [Liquidity Mining Explained](/guides/liquidity-mining-explained/). A protocol-specific example of the same incentive structure is in [PancakeSwap Liquidity Pools](/guides/pancakeswap-liquidity-pools/). For the side-by-side split of who funds each activity, see [Liquidity Mining vs Yield Farming vs Staking](/guides/liquidity-mining-vs-yield-farming/), and for whether the underlying position clears its costs at all, [Is Providing Liquidity Profitable?](/guides/is-providing-liquidity-profitable/).

## References

1. [Uniswap v3 Core Whitepaper (Adams et al., 2021)](https://uniswap.org/whitepaper-v3.pdf)
2. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
3. [Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)](https://www.bis.org/publ/bisbull58.htm)
4. [DeFiLlama Yields methodology](https://defillama.com/yields)
5. [SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)](https://arxiv.org/abs/2105.13891)
6. [Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)](https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf)
7. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)

[1]: https://uniswap.org/whitepaper-v3.pdf "Uniswap v3 Core Whitepaper"
[2]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[3]: https://www.bis.org/publ/bisbull58.htm "Trading in the DeFi era: automated market maker (BIS Bulletin No 58, 2022)"
[4]: https://defillama.com/yields "DeFiLlama Yields"
[5]: https://arxiv.org/abs/2105.13891 "SoK: Yield Aggregators in DeFi (Cousaert et al., 2021)"
[6]: https://www.oecd.org/daf/fin/financial-markets/Why-Decentralised-Finance-DeFi-Matters-and-the-Policy-Implications.pdf "Why Decentralised Finance (DeFi) Matters and the Policy Implications (OECD, 2022)"
[7]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
