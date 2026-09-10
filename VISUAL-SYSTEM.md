# LiquidityPools.app visual system

The guide library uses original mechanism-led editorial illustrations. Each image is designed to clarify a specific claim in its article—such as pool reserves, a pricing curve, an active range, rebalancing, transaction ordering, or cross-chain fragmentation—rather than serving as generic crypto decoration.

The system uses a restrained technical palette: charcoal ground, ivory structures, mint for active liquidity and flows, and amber for price movement, fees, or caution. Images contain no readable text or third-party marks. Every figure has contextual alt text and a caption in its corresponding guide.

Figures added from the keyword-expansion release onward are generated programmatically by `scripts/generate-guide-figures.py` using the same palette rendered on a dark technical ground: navy background, mint for active liquidity and earning states, amber for price and caution, and rose for idle or loss states. Each figure is a labelled diagram or plot built from the article's own numbers, exported at 1600x1067 WebP. Regenerate any figure with `python3 scripts/generate-guide-figures.py <slug>`.
