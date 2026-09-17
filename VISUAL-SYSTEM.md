# LiquidityPools.app visual system

## Interface

The interface is styled as a quiet financial reference, not a marketing page. Headlines and card titles use Newsreader (serif, weight 500, optical sizing); body and UI text use IBM Plex Sans; IBM Plex Mono is reserved for numbers, formulas and code. The palette is a deep green ink (`#0c1a13`) for the header, hero and dark sections, a warm paper (`#f6f6f1`) page, white surfaces for cards and inputs, and moss green (`#1e5b3d`) for links and primary actions on light surfaces. Mint (`#b8f7c9`) appears only on dark surfaces, for results and accents.

Trust signals are part of the layout rather than decoration: the homepage hero states the guide and calculator counts and the review policy, the strip below it links to the methodology, the public calculator code and tests, the editorial policy and the most recent review date, and every guide card shows its last review date. Internal links carry no arrow glyphs; `↗` marks only links that leave the site. All tokens live in `src/styles/global.css`.

## Illustrations


The guide library uses original mechanism-led editorial illustrations. Each image is designed to clarify a specific claim in its article—such as pool reserves, a pricing curve, an active range, rebalancing, transaction ordering, or cross-chain fragmentation—rather than serving as generic crypto decoration.

The system uses a restrained technical palette: charcoal ground, ivory structures, mint for active liquidity and flows, and amber for price movement, fees, or caution. Images contain no readable text or third-party marks. Every figure has contextual alt text and a caption in its corresponding guide.

Figures added from the keyword-expansion release onward are generated programmatically by `scripts/generate-guide-figures.py` using the same palette rendered on a dark technical ground: navy background, mint for active liquidity and earning states, amber for price and caution, and rose for idle or loss states. Each figure is a labelled diagram or plot built from the article's own numbers, exported at 1600x1067 WebP. Regenerate any figure with `python3 scripts/generate-guide-figures.py <slug>`.
