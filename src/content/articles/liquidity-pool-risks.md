---
title: "Liquidity Pool Risks: A Complete Framework for LP Due Diligence"
description: "Five layers of risk in a liquidity pool: the code, the traders, the collateral behind the tokens, the price feeds, and the people who can change the rules."
category: "Risk & Research"
date: 2026-08-28
lastReviewed: "2026-09-12"
author: "Dr. Kieran Thorne"
readTime: "8 min read"
keywords: "liquidity pool risks, DeFi risk management, Uniswap v4 hook security, restaking contagion, oracle manipulation, LVR, smart contract vulnerabilities, risks of providing liquidity, liquidity provider risks, can you lose money in a liquidity pool, smart contract risk liquidity pool, liquidity risk DeFi, liquidity pool withdrawal risk"
featured: false
faq:
  - q: "What are the main risks of a liquidity pool?"
    a: "Directional exposure to both assets, divergence against holding, contract and hook failure, depeg or collapse of one asset, out-of-range idleness in concentrated positions, and friction costs. Only two of those are specific to automated market making."
  - q: "How to check if a liquidity pool is safe?"
    a: "Verify the contracts and their audits, check for upgradeable proxies and admin keys, read hook permissions on newer pools, confirm liquidity is locked or burned for new tokens, and test the withdrawal path before committing size."
  - q: "What is a rug pull in a liquidity pool?"
    a: "A deployer removing pooled liquidity or exploiting privileged token functions, leaving holders unable to sell at a meaningful price. Verifiable locked or burned liquidity, and the absence of privileged mint and blacklist functions, are the standard checks."
  - q: "Can liquidity pools lose money?"
    a: "Yes, through six distinct routes: both assets falling, divergence against holding, time out of range, contract or hook failure, a depeg that fills the pool with the failing asset, and friction costs. Only two of those are specific to automated market making."
  - q: "What happens if one token goes to zero in a pool?"
    a: "The invariant keeps buying it as it falls, so the pool ends up holding almost entirely the worthless asset. The position approaches a total loss even though no contract failed, which is why the credibility of both assets matters more than the fee tier."
  - q: "What is liquidity risk in DeFi?"
    a: "Liquidity risk in DeFi is the risk that a position cannot be exited at a reasonable price when you need to. It shows up as thin active depth, as fragmentation across venues, as utilisation gating withdrawals in lending markets, and as depth that disappears precisely during the volatility that makes you want to leave."
---

Every extra point of yield a pool advertises is payment for a risk somebody decided to take. Usually you. The question is never whether the yield is high. It is what you are being paid to underwrite.

Most people check one thing: how much the two tokens might move. That is real, and it is only part of one of five separate problems.

This guide walks through all five in the order they actually break: the code, the traders on the other side, the collateral behind the tokens, the price feeds, and the people who can change the rules after you deposit.

<figure class="article-figure">
  <img src="/images/guides/liquidity-pool-risks.webp" alt="A central liquidity pool is exposed to separate asset, contract, depth, and incentive risk paths." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Five separate ways a pool can hurt you: the code, the traders, the collateral, the price feeds and the rules. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Desk Field Note from Dr. Kieran Thorne:**
> *"People fixate on price moves and ignore the rest, which is backwards. Price you can model. A reentrancy bug, a manipulated price feed, or a token that quietly changes your balance when it transfers can empty a pool in one block, and it does not care which way the market was going."*

## The five layers, at a glance

| Layer | What can go wrong | How fast it happens |
| :--- | :--- | :--- |
| The code | A bug, a hook, or an admin key drains or freezes the pool | One block |
| The traders | Faster traders take more than the fees pay you | Continuously, quietly |
| The collateral | A token turns out to be backed by something that broke | Hours to days |
| The price feeds | A manipulated price lets someone borrow against nothing | One block |
| The rules | Governance or a compliance control changes your terms | Days, sometimes with no notice |

## Layer one: the code that holds your money

The core engines behind Uniswap v2 and v3 have settled enormous volume without a break [1] [3]. The new risk is not in those. It is in what gets bolted onto them.

Uniswap v4 lets any pool attach custom code, called a hook, that can run at ten points in a pool's life, such as before and after every swap [4]. That code is not written by Uniswap. It is written by whoever launched the pool.

Three specific things to check before you deposit behind one:

- **Can it be changed after launch?** Many hooks sit behind an upgradeable proxy. Whoever holds that key can alter fees, redirect proceeds, or block withdrawals, without asking you.
- **Does it depend on another contract?** A hook that calls an outside contract, such as a price feed, fails when that contract fails. If it fails during a swap or a withdrawal, the pool can freeze, including your exit [4].
- **Has anyone actually audited it?** The core protocol's audits do not cover somebody else's hook.

There is a second, quieter issue. v4 tracks balances in scratch memory during a transaction and settles once at the end, a technique called flash accounting — bookkeeping first, token transfers afterwards [4]. It is a real efficiency gain. It also means any integrator that fails to check the books balance before finishing can leave a hole.

## Layer two: who is on the other side of your trades

You are not quoting to a friendly crowd. You are quoting to everyone, including bots whose entire business is beating your pool to a price change [5] [6].

Your pool only updates when a trade lands. Real exchanges update continuously. So there is always a window where your price is wrong and somebody can profit from it.

The sequence never varies:

1. A price moves on a fast exchange.
2. A bot sees your pool still quoting the old number.
3. It trades against you, taking the good side, until the gap closes.

The name for this cost is loss-versus-rebalancing, or LVR — the money your pool hands over purely because it updates late [5]. It grows with the square of how much the pair moves, and it accrues whether or not the price ends up back where it started. That makes it a better planning number than impermanent loss — the simpler gap between a pool position and simply holding — which depends on where the price happens to finish.

A pair moving 80% a year costs a full-range position roughly 8% a year before any fees. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

There is a sharper version in range-based pools. When a large trade is about to land, a bot floods the exact price step with liquidity, takes almost the whole fee, and pulls out in the same block [6]. You carried the risk all week. They took the payday. That is MEV — value captured by controlling the order transactions run in. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## Layer three: what the tokens are actually backed by

A token that says ETH on the label may be several steps away from ETH [7].

Deposit ETH with a staking service and you get a receipt token. Stake that receipt somewhere else and you get another receipt. Put that second receipt in a pool, and you are underwriting every link in the chain.

Three ways that chain breaks:

- **A penalty upstream.** If validators behind the token get penalised, the token is instantly worth less than it says on the tin.
- **The exit queue is slow.** Minting is instant. Redeeming often takes days or weeks. In a panic, nobody waits, so they dump into your pool instead [7].
- **The pool runs dry.** Selling pressure drains the healthy side first. Once the pool tips past its comfortable zone, the price falls away and you are left holding almost all of the broken token [7].

See [TVL Explained](/guides/tvl-explained/) for how those layers make headline numbers look bigger than they are.

## Layer four: the price feeds nobody looks at

Contracts cannot see prices on their own, so they read them from somewhere [2]. That creates loops worth understanding.

If a lending market values collateral using a pool's own price, somebody can borrow a huge amount temporarily, shove the pool's price up, borrow against the inflated value, and walk away [2] [8]. The lender is left insolvent and the pool badly lopsided.

Averaging over time helps, and it is not a cure. A thin pool's average can be pushed across several blocks in a row [8].

Pegged pools have their own version. Pairs like a staked-ETH token against ETH rely on a small contract that reports how much staking yield has accrued. If that contract returns a stale or wrong number, the pool prices the pair incorrectly and can be emptied in one block.

## Layer five: who can change the rules

- **Tokens with a freeze function.** Most large stablecoins can freeze an address. If an address connected to the pool gets frozen, balances can become stuck.
- **Governance votes.** Where holders vote on pool settings, they can change the curve's parameters, redirect fees, or cut off rewards, sometimes at short notice [3].
- **Compliance controls.** Some newer pools require an on-chain attestation before you can trade or deposit. Lose the attestation and you lose access.

## What people get wrong about pool risk

| What people assume | What actually happens |
| :--- | :--- |
| The protocol is audited, so the pool is safe | The audit covers the core engine. The hook attached to your pool is somebody else's code entirely |
| A staked-ETH token is basically ETH | It is a claim with a queue attached. In a rush, the queue is the whole story |
| Last month's yield tells me what I will earn | Compare the yield to the bleed, not to zero. A 40% yield on a pair moving 100% a year still loses money |
| Any price feed is as good as another | A single custom feed on a thin pool is the standard setup for an exploit |

## What to check before you deposit

1. **Read the hook, not just the protocol.** Can it change fees, take a cut, or stop withdrawals? Is there a key, and who holds it [4]?
2. **Trace each token to what backs it.** Real reserves, a hedged position, or a stack of receipts? Is there an orderly way to redeem [7]?
3. **Compare the yield to the bleed.** Annual volatility squared, divided by eight, is roughly what the pool costs you. If the fee yield does not clear it, no reward programme fixes that [5].
4. **Find out where the prices come from.** A well-known multi-source feed, or something written for this pool alone?
5. **Test the exit before you need it.** Put a small amount in and take it out. Confirm the path works and note what it costs.

See [How to Evaluate a Liquidity Pool](/guides/how-to-evaluate-a-liquidity-pool/) and the [Liquidity Pool Research Checklist](/guides/liquidity-pool-research-checklist/) for the long-form versions.

## Where to watch the numbers

- **Exploit alerts as they happen:** [CertiK Alert](https://alert.certik.com) and [Blocksec Phalcon](https://phalcon.blocksec.com).
- **Pulling apart a strange transaction:** [Tenderly](https://tenderly.co).
- **Checking a pool's real balances against its books:** [Dune Analytics](https://dune.com).

## When something goes wrong

- **A huge borrowed position moved through the pool in one block.** Somebody used a flash loan to push the price, usually to exploit a contract that reads it. If the pool guards itself properly, it survives. Check what else was reading that price.
- **The balances moved without a matching trade.** One of the tokens rebases or takes a cut on transfer, so the pool's books drifted from reality. Call the pool's sync function to realign them.
- **Governance has paused the protocol.** Something was found or exploited nearby. Follow the official channel, and have your withdrawal ready the moment it reopens.

## Where to go next

For a plain list of the ways money is actually lost, see [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/). The trader-driven part is isolated in [Loss-Versus-Rebalancing](/guides/loss-versus-rebalancing/), the income side in [LP Fees vs Impermanent Loss](/guides/lp-fees-vs-impermanent-loss/). Security checks are in [Rug Pulls and Locked Liquidity](/guides/liquidity-pool-rug-pulls/), and the costs that quietly eat small positions in [Gas Costs for Liquidity Providers](/guides/lp-gas-costs/).

## References

1. [Concentrated Liquidity (Uniswap Developer Documentation)](https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity)
2. [Ethereum Foundation: Oracles and Data Feeds](https://ethereum.org/en/developers/docs/oracles/)
3. [StableSwap pools (Curve Documentation)](https://docs.curve.finance/developer/amm/legacy/stableswap-overview)
4. [Uniswap v4 Core Whitepaper (Adams et al., 2024)](https://uniswap.org/whitepaper-v4.pdf)
5. [Automated Market Making and Loss-Versus-Rebalancing (Milionis et al., 2022)](https://arxiv.org/abs/2208.06046)
6. [Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)](https://blog.uniswap.org/jit-liquidity)
7. [Cryptocurrencies and Decentralised Finance (BIS Working Paper 1061)](https://www.bis.org/publ/work1061.htm)
8. [Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit (Qin et al., 2021)](https://arxiv.org/abs/2003.03810)
9. [SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)](https://arxiv.org/abs/2208.13035)
10. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
11. [Global Financial Stability Report, April 2022 (International Monetary Fund)](https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022)

[1]: https://developers.uniswap.org/docs/get-started/concepts/liquidity-providers/concentrated-liquidity "Concentrated Liquidity (Uniswap Developer Documentation)"
[2]: https://ethereum.org/en/developers/docs/oracles/ "Ethereum Foundation: Oracles and Data Feeds"
[3]: https://docs.curve.finance/developer/amm/legacy/stableswap-overview "StableSwap pools (Curve Documentation)"
[4]: https://uniswap.org/whitepaper-v4.pdf "Uniswap v4 Core Whitepaper"
[5]: https://arxiv.org/abs/2208.06046 "Automated Market Making and Loss-Versus-Rebalancing"
[6]: https://blog.uniswap.org/jit-liquidity "Just-In-Time Liquidity on the Uniswap Protocol (Wan & Adams, Uniswap Labs, 2022)"
[7]: https://www.bis.org/publ/work1061.htm "Cryptocurrencies and Decentralised Finance"
[8]: https://arxiv.org/abs/2003.03810 "Attacking the DeFi Ecosystem with Flash Loans for Fun and Profit (Qin et al., 2021)"
[9]: https://arxiv.org/abs/2208.13035 "SoK: Decentralized Finance (DeFi) Attacks (Zhou et al., 2022)"
[10]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[11]: https://www.imf.org/en/Publications/GFSR/Issues/2022/04/19/global-financial-stability-report-april-2022 "Global Financial Stability Report, April 2022 (International Monetary Fund)"
