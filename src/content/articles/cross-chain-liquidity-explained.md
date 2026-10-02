---
title: "Cross-Chain Liquidity Explained: Bridges, Fragmentation and Risk"
seoTitle: "Cross-Chain Liquidity: Bridges, Fragmentation and Risk"
description: "Tokens never actually cross between chains. The four designs that make it look as if they do, how bridges have failed, and what to check before you bridge."
category: "Risk & Research"
date: 2026-09-09
lastReviewed: "2026-10-02"
author: "LiquidityPools Editorial Team"
readTime: "7 min read"
primaryQuery: "cross-chain liquidity"
keywords: "cross-chain liquidity, bridge risk, intent-based bridging, Circle CCTP, Chainlink CCIP, ERC-7683, liquidity fragmentation, LayerZero OFT, cross-chain liquidity pool, bridge liquidity risk, omnichain liquidity, intent based liquidity"
featured: false
faq:
  - q: "What is cross-chain liquidity?"
    a: "Liquidity that can serve trades originating on more than one chain, either by moving assets through a bridge or by having solvers fill on one chain against inventory held on another."
  - q: "What are the risks of bridge liquidity?"
    a: "The bridge contract and its validators or relayers become part of the trust chain, wrapped representations can lose their backing if the bridge fails, and liquidity spread across chains reduces depth everywhere."
  - q: "What is intent-based bridging?"
    a: "A model where the user states the outcome they want and a solver fronts the assets on the destination chain, then gets repaid later. It shifts the waiting time and inventory risk to the solver in exchange for a fee."
  - q: "Does bridging create new liquidity, or move it?"
    a: "It moves a claim on value; it does not add depth on the destination venue until someone supplies there. Fragmentation is what happens when the same economic exposure is spread across chains and token versions that cannot be pooled in one place."
---

Your ETH never actually travels between chains. Every bridge is a way of making it look as if it did. The differences between those methods decide whether your money is safe.

This has been one of the most expensive categories of failure in decentralised finance. Bridges account for the three largest hacks in DeFi [1]. The largest in one review of 2022 and 2023 incidents, on the Ronin bridge, lost almost \$600 million [2].

By the end you will know which design a bridge uses, why spreading liquidity across chains costs more than it seems, and what to check before you bridge or supply.

<figure class="article-figure">
  <img src="/images/guides/cross-chain-liquidity-explained.webp" alt="Separate reserve pools on islands connect through a central token bridge mechanism." width="1600" height="1067" loading="lazy" decoding="async" />
  <figcaption>Bridges connect liquidity while introducing fragmentation and dependencies. <span class="article-figure__credit">Original editorial illustration by LiquidityPools.app.</span></figcaption>
</figure>

> **Key point:**
> Supplying liquidity across chains adds risks that do not exist on one chain: settlement delay, bridge finality, and whether a solver can pay. When money is locked in a bridge escrow, one exploit can leave the wrapped version unbacked everywhere it was used. Intent designs shift much of this risk to professional solvers, who are paid a fee to carry it.

## The four ways it is done

| Approach | What you receive | How long | What breaks |
| :--- | :--- | :--- | :--- |
| Lock the real thing, mint a copy | A claim on an escrow | Minutes, depending on the bridge | The escrow gets drained, and the copy loses its backing [1] |
| Burn the real thing, mint a real one | The genuine token | Seconds to about 20 minutes [4] | The issuer's attestation service stops |
| Somebody fronts you the money | The genuine token | About 2 seconds on Across [3] | The solver lacks inventory or charges more than your limit |
| General messaging between chains | Depends on the token | Usually waits for source-chain finality [6] | The verifier network or relayer fails [6] [7] |

### Lock and mint: the large escrow

The original design. You deposit real tokens into a contract on one chain. A group of validators watches, and authorises minting a wrapped copy on the other chain [1].

The problem is structural. That escrow accumulates a great deal of value in one place, and every wrapped token everywhere depends on it staying safe. One compromised key or one logic bug, and the copies lose their backing while still sitting in pools. Ethereum's own documentation flags this systemic risk for wrapped assets [1].

### Burn and mint: no escrow at all

Circle's Cross-Chain Transfer Protocol (CCTP) removes the escrow for its own tokens such as USDC [5]. The real token is burned on one side, Circle signs an attestation that it happened, and a genuine token is minted on the other.

No pool holds collateral, so there is no escrow to drain. The cost is speed. A standard transfer waits for finality on the source chain, which Circle lists as about 15 to 19 minutes from Ethereum [4]. Its Fast Transfer option attests after about 20 seconds from Ethereum, for an onchain fee. Circle caps those transfers with a global allowance to cover the risk of a chain reorganisation [4].

### Intents: somebody fronts you the money

Here you sign a message saying what you want: here is my USDC on Ethereum, pay me USDC on Arbitrum [3].

A market maker, called a solver or relayer, reads that and immediately sends you their own money on the destination chain. Across cites fills in about 2 seconds [3]. The solver is repaid later through the protocol's settlement layer. ERC-7683 standardises how such orders are described, so that any solver network can read and fill them [8].

The point is where the risk sits. The solver carries the delay and the rebalancing problem, and charges a fee for it. You get the genuine token, fast, with no wrapped copy to worry about.

### General messaging: for everything else

Two systems matter here. Chainlink's protocol (CCIP) has independent verifiers attest to each message, and a risk-management contract can "curse" a chain or lane, which halts transfers on it until lifted [6]. LayerZero's token standard (OFT) lets a token burn or lock itself on one chain and mint or unlock on another, so one total supply spans every chain it lives on [7].

## Why spreading liquidity around costs more than it seems

This part gets less attention than bridge hacks, but it affects every trade.

On one chain, every trader hits the same reserves. Depth is unified, fees are concentrated, and price impact — how far an order pushes the rate against itself — stays low. How that unified depth comes to exist onchain is covered in [Onchain Liquidity Explained](/guides/onchain-liquidity-explained/).

Split the same money across ten chains and the arithmetic turns against you. The table assumes simple constant-product pools with the money split evenly.

| | One chain | Ten chains |
| :--- | :--- | :--- |
| Total deposited | \$10,000,000 | \$10,000,000 |
| Pool any single trade sees | \$10,000,000 | \$1,000,000 |
| Cost of a \$100,000 trade, against the screen price | about 2.0% | about 16.7% |
| Where the volume goes | Here | Wherever depth is better |

Same money, a tenth of the depth on every chain, and more than eight times the cost for a large trade. Large trades route elsewhere, so each fragment earns less. Rebalancing between chains also adds bridge costs and impermanent loss — the shortfall a pool position takes against simply holding — on top. See [Impermanent Loss Explained](/guides/impermanent-loss-explained/).

## Three risks specific to cross-chain pools

**A wrapped token in your pool is a bridge in your pool.** Suppose a pool pairs the genuine token with a bridged copy, and the bridge is exploited. Traders will sell the unbacked copies into the pool and take out the genuine tokens. You are left holding the copies [1].

**Crisis flow only goes one way.** When markets break, many people bridge in the same direction at once, usually toward somewhere they can sell. A cross-chain pool then empties on one side, and you end up holding whatever people are running from. The Financial Stability Board lists liquidity mismatches and operational fragilities among the vulnerabilities DeFi inherits from traditional finance [9].

**Rollup sequencers stop.** Some rollups run a single sequencer, the operator that orders and batches transactions [10]. When it halts, nothing settles there, but prices elsewhere keep moving. When it restarts, resting positions can be traded against at stale prices all at once. That is MEV — value taken by whoever controls transaction order. See [MEV and Liquidity Providers](/guides/mev-and-liquidity-providers/).

## What people get wrong about bridging

| What people assume | What actually happens |
| :--- | :--- |
| A fast confirmation means it is settled | A rollup's transactions become final only once its batches are final on Ethereum, which takes minutes [4] |
| Any bridge is fine for small amounts | A bridge failure does not scale with your size. The whole wrapped supply is affected at once |
| I can move funds and sort out gas later | Bridge tokens to a chain without its gas token and you cannot do anything there until you get some |

## What to check before you bridge or supply

1. **Are you receiving the genuine token?** Natively issued, or a wrapped version that depends on somebody's escrow staying solvent [1] [5]?
2. **Who verifies the transfer?** A competitive solver network, an oracle network with a way to halt transfers, or a small unaudited group of signers [3] [6]?
3. **If you are on a rollup, what is the escape route?** Can you submit a transaction or withdrawal through Ethereum itself if the operator stops [10]?
4. **Does the pool contain any wrapped assets?** If so, you are exposed to that bridge whether you meant to be or not [1].
5. **On an intent network, are your limits explicit?** Set the maximum fee and the minimum you will receive in the order, so you are not overcharged during congestion [3].

## Where to watch the numbers

- **Bridge flows and how much is locked where:** [DeFiLlama Bridges](https://defillama.com/bridges).
- **Solver fill rates and settlement times:** [Across Protocol Analytics](https://dune.com/across_protocol).
- **Whether a specific message actually delivered:** [LayerZero Scan](https://layerzeroscan.com).

## When something goes wrong

- **Your transfer is stuck pending.** The source side confirmed but the destination has not been relayed, usually because of gas or a queue. Check the bridge's explorer, and whether you can push it through manually.
- **A wrapped token is trading below the real one.** The escrow may have been exploited or paused. Stop depositing. If you hold the wrapped version, work out whether you have any redemption claim before selling into whatever depth is left.
- **Intent orders are not filling.** Volatility has widened the spread past what solvers will take. Raise your limit, or use the slower canonical route for anything that is not urgent.

## Before you supply on another chain

Split depth shows up first in what a trade costs, including slippage — the gap between the quote and the fill — covered in [Slippage and Price Impact](/guides/slippage-and-price-impact/). Model the venue you would actually use with the [liquidity pool fee and APR calculator](/tools/liquidity-pool-calculator/). Then read [Can You Lose Money in a Liquidity Pool?](/guides/can-you-lose-money-in-a-liquidity-pool/) for the loss paths bridging adds on top of ordinary pool risk.

## References

1. [Bridges (ethereum.org)](https://ethereum.org/en/developers/docs/bridges/)
2. [SoK: A Review of Cross-Chain Bridge Hacks in 2023 (Belenkov et al., 2025)](https://arxiv.org/abs/2501.03423)
3. [What are Crosschain Intents? (Across Documentation)](https://docs.across.to/guides/concepts/crosschain-intents)
4. [Finality and block confirmations (Circle Developer Documentation)](https://developers.circle.com/cctp/concepts/finality-and-block-confirmations)
5. [CCTP (Cross-Chain Transfer Protocol) (Circle)](https://www.circle.com/en/cross-chain-transfer-protocol)
6. [CCIP Architecture Overview (Chainlink Documentation)](https://docs.chain.link/ccip/concepts/architecture/overview)
7. [Omnichain Tokens (LayerZero Documentation)](https://docs.layerzero.network/v2/concepts/applications/oft-standard)
8. [ERC-7683: Cross Chain Intents (Ethereum Improvement Proposals)](https://eips.ethereum.org/EIPS/eip-7683)
9. [The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)](https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/)
10. [Optimistic Rollups (ethereum.org)](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)

[1]: https://ethereum.org/en/developers/docs/bridges/ "Bridges (ethereum.org)"
[2]: https://arxiv.org/abs/2501.03423 "SoK: A Review of Cross-Chain Bridge Hacks in 2023 (Belenkov et al., 2025)"
[3]: https://docs.across.to/guides/concepts/crosschain-intents "What are Crosschain Intents? (Across Documentation)"
[4]: https://developers.circle.com/cctp/concepts/finality-and-block-confirmations "Finality and block confirmations (Circle Developer Documentation)"
[5]: https://www.circle.com/en/cross-chain-transfer-protocol "CCTP (Cross-Chain Transfer Protocol) (Circle)"
[6]: https://docs.chain.link/ccip/concepts/architecture/overview "CCIP Architecture Overview (Chainlink Documentation)"
[7]: https://docs.layerzero.network/v2/concepts/applications/oft-standard "Omnichain Tokens (LayerZero Documentation)"
[8]: https://eips.ethereum.org/EIPS/eip-7683 "ERC-7683: Cross Chain Intents (Ethereum Improvement Proposals)"
[9]: https://www.fsb.org/2023/02/the-financial-stability-risks-of-decentralised-finance/ "The Financial Stability Risks of Decentralised Finance (Financial Stability Board, 2023)"
[10]: https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/ "Optimistic Rollups (ethereum.org)"
