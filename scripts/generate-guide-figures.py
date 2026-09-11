#!/usr/bin/env python3
"""Render the original editorial diagrams that accompany each guide.

Every figure is drawn programmatically so the artwork stays reproducible, stays
consistent with the house palette, and never depends on generic stock imagery.

Usage:
    python3 scripts/generate-guide-figures.py [slug ...]

Output: public/images/guides/<slug>.webp at 1600x1067 (3:2).
"""

from __future__ import annotations

import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 1067
BG = (10, 15, 29)
PANEL = (16, 24, 43)
PANEL_ALT = (20, 30, 52)
GRID = (26, 38, 64)
LINE = (38, 54, 86)
MINT = (52, 211, 153)
MINT_DIM = (16, 185, 129)
AMBER = (251, 191, 36)
AMBER_DIM = (245, 158, 11)
INK = (233, 240, 236)
MUTED = (138, 158, 178)
ROSE = (244, 114, 132)

# DejaVu ships at a fixed path on Debian-family CI images and nowhere on macOS.
# GUIDE_FIGURE_FONT_DIR lets a local checkout point at its own copy.
FONT_DIR = next(
    (d for d in (
        os.environ.get("GUIDE_FIGURE_FONT_DIR"),
        "/usr/share/fonts/truetype/dejavu",
        "/usr/local/share/fonts/dejavu",
    ) if d and os.path.isdir(d)),
    "/usr/share/fonts/truetype/dejavu",
)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public/images/guides")


def font(size: int, weight: str = "book") -> ImageFont.FreeTypeFont:
    name = {
        "book": "DejaVuSans.ttf",
        "bold": "DejaVuSans-Bold.ttf",
        "mono": "DejaVuSansMono.ttf",
        "mono-bold": "DejaVuSansMono-Bold.ttf",
    }[weight]
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=GRID, width=1)
    d.rectangle([0, 0, W - 1, H - 1], outline=LINE, width=2)
    return img, d


def chrome(d: ImageDraw.ImageDraw, eyebrow: str, title: str, subtitle: str) -> None:
    d.rectangle([64, 62, 70, 96], fill=MINT)
    d.text((88, 62), eyebrow.upper(), font=font(20, "mono-bold"), fill=MINT)
    d.text((88, 96), title, font=font(42, "bold"), fill=INK)
    d.text((88, 152), subtitle, font=font(23), fill=MUTED)
    d.line([(64, H - 78), (W - 64, H - 78)], fill=LINE, width=1)
    d.text((64, H - 62), "LIQUIDITYPOOLS.APP  ·  ORIGINAL EDITORIAL ILLUSTRATION",
           font=font(17, "mono"), fill=(96, 116, 138))


def panel(d, box, fill=PANEL, outline=LINE, width=2, radius=10):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrap(text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if f.getlength(trial) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def paragraph(d, xy, text, f, fill, max_w, leading=None):
    x, y = xy
    leading = leading or int(f.size * 1.42)
    for line in wrap(text, f, max_w):
        d.text((x, y), line, font=f, fill=fill)
        y += leading
    return y


def arrow(d, start, end, color=MINT, width=3, head=13):
    d.line([start, end], fill=color, width=width)
    ang = math.atan2(end[1] - start[1], end[0] - start[0])
    d.polygon([
        end,
        (end[0] - head * math.cos(ang - 0.42), end[1] - head * math.sin(ang - 0.42)),
        (end[0] - head * math.cos(ang + 0.42), end[1] - head * math.sin(ang + 0.42)),
    ], fill=color)


def legend(d, x, y, items):
    for label, color in items:
        d.rectangle([x, y + 6, x + 22, y + 20], fill=color)
        d.text((x + 34, y), label, font=font(19, "mono"), fill=MUTED)
        x += 34 + int(font(19, "mono").getlength(label)) + 46


# ----------------------------------------------------------------------------
# Layout primitives
# ----------------------------------------------------------------------------

def plot_frame(d, box, xlabel, ylabel):
    x0, y0, x1, y1 = box
    panel(d, box, fill=PANEL_ALT, outline=LINE)
    for i in range(1, 6):
        gy = y0 + (y1 - y0) * i / 6
        d.line([(x0 + 1, gy), (x1 - 1, gy)], fill=GRID, width=1)
    for i in range(1, 8):
        gx = x0 + (x1 - x0) * i / 8
        d.line([(gx, y0 + 1), (gx, y1 - 1)], fill=GRID, width=1)
    d.text((x1 - font(19, "mono").getlength(xlabel), y0 - 30), xlabel,
           font=font(19, "mono"), fill=MUTED)
    d.text((x0, y0 - 30), ylabel, font=font(19, "mono"), fill=MUTED)


def ticks(d, box, domain, rng, xlabels, ylabels):
    x0, y0, x1, y1 = box
    f = font(18, "mono")
    for i, label in enumerate(xlabels):
        gx = x0 + (x1 - x0) * i / (len(xlabels) - 1)
        d.text((min(gx, x1 - 40) - f.getlength(label) / 2, y1 + 12), label, font=f, fill=MUTED)
    for value, label in ylabels:
        gy = y1 - (y1 - y0) * (value - rng[0]) / (rng[1] - rng[0])
        d.text((x0 - 12 - f.getlength(label), gy - 11), label, font=f, fill=MUTED)


def draw_curve(d, box, fn, domain, rng, color, width=4, dash=False):
    x0, y0, x1, y1 = box
    dx0, dx1 = domain
    ry0, ry1 = rng
    pts = []
    steps = 260
    for i in range(steps + 1):
        vx = dx0 + (dx1 - dx0) * i / steps
        vy = fn(vx)
        px = x0 + (x1 - x0) * (vx - dx0) / (dx1 - dx0)
        py = y1 - (y1 - y0) * (vy - ry0) / (ry1 - ry0)
        py = max(y0 + 2, min(y1 - 2, py))
        pts.append((px, py))
    if dash:
        for i in range(0, len(pts) - 1, 8):
            d.line(pts[i:i + 5], fill=color, width=width)
    else:
        d.line(pts, fill=color, width=width, joint="curve")
    return pts


def label_box(d, xy, lines, color=MINT, pad=12, fsize=19):
    f = font(fsize, "mono")
    w = max(f.getlength(line) for line in lines) + pad * 2
    h = len(lines) * int(fsize * 1.5) + pad * 2
    x, y = xy
    d.rounded_rectangle([x, y, x + w, y + h], radius=6, fill=(12, 20, 36, 235), outline=color, width=2)
    for i, line in enumerate(lines):
        d.text((x + pad, y + pad + i * int(fsize * 1.5)), line, font=f, fill=INK if i else color)
    return x + w, y + h


# ----------------------------------------------------------------------------
# Data-driven layouts
# ----------------------------------------------------------------------------

def layout_rows(d, eyebrow, title, sub, columns, rows, note, label_w=380):
    """columns: list of (heading, colour). rows: list of (label, value_per_column...)."""
    chrome(d, eyebrow, title, sub)
    top = 244
    n = len(columns)
    col_w = (1400 - label_w - 40) // n
    for i, (heading, colour) in enumerate(columns):
        d.text((140 + label_w + i * col_w, top), heading.upper(), font=font(23, "mono-bold"), fill=colour)
    y = top + 42
    height = min(104, int((780 - y) / max(1, len(rows))))
    for idx, row in enumerate(rows):
        panel(d, (100, y, 1500, y + height - 8), fill=PANEL if idx % 2 else PANEL_ALT)
        paragraph(d, (124, y + 18), row[0], font(21, "bold"), INK, label_w - 40, 26)
        for i, value in enumerate(row[1:]):
            colour = columns[i][1] if i else MUTED
            paragraph(d, (140 + label_w + i * col_w, y + 18), value, font(19, "mono"), colour, col_w - 30, 25)
        y += height
    paragraph(d, (100, y + 22), note, font(22), MUTED, 1400)


def layout_cards(d, eyebrow, title, sub, items, note, cols=3):
    """items: list of (heading, body, colour)."""
    chrome(d, eyebrow, title, sub)
    rows = (len(items) + cols - 1) // cols
    card_w = (1400 - (cols - 1) * 40) // cols
    card_h = min(268, int((790 - 250) / rows) - 18)
    for i, (heading, body, colour) in enumerate(items):
        bx = 100 + (i % cols) * (card_w + 40)
        by = 250 + (i // cols) * (card_h + 30)
        panel(d, (bx, by, bx + card_w, by + card_h), fill=PANEL_ALT)
        d.rectangle([bx, by, bx + card_w, by + 7], fill=colour)
        d.text((bx + 24, by + 30), f"{i + 1:02d}", font=font(28, "mono-bold"), fill=colour)
        yy = paragraph(d, (bx + 24, by + 76), heading, font(22, "mono-bold"), INK, card_w - 48, 28)
        paragraph(d, (bx + 24, yy + 12), body, font(20), MUTED, card_w - 48, 28)
    paragraph(d, (100, 250 + rows * (card_h + 30) + 16), note, font(22), MUTED, 1400)


def layout_bars(d, eyebrow, title, sub, bars, note, axis_label=""):
    """bars: list of (label, sub_label, fraction, value_text, colour)."""
    chrome(d, eyebrow, title, sub)
    y = 262
    height = min(140, int((800 - y) / max(1, len(bars))))
    if axis_label:
        d.text((760, y - 30), axis_label.upper(), font=font(18, "mono"), fill=MUTED)
    for label, sub_label, frac, value_text, colour in bars:
        panel(d, (100, y, 1500, y + height - 16), fill=PANEL_ALT)
        d.text((132, y + 22), label, font=font(30, "mono-bold"), fill=colour)
        d.text((132, y + 66), sub_label, font=font(20), fill=MUTED)
        d.rectangle([620, y + 34, 1420, y + 68], fill=PANEL, outline=LINE, width=1)
        d.rectangle([620, y + 34, 620 + int(800 * max(0.02, min(1.0, frac))), y + 68], fill=colour)
        d.text((632 + int(800 * max(0.02, min(1.0, frac))), y + 38), value_text, font=font(21, "mono-bold"), fill=colour)
        y += height
    paragraph(d, (100, y + 14), note, font(22), MUTED, 1400)


def layout_steps(d, eyebrow, title, sub, steps, note):
    """steps: list of (heading, body, colour)."""
    chrome(d, eyebrow, title, sub)
    n = len(steps)
    gap = 58
    w = (1400 - (n - 1) * gap) // n
    for i, (heading, body, colour) in enumerate(steps):
        x = 100 + i * (w + gap)
        panel(d, (x, 300, x + w, 590), fill=PANEL_ALT, outline=colour if colour is not INK else LINE)
        d.text((x + 22, 326), f"{i + 1:02d}", font=font(24, "mono-bold"), fill=colour)
        yy = paragraph(d, (x + 22, 366), heading, font(21, "mono-bold"), INK, w - 44, 27)
        paragraph(d, (x + 22, yy + 10), body, font(19), MUTED, w - 44, 26)
        if i < n - 1:
            arrow(d, (x + w + 10, 445), (x + w + gap - 12, 445), MINT)
    paragraph(d, (100, 650), note, font(23), MUTED, 1400)


def layout_ledger(d, eyebrow, title, sub, left, right, note):
    """left/right: (heading, colour, [(label, value)])."""
    chrome(d, eyebrow, title, sub)
    for idx, (heading, colour, rows) in enumerate((left, right)):
        x = 100 + idx * 720
        panel(d, (x, 260, x + 680, 800), fill=PANEL_ALT)
        d.rectangle([x, 260, x + 680, 268], fill=colour)
        d.text((x + 28, 296), heading.upper(), font=font(24, "mono-bold"), fill=colour)
        y = 356
        for label, value in rows:
            d.text((x + 28, y), label.upper(), font=font(18, "mono"), fill=MUTED)
            yy = paragraph(d, (x + 28, y + 26), value, font(21), INK, 620, 28)
            d.line([(x + 28, yy + 10), (x + 652, yy + 10)], fill=GRID, width=1)
            y = yy + 30
    paragraph(d, (100, 840), note, font(22), MUTED, 1400)


def layout_curve(d, eyebrow, title, sub, xlabel, ylabel, domain, rng, series, note,
                 xticks=None, yticks=None, annotation=None, box=(100, 280, 1500, 740)):
    """series: list of (fn, colour, label, dashed)."""
    chrome(d, eyebrow, title, sub)
    plot_frame(d, box, xlabel, ylabel)
    for fn, colour, _label, dashed in series:
        draw_curve(d, box, fn, domain, rng, colour, 5, dashed)
    if xticks and yticks:
        ticks(d, box, domain, rng, xticks, yticks)
    if annotation:
        label_box(d, annotation[0], annotation[1], color=annotation[2] if len(annotation) > 2 else AMBER)
    legend(d, 100, box[3] + 46, [(label, colour) for _fn, colour, label, _dash in series])
    paragraph(d, (100, box[3] + 100), note, font(22), MUTED, 1400)


# ----------------------------------------------------------------------------
# Figure builders
# ----------------------------------------------------------------------------

def fig_out_of_range(d):
    chrome(d, "position mechanics", "When price leaves the range, fee accrual stops",
           "A concentrated position is only quoted while spot price sits inside [Pa, Pb].")
    box = (100, 250, 1500, 760)
    plot_frame(d, box, "SPOT PRICE (USDC per ETH)", "ACTIVE LIQUIDITY / FEE ACCRUAL")
    x0, y0, x1, y1 = box
    lo, hi = 2400, 2700
    dom = (2000, 3200)

    def px(v):
        return x0 + (x1 - x0) * (v - dom[0]) / (dom[1] - dom[0])

    d.rectangle([px(lo), y0 + 2, px(hi), y1 - 2], fill=(16, 185, 129, 46))
    d.line([(px(lo), y0), (px(lo), y1)], fill=MINT, width=3)
    d.line([(px(hi), y0), (px(hi), y1)], fill=MINT, width=3)
    d.line([(x0 + 4, y1 - 60), (px(lo), y1 - 60)], fill=ROSE, width=5)
    d.line([(px(lo), y0 + 70), (px(hi), y0 + 70)], fill=MINT, width=6)
    d.line([(px(hi), y1 - 60), (x1 - 4, y1 - 60)], fill=ROSE, width=5)
    d.line([(px(2560), y0), (px(2560), y1)], fill=AMBER, width=3)
    d.text((px(2560) + 12, y0 + 16), "SPOT", font=font(19, "mono-bold"), fill=AMBER)

    label_box(d, (px(lo) + 24, y0 + 110), ["IN RANGE", "100% of quoted depth", "fees accrue per swap"])
    label_box(d, (x0 + 26, y1 - 190), ["BELOW Pa = 2,400", "position is 100% ETH", "fee accrual = 0"], color=ROSE)
    label_box(d, (px(hi) + 26, y1 - 190), ["ABOVE Pb = 2,700", "position is 100% USDC", "fee accrual = 0"], color=ROSE)
    legend(d, 100, 820, [("Earning fees", MINT), ("Idle inventory", ROSE), ("Current spot", AMBER)])
    paragraph(d, (100, 880),
              "Out-of-range capital keeps full price exposure to the asset it converted into, while its share of "
              "fee growth stops at the tick where the price left the interval. Re-entry requires the market to "
              "return, or the LP to pay gas and re-mint around the new price.",
              font(22), MUTED, 1400)


def fig_v3_vs_v4(d):
    chrome(d, "protocol architecture", "Uniswap v3 and v4 price liquidity the same way",
           "The invariant is unchanged; settlement, deployment cost and fee logic are not.")
    rows = [
        ("Pool deployment", "One contract per pool (factory clone)", "One singleton PoolManager, pools are state"),
        ("Multi-hop settlement", "ERC-20 transfer at every hop", "Net deltas in transient storage (EIP-1153)"),
        ("Fee schedule", "Fixed tier: 1 / 5 / 30 / 100 bps", "Fixed tier or hook-set dynamic fee"),
        ("Extensibility", "Periphery contracts only", "beforeSwap / afterSwap / liquidity hooks"),
        ("LP accounting", "ERC-721 position NFT", "ERC-6909 claims or NFT via periphery"),
        ("LP price risk", "Concentrated range, IL and LVR", "Identical: same x·y=k range math"),
    ]
    top = 250
    d.text((140, top), "UNISWAP v3", font=font(26, "mono-bold"), fill=MUTED)
    d.text((700, top), "UNISWAP v4", font=font(26, "mono-bold"), fill=MINT)
    y = top + 44
    for label, v3, v4 in rows:
        panel(d, (100, y, 1500, y + 92), fill=PANEL if (y // 92) % 2 else PANEL_ALT)
        d.text((124, y + 20), label, font=font(21, "bold"), fill=INK)
        d.text((124, y + 52), "", font=font(19), fill=MUTED)
        paragraph(d, (500, y + 30), v3, font(20, "mono"), MUTED, 380, 26)
        paragraph(d, (940, y + 30), v4, font(20, "mono"), MINT if "Identical" not in v4 else AMBER, 520, 26)
        y += 100
    paragraph(d, (100, y + 16),
              "Migration changes gas, composability and fee governance. It does not change the exposure an LP "
              "underwrites: the same range, the same divergence, the same adverse selection.",
              font(22), MUTED, 1400)


def fig_il_formula(d):
    chrome(d, "quantifying divergence", "Impermanent loss is a function of the price ratio alone",
           "IL(k) = 2·sqrt(k)/(1+k) − 1, where k is the price of asset X relative to entry.")
    box = (100, 280, 900, 760)
    plot_frame(d, box, "PRICE RATIO k", "IL vs. HODL")

    def il(k):
        return (2 * math.sqrt(k) / (1 + k) - 1) * 100

    draw_curve(d, box, il, (0.2, 5.0), (-26, 2), AMBER, 5)
    x0, y0, x1, y1 = box
    zero_y = y1 - (y1 - y0) * (0 - (-26)) / (2 - (-26))
    d.line([(x0 + 2, zero_y), (x1 - 2, zero_y)], fill=LINE, width=2)
    for k, note in [(1.25, "1.25x  −0.6%"), (2.0, "2x  −5.7%"), (4.0, "4x  −20.0%")]:
        pxx = x0 + (x1 - x0) * (k - 0.2) / (5.0 - 0.2)
        pyy = y1 - (y1 - y0) * (il(k) - (-26)) / (2 - (-26))
        d.ellipse([pxx - 7, pyy - 7, pxx + 7, pyy + 7], fill=MINT)
        nf = font(19, "mono-bold")
        d.text((pxx - nf.getlength(note) - 22, pyy + 16), note, font=nf, fill=MINT)
    panel(d, (940, 280, 1500, 760))
    d.text((972, 312), "WORKED EXAMPLE", font=font(22, "mono-bold"), fill=MINT)
    lines = [
        ("Deposit", "1 ETH + 2,000 USDC"),
        ("Entry price", "2,000 USDC / ETH"),
        ("Exit price", "4,000 USDC / ETH  (k = 2)"),
        ("Pool value", "$5,657"),
        ("HODL value", "$6,000"),
        ("Divergence", "−$343  =  −5.72%"),
        ("Fees needed", "> $343 to break even"),
    ]
    y = 366
    for k, v in lines:
        d.text((972, y), k, font=font(21), fill=MUTED)
        d.text((1200, y), v, font=font(21, "mono-bold"), fill=INK if "Divergence" not in k else AMBER)
        d.line([(972, y + 38), (1468, y + 38)], fill=GRID, width=1)
        y += 56
    paragraph(d, (100, 820),
              "The curve is symmetric in log price: a halving and a doubling produce the same 5.72% shortfall "
              "against holding. Fee income, incentives and the cost of exit determine whether that shortfall is "
              "ever realised as a loss.",
              font(22), MUTED, 1400)


def fig_fees_vs_il(d):
    chrome(d, "net lp outcome", "Fee income has to clear divergence before it is profit",
           "Daily fee capture versus LVR drag for a 5 bps ETH/USDC range position.")
    box = (100, 270, 1500, 720)
    plot_frame(d, box, "REALISED VOLATILITY σ (ANNUALISED)", "DAILY BASIS POINTS ON DEPLOYED CAPITAL")
    x0, y0, x1, y1 = box
    dom, rng = (0.1, 2.0), (0, 16)

    def fees(v):
        return 1.5 + 3.2 * v

    def lvr(v):
        return (v * v / 8) / 365 * 10000

    draw_curve(d, box, fees, dom, rng, MINT, 5)
    draw_curve(d, box, lvr, dom, rng, ROSE, 5)
    ticks(d, box, dom, rng, [f"{int(v * 100)}%" for v in (0.1, 0.6, 1.1, 1.6, 2.0)],
          [(v, f"{v}") for v in (0, 4, 8, 12, 16)])
    cross = next(v / 100 for v in range(10, 200) if lvr(v / 100) >= fees(v / 100))
    cx = x0 + (x1 - x0) * (cross - dom[0]) / (dom[1] - dom[0])
    d.line([(cx, y0), (cx, y1)], fill=AMBER, width=3)
    label_box(d, (cx - 400, y0 + 46), [f"BREAK-EVEN σ ≈ {cross * 100:.0f}%", "beyond this, arbitrage",
                                       "outruns fee capture"], color=AMBER)
    legend(d, 100, 760, [("Gross fee capture", MINT), ("Divergence / LVR", ROSE), ("Break-even volatility", AMBER)])
    paragraph(d, (100, 820),
              "Fee revenue scales roughly with volume, which grows slower than volatility; adverse selection "
              "scales with variance. The profitable region is bounded, pair-specific, and must be measured on "
              "realised data rather than an advertised annual percentage rate.",
              font(22), MUTED, 1400)


def fig_apr_apy(d):
    chrome(d, "yield arithmetic", "APR is a rate. APY is a rate plus an assumption",
           "APY = (1 + APR/n)^n − 1 only holds if fees are actually harvested and redeposited n times.")
    panel(d, (100, 260, 780, 700))
    d.text((132, 292), "SAME 20% APR, DIFFERENT COMPOUNDING", font=font(22, "mono-bold"), fill=MINT)
    rows = [("Never compounded", "20.00%"), ("Quarterly (n=4)", "21.55%"),
            ("Monthly (n=12)", "21.94%"), ("Daily (n=365)", "22.13%"),
            ("Continuous", "22.14%")]
    y = 350
    for label, val in rows:
        d.text((132, y), label, font=font(22), fill=MUTED)
        d.text((600, y), val, font=font(22, "mono-bold"), fill=INK)
        bar = 132 + int(500 * (float(val.strip('%')) - 19.5) / 3.0)
        d.rectangle([132, y + 34, bar, y + 42], fill=MINT_DIM)
        y += 68
    panel(d, (820, 260, 1500, 700), fill=PANEL_ALT)
    d.text((852, 292), "WHAT THE HEADLINE NUMBER OMITS", font=font(22, "mono-bold"), fill=AMBER)
    for i, item in enumerate([
        "Gas paid on every harvest and redeposit",
        "Divergence loss against a HODL benchmark",
        "Emission price decay on incentive tokens",
        "Volume decay: yesterday's fees, annualised",
        "Time spent out of range earning nothing",
    ]):
        yy = 350 + i * 62
        d.rectangle([852, yy + 8, 866, yy + 22], fill=AMBER)
        d.text((888, yy), item, font=font(22), fill=MUTED)
    paragraph(d, (100, 740),
              "A pool quoting 22% APY and a pool quoting 20% APR can pay the same money. Compare net-of-cost, "
              "net-of-divergence outcomes on a common horizon instead of comparing headline rates that use "
              "different compounding conventions.",
              font(22), MUTED, 1400)


def fig_yield_farming(d):
    chrome(d, "incentive plumbing", "Where a farmed yield actually comes from",
           "Trading fees are paid by flow. Emissions are paid by dilution. They behave differently.")
    boxes = [
        ("SWAP FLOW", "Traders pay the pool fee on every executed swap", MINT),
        ("POOL FEE", "Accrues pro-rata to in-range liquidity", MINT),
        ("LP POSITION", "Stakes LP claim into a gauge or farm", INK),
        ("EMISSIONS", "Protocol mints tokens on a schedule", AMBER),
        ("REALISED PnL", "Fees + emissions − divergence − gas − slippage", MINT),
    ]
    x = 100
    for i, (title, body, color) in enumerate(boxes):
        w = 250
        panel(d, (x, 300, x + w, 560), fill=PANEL_ALT, outline=color if color is not INK else LINE)
        d.text((x + 22, 330), title, font=font(21, "mono-bold"), fill=color)
        paragraph(d, (x + 22, 380), body, font(20), MUTED, w - 44, 28)
        if i < len(boxes) - 1:
            arrow(d, (x + w + 8, 430), (x + w + 62, 430), MINT if i != 2 else AMBER)
        x += w + 70
    panel(d, (100, 610, 1500, 800), fill=PANEL)
    d.text((132, 640), "DILUTION MATH", font=font(22, "mono-bold"), fill=AMBER)
    paragraph(d, (132, 686),
              "If a farm emits 2% of supply per week to attract deposits, the token price must hold against that "
              "issuance for the quoted yield to survive contact with the market. Mercenary capital exits when "
              "emissions taper, depth collapses, and the remaining LPs absorb the wider spread.",
              font(22), MUTED, 1330)
    paragraph(d, (100, 840),
              "Separate the two revenue lines before comparing farms: fee yield is a claim on real trading "
              "activity, emission yield is a claim on future token supply.",
              font(22), MUTED, 1400)


def fig_pool_types(d):
    chrome(d, "curve selection", "Four invariants, four different LP exposures",
           "The curve you supply into decides how reserves rotate when the market moves.")
    box = (100, 270, 820, 760)
    plot_frame(d, box, "RESERVE RATIO", "MARGINAL PRICE")
    draw_curve(d, box, lambda t: 1.0 / t, (0.35, 3.0), (0, 3.2), MINT, 4)
    draw_curve(d, box, lambda t: 1 + (1.0 / t - 1) * 0.16, (0.35, 3.0), (0, 3.2), AMBER, 4)
    draw_curve(d, box, lambda t: max(0.05, min(3.1, 1.0 / (t ** 2.4))), (0.35, 3.0), (0, 3.2), ROSE, 4, dash=True)
    legend(d, 100, 800, [("Constant product x·y=k", MINT), ("StableSwap (amplified)", AMBER), ("Weighted 80/20", ROSE)])
    cards = [
        ("CONSTANT PRODUCT", "Uniform depth on (0, ∞). Predictable, capital-hungry, uniform IL.", MINT),
        ("CONCENTRATED / TICK", "Depth only inside [Pa, Pb]. High fee density, out-of-range risk.", MINT),
        ("STABLE / AMPLIFIED", "Flat near peg, cliff after skew. Depeg converts the pool to one asset.", AMBER),
        ("WEIGHTED & MULTI-ASSET", "Constant-mean; 80/20 damps IL but keeps directional exposure.", ROSE),
    ]
    y = 270
    for title, body, color in cards:
        panel(d, (870, y, 1500, y + 108), fill=PANEL_ALT, outline=LINE)
        d.rectangle([870, y, 876, y + 108], fill=color)
        d.text((900, y + 18), title, font=font(21, "mono-bold"), fill=color)
        paragraph(d, (900, y + 52), body, font(20), MUTED, 570, 26)
        y += 126
    paragraph(d, (100, 860),
              "Pair volatility and correlation should pick the invariant, not the advertised yield. A curve that "
              "is efficient for pegged assets is the wrong shape for a volatile pair, and the reverse.",
              font(22), MUTED, 1400)


def fig_pool_vs_staking(d):
    chrome(d, "exposure comparison", "Staking sells time. Liquidity provision sells inventory",
           "Two different payoffs that are routinely quoted with the same annualised number.")
    cols = [
        ("STAKING / VALIDATION", MINT, [
            ("Revenue source", "Protocol issuance + priority fees"),
            ("Asset exposure", "Single asset, unchanged quantity"),
            ("Path dependency", "None: rewards accrue linearly"),
            ("Principal risk", "Slashing, client bugs, unbonding queue"),
            ("Liquidity", "Exit queue or LST secondary market"),
        ]),
        ("LIQUIDITY PROVISION", AMBER, [
            ("Revenue source", "Swap fees paid by executed flow"),
            ("Asset exposure", "Two assets, quantity rotates with price"),
            ("Path dependency", "High: outcome depends on the price path"),
            ("Principal risk", "Divergence, depeg, contract and hook risk"),
            ("Liquidity", "Withdraw any block, at the current ratio"),
        ]),
    ]
    x = 100
    for title, color, rows in cols:
        panel(d, (x, 260, x + 680, 800), fill=PANEL_ALT)
        d.rectangle([x, 260, x + 680, 268], fill=color)
        d.text((x + 28, 296), title, font=font(25, "mono-bold"), fill=color)
        y = 356
        for k, v in rows:
            d.text((x + 28, y), k.upper(), font=font(18, "mono"), fill=MUTED)
            yy = paragraph(d, (x + 28, y + 26), v, font(21), INK, 620, 28)
            d.line([(x + 28, yy + 10), (x + 652, yy + 10)], fill=GRID, width=1)
            y = yy + 30
        x += 720
    paragraph(d, (100, 840),
              "A staked asset still holds the same number of units after a 40% drawdown. A pooled position does "
              "not: the invariant will have sold the winner and accumulated the loser along the way.",
              font(22), MUTED, 1400)


def fig_slippage(d):
    chrome(d, "execution cost", "Price impact is the curve. Slippage is the surprise",
           "Executing against x·y=k: quoted mid, realised average, and the tolerance band around it.")
    box = (100, 270, 900, 760)
    plot_frame(d, box, "TRADE SIZE (% OF ACTIVE DEPTH)", "EXECUTION PRICE vs. MID")
    draw_curve(d, box, lambda s: -100 * (s / 100) / (1 + s / 100), (0, 60), (-42, 2), AMBER, 5)
    draw_curve(d, box, lambda s: -100 * (s / 100) / (1 + s / 100) * 0.5, (0, 60), (-42, 2), MINT, 5)
    legend(d, 100, 800, [("Shallow pool", AMBER), ("Deep pool (2x depth)", MINT)])
    panel(d, (940, 270, 1500, 760))
    d.text((972, 300), "ONE $50,000 ETH BUY", font=font(22, "mono-bold"), fill=MINT)
    rows = [("Mid price", "2,000.00"), ("Pool active depth", "$1,250,000"),
            ("Price impact", "−1.96%"), ("Realised average", "2,039.20"),
            ("Slippage tolerance", "0.50%"), ("Outcome", "Reverts, or split the order")]
    y = 352
    for k, v in rows:
        d.text((972, y), k, font=font(21), fill=MUTED)
        d.text((1240, y), v, font=font(21, "mono-bold"), fill=AMBER if k == "Outcome" else INK)
        d.line([(972, y + 40), (1468, y + 40)], fill=GRID, width=1)
        y += 62
    paragraph(d, (100, 850),
              "Price impact is deterministic and computable before signing. Slippage is what the difference "
              "between quote time and execution time does to that number, and it is where sandwich searchers "
              "collect the spread a loose tolerance leaves on the table.",
              font(22), MUTED, 1400)


def fig_fee_tiers(d):
    chrome(d, "fee tier selection", "The tier is a bid for order flow, not a yield setting",
           "Fee revenue = tier × captured volume × in-range liquidity share.")
    tiers = [
        ("1 bps", "0.01%", "Pegged pairs: USDC/USDT, stable LSTs", 0.34, MINT),
        ("5 bps", "0.05%", "Correlated majors: ETH/USDC routed size", 0.72, MINT),
        ("30 bps", "0.30%", "Volatile pairs, thinner routed volume", 0.55, AMBER),
        ("100 bps", "1.00%", "Long-tail and illiquid assets", 0.24, ROSE),
    ]
    y = 280
    for label, pct, use, share, color in tiers:
        panel(d, (100, y, 1500, y + 140), fill=PANEL_ALT)
        d.text((132, y + 26), label, font=font(34, "mono-bold"), fill=color)
        d.text((132, y + 78), pct, font=font(22, "mono"), fill=MUTED)
        paragraph(d, (300, y + 34), use, font(22), INK, 460, 30)
        d.text((800, y + 26), "SHARE OF ROUTED VOLUME", font=font(17, "mono"), fill=MUTED)
        d.rectangle([800, y + 58, 1460, y + 90], fill=PANEL, outline=LINE, width=1)
        d.rectangle([800, y + 58, 800 + int(660 * share), y + 90], fill=color)
        d.text((800 + int(660 * share) + 14, y + 62), f"{int(share * 100)}%", font=font(21, "mono-bold"), fill=color)
        y += 156
    paragraph(d, (100, y + 14),
              "Aggregators route to the cheapest executable path. A higher tier raises revenue per unit of volume "
              "and lowers the volume you are shown; the correct tier is the one that maximises the product for "
              "that specific pair.",
              font(22), MUTED, 1400)


def fig_lvr(d):
    chrome(d, "adverse selection", "Loss-versus-rebalancing separates market risk from LP risk",
           "LVR isolates what the arbitrageur takes, independent of whether the price went up or down.")
    box = (100, 270, 1500, 700)
    plot_frame(d, box, "TIME", "CUMULATIVE VALUE vs. ENTRY")
    x0, y0, x1, y1 = box

    def path(t):
        return 6 * math.sin(t / 3.4) + 3 * math.sin(t / 1.7)

    draw_curve(d, box, path, (0, 30), (-16, 16), MUTED, 3, dash=True)
    draw_curve(d, box, lambda t: path(t) - 0.42 * t, (0, 30), (-16, 16), ROSE, 5)
    draw_curve(d, box, lambda t: path(t) - 0.42 * t + 0.30 * t, (0, 30), (-16, 16), MINT, 5)
    legend(d, 100, 740, [("Rebalancing benchmark", MUTED), ("Pool value (LVR drag)", ROSE), ("Pool + fee income", MINT)])
    panel(d, (100, 782, 1500, 962), fill=PANEL_ALT)
    d.text((132, 810), "THE HURDLE", font=font(22, "mono-bold"), fill=AMBER)
    paragraph(d, (132, 852),
              "LVR accrues at roughly σ²/8 per unit of time for a constant-product pool. Fee income must clear "
              "that rate before the position beats the rebalancing benchmark. Measured over any window where "
              "σ jumps, the gap widens faster than volume compensates.",
              font(22), MUTED, 1330)


def fig_lose_money(d):
    chrome(d, "loss taxonomy", "Six distinct ways a pooled position loses money",
           "Divergence is the famous one. It is rarely the largest.")
    items = [
        ("DIRECTIONAL", "Both assets fall. The pool tracks the market down.", ROSE),
        ("DIVERGENCE / IL", "Relative price moves; the invariant sells the winner.", AMBER),
        ("OUT OF RANGE", "Fee accrual stops while inventory stays converted.", AMBER),
        ("CONTRACT & HOOK", "Exploit, upgrade key, or malicious hook permission.", ROSE),
        ("DEPEG / TAIL", "The curve absorbs the failing asset until reserves invert.", ROSE),
        ("FRICTION", "Gas, slippage on entry and exit, emission price decay.", MINT),
    ]
    x, y = 100, 270
    for i, (title, body, color) in enumerate(items):
        bx = x + (i % 3) * 470
        by = y + (i // 3) * 300
        panel(d, (bx, by, bx + 430, by + 260), fill=PANEL_ALT)
        d.rectangle([bx, by, bx + 430, by + 7], fill=color)
        d.text((bx + 24, by + 38), f"0{i + 1}", font=font(30, "mono-bold"), fill=color)
        d.text((bx + 24, by + 92), title, font=font(23, "mono-bold"), fill=INK)
        paragraph(d, (bx + 24, by + 136), body, font(21), MUTED, 380, 30)
    paragraph(d, (100, 890),
              "Only two of these are specific to automated market making. The rest are ordinary market, "
              "engineering and execution risks that a headline yield figure does not price.",
              font(22), MUTED, 1400)


def fig_il_calculator(d):
    chrome(d, "tool", "Impermanent loss calculator: inputs, formula, and the benchmark",
           "Entry price, exit price, fee income and position value resolve to one net number.")
    panel(d, (100, 260, 700, 800))
    d.text((132, 292), "INPUTS", font=font(22, "mono-bold"), fill=MINT)
    for i, (k, v) in enumerate([("Token A price at entry", "2,000"), ("Token B price at entry", "1.00"),
                                ("Token A price now", "3,000"), ("Token B price now", "1.00"),
                                ("Capital deployed", "$10,000"), ("Fees earned", "$260"),
                                ("Days held", "45")]):
        yy = 348 + i * 62
        d.rectangle([132, yy, 668, yy + 46], fill=PANEL_ALT, outline=LINE, width=1)
        d.text((148, yy + 12), k, font=font(19), fill=MUTED)
        d.text((560, yy + 12), v, font=font(19, "mono-bold"), fill=INK)
    panel(d, (740, 260, 1500, 800), fill=PANEL_ALT)
    d.text((772, 292), "OUTPUT", font=font(22, "mono-bold"), fill=AMBER)
    d.text((772, 344), "k = 3,000 / 2,000 = 1.5", font=font(24, "mono"), fill=INK)
    d.text((772, 392), "IL = 2·√k / (1 + k) − 1 = −2.02%", font=font(24, "mono-bold"), fill=AMBER)
    rows = [("HODL value", "$12,500"), ("Pool value before fees", "$12,247"),
            ("Divergence", "−$253"), ("Fee income", "+$260"),
            ("Net vs. HODL", "+$7"), ("Annualised fee yield", "21.1%")]
    y = 452
    for k, v in rows:
        d.text((772, y), k, font=font(21), fill=MUTED)
        d.text((1200, y), v, font=font(21, "mono-bold"),
               fill=MINT if k.startswith("Net") else INK)
        d.line([(772, y + 40), (1468, y + 40)], fill=GRID, width=1)
        y += 56
    paragraph(d, (100, 840),
              "A calculator answers one question precisely: did fee income clear the divergence this position "
              "took on over the holding window? Everything else, including whether the pair was worth holding, "
              "is a separate decision.",
              font(22), MUTED, 1400)



def fig_lp_calculator(d):
    chrome(d, "tool", "Fee income is three numbers multiplied together",
           "Fee tier x routed volume x your share of active liquidity, measured per day.")
    panel(d, (100, 260, 700, 800))
    d.text((132, 292), "INPUTS", font=font(22, "mono-bold"), fill=MINT)
    for i, (k, v) in enumerate([("Fee tier", "0.05%"), ("Daily routed volume", "$40,000,000"),
                                ("Active liquidity in band", "$5,000,000"), ("Your capital", "$100,000"),
                                ("Days held", "30"), ("Gas per rebalance", "$18"),
                                ("Rebalances expected", "2")]):
        yy = 348 + i * 62
        d.rectangle([132, yy, 668, yy + 46], fill=PANEL_ALT, outline=LINE, width=1)
        d.text((148, yy + 12), k, font=font(19), fill=MUTED)
        d.text((520, yy + 12), v, font=font(19, "mono-bold"), fill=INK)
    panel(d, (740, 260, 1500, 800), fill=PANEL_ALT)
    d.text((772, 292), "OUTPUT", font=font(22, "mono-bold"), fill=AMBER)
    d.text((772, 344), "share = 100,000 / 5,100,000 = 1.96%", font=font(23, "mono"), fill=INK)
    d.text((772, 392), "daily fees = 0.05% x 40m x 1.96% = $392", font=font(23, "mono-bold"), fill=AMBER)
    rows = [("Fees over 30 days", "$11,765"), ("Gas cost", "-$36"),
            ("Net fee income", "$11,729"), ("Annualised on capital", "142.7%"),
            ("Divergence hurdle", "measured separately"), ("Assumption", "100% time in range")]
    y = 452
    for k, v in rows:
        d.text((772, y), k, font=font(21), fill=MUTED)
        d.text((1180, y), v, font=font(21, "mono-bold"),
               fill=MINT if k.startswith("Net") else INK)
        d.line([(772, y + 40), (1468, y + 40)], fill=GRID, width=1)
        y += 56
    paragraph(d, (100, 840),
              "The output is gross fee capture, not profit. Time out of range, divergence against holding, and "
              "competing liquidity entering your band all reduce it, and none of them appear in the arithmetic "
              "that produces an advertised annual rate.",
              font(22), MUTED, 1400)



def fig_liquidity_provider(d):
    layout_ledger(d, "the lp bargain", "A liquidity provider is paid to hold inventory",
                  "Two sides of the same position, and only one of them is quoted as a yield.",
                  ("What the LP is paid", MINT, [
                      ("Swap fees", "A share of every trade routed through the position while it is in range"),
                      ("Incentives", "Optional emissions from a gauge or farm, funded by issuance"),
                      ("Priority in routing", "Depth at the touch attracts the flow that pays the fee"),
                  ]),
                  ("What the LP underwrites", AMBER, [
                      ("Inventory rotation", "The invariant sells the winner and accumulates the loser"),
                      ("Adverse selection", "Arbitrage reprices a stale quote before the LP can cancel"),
                      ("Contract and hook risk", "Every contract in the stack must keep working"),
                      ("Exit conditions", "Withdrawal happens at the ratio the pool holds that block"),
                  ]),
                  "Anyone can become a liquidity provider by depositing a pair. Being paid more than the position "
                  "costs requires the fee side to clear the underwriting side over the holding period.")


def fig_avoid_il(d):
    layout_cards(d, "mitigation, not elimination", "Six ways to reduce divergence, and what each one costs",
                 "Impermanent loss cannot be removed while quoting two assets. It can be repriced.",
                 [("CORRELATED PAIRS", "Pegged or tightly coupled assets diverge less. The trade is a much thinner fee stream and a large depeg tail.", MINT),
                  ("WEIGHTED POOLS", "An 80/20 pool rotates less of the portfolio, keeping directional exposure to the heavy asset.", MINT),
                  ("WIDER RANGES", "More time in range and less amplification, at lower fee density per dollar.", AMBER),
                  ("SHORTER HOLDS", "Less time for relative prices to separate, but gas is paid on every entry and exit.", AMBER),
                  ("DELTA HEDGING", "A short perpetual neutralises the price exposure, adding funding cost and margin risk.", ROSE),
                  ("HIGHER FEE TIERS", "More revenue per unit of volume, usually with less routed volume to earn it on.", ROSE)],
                 "The honest framing: choose which cost you would rather pay, then verify the fee stream still clears it.")


def fig_il_examples(d):
    layout_bars(d, "worked scenarios", "The same formula across five real position shapes",
                "Divergence against holding for a balanced deposit, before fee income.",
                [("+25%", "ETH/USDC drifts up a quarter", 0.03, "-0.62%", MINT),
                 ("2x", "ETH doubles against the dollar", 0.29, "-5.72%", MINT),
                 ("4x", "A mid-cap runs four times", 1.00, "-20.00%", AMBER),
                 ("-50%", "The volatile asset halves", 0.29, "-5.72%", AMBER),
                 ("Depeg to 0.90", "A stable pair breaks its peg", 0.01, "-0.14% before absorption", ROSE)],
                "Bars are scaled to the 4x case. The depeg row shows why endpoint divergence understates stable-pool "
                "risk: the loss arrives through reserve composition, not through the ratio.", "relative magnitude")


def fig_uniswap_pools(d):
    layout_rows(d, "protocol overview", "Three generations of Uniswap pools, one pricing idea",
                "What an LP actually chooses differs far more than the mathematics does.",
                [("v2", MUTED), ("v3", MINT), ("v4", AMBER)],
                [("Price coverage", "0 to infinity", "Chosen range", "Chosen range"),
                 ("Fee options", "30 bps fixed", "1 / 5 / 30 / 100 bps", "Tiers or hook-set dynamic fee"),
                 ("LP claim", "Fungible ERC-20", "ERC-721 position NFT", "ERC-6909 or NFT via periphery"),
                 ("Deployment", "One pair contract", "One contract per tier", "Singleton PoolManager"),
                 ("Management", "Passive", "Active range management", "Active, hooks can automate"),
                 ("Capital efficiency", "Low, uniform", "High inside the band", "High inside the band")],
                "The right version is the one where the pair has routed volume and where you can actually maintain "
                "the position you intend to hold.", label_w=330)


def fig_ticks(d):
    layout_cards(d, "position internals", "What a Uniswap v3 position is made of",
                 "Ticks, spacing, the NFT and the fee accumulators that decide what you can claim.",
                 [("TICKS", "Prices are stored as discrete ticks where each tick is 1.0001 times the previous one.", MINT),
                  ("TICK SPACING", "Each fee tier only allows every Nth tick, which sets the narrowest legal range.", MINT),
                  ("POSITION NFT", "An ERC-721 token recording lower tick, upper tick and liquidity, not a token balance.", AMBER),
                  ("FEE GROWTH", "Per-tick accumulators let the contract compute what a position earned while in range.", AMBER),
                  ("CROSSING", "A swap that exhausts one tick moves to the next initialised tick and updates accounting.", ROSE),
                  ("CLAIMING", "Fees sit outside the position until collected; they do not compound on their own.", ROSE)],
                 "Every operational surprise in a range position traces back to one of these six mechanics.")


def fig_v2_vs_v3(d):
    layout_rows(d, "version comparison", "Uniswap v2 and v3 ask different things of the LP",
                "The same pair, two products: a passive claim and a managed position.",
                [("v2", MUTED), ("v3", MINT)],
                [("Deposit", "Pair at the current ratio, full range", "Pair plus a chosen price range"),
                 ("Capital efficiency", "Uniform, most capital idle", "Up to two orders of magnitude higher in band"),
                 ("Fee tiers", "Single 30 bps tier", "Four tiers, separate pools"),
                 ("Divergence", "Standard curve, unbounded", "Amplified inside the band, bounded at the edge"),
                 ("Time in range", "Always in range", "Depends on band width and volatility"),
                 ("Work required", "None after deposit", "Monitoring, rebalancing, gas")],
                "A v3 position with a wide range approximates v2 at higher gas. A narrow one is a different strategy "
                "with a management workload attached.", label_w=340)


def fig_rug_pulls(d):
    layout_cards(d, "pre-deposit security", "Six checks that eliminate most pool-level fraud",
                 "None of these require reading Solidity. All of them are verifiable onchain.",
                 [("LOCKED LIQUIDITY", "Confirm the LP claim sits in a locker contract or a burn address, with the amount and unlock time read onchain.", MINT),
                  ("TOKEN PERMISSIONS", "Check for mint, pause, blacklist and fee-changing functions still held by an address.", MINT),
                  ("OWNERSHIP", "Renounced, timelocked or multisig, verified in the contract rather than in documentation.", AMBER),
                  ("HOLDER CONCENTRATION", "A handful of wallets holding most supply can exit through the pool you funded.", AMBER),
                  ("CONTRACT VERIFICATION", "Unverified bytecode on a token or pool is a refusal, not a risk to price.", ROSE),
                  ("EXIT SIMULATION", "Simulate a sell before buying. Tokens that can be bought but not sold are visible in seconds.", ROSE)],
                 "A locked pool with a malicious token is still a total loss. Both the pool and the assets in it have to pass.")


def fig_gas_costs(d):
    layout_bars(d, "friction floor", "Gas decides the minimum viable position size",
                "Round-trip cost as a share of a year of fee income at a 20% gross rate.",
                [("$500", "Mint, collect, rebalance twice, withdraw", 1.00, "72% of annual fees", ROSE),
                 ("$2,000", "Same cadence on the same network", 0.25, "18% of annual fees", ROSE),
                 ("$10,000", "Same cadence", 0.05, "3.6% of annual fees", AMBER),
                 ("$50,000", "Same cadence", 0.01, "0.7% of annual fees", MINT),
                 ("$10,000 on an L2", "Same cadence, cheaper execution", 0.002, "0.1% of annual fees", MINT)],
                "Assumes roughly $18 per transaction and five transactions. The conclusion is not that small positions "
                "are wrong; it is that they belong in wider ranges on cheaper networks.", "share of annual fee income")


def fig_single_sided(d):
    layout_steps(d, "one-sided provision", "Single-sided liquidity is a conversion with a fee attached",
                 "Depositing one asset does not remove the two-asset exposure, it schedules it.",
                 [("YOU DEPOSIT", "One asset, placed entirely on one side of the current price.", MINT),
                  ("THE RANGE FILLS", "As price moves through the band, the invariant sells your asset for the other one.", MINT),
                  ("FEES ACCRUE", "The position earns while price is inside the range and it is being converted.", AMBER),
                  ("CONVERSION COMPLETES", "Past the far bound the position holds only the other asset and stops earning.", AMBER),
                  ("YOU DECIDE", "Withdraw and realise the conversion, or leave it exposed to a reversal.", ROSE)],
                 "The economics are a limit order that pays you to wait, with the risk that the market reverses "
                 "through your range and converts you back.")


def fig_lending_vs_pool(d):
    layout_rows(d, "different instruments", "A lending pool and a liquidity pool share a word, not a payoff",
                "One is a credit position with a utilisation curve. The other is a quoted market.",
                [("LENDING POOL", MUTED), ("LIQUIDITY POOL", MINT)],
                [("Assets supplied", "One", "Two or more, in ratio"),
                 ("Revenue", "Borrower interest", "Swap fees paid by executed flow"),
                 ("Rate set by", "Utilisation curve", "Fee tier and routed volume"),
                 ("Principal risk", "Bad debt, oracle failure, liquidation shortfall", "Divergence, adverse selection, depeg"),
                 ("Withdrawal", "Subject to available liquidity", "Any block, at the current ratio"),
                 ("Quantity held", "Unchanged, grows with interest", "Rotates with relative price")],
                "Both can be sensible. Sizing one as though it behaved like the other is the error worth avoiding.",
                label_w=330)


def fig_real_yield(d):
    layout_ledger(d, "yield provenance", "Real yield is a statement about who funds the payment",
                  "The same headline percentage can be paid from two very different balance sheets.",
                  ("Fee-funded", MINT, [
                      ("Source", "Traders paying the pool fee on executed volume"),
                      ("Persistence", "Continues while the pair keeps trading"),
                      ("Dilution", "None: no new supply is created"),
                      ("Denominated in", "The pool's own assets"),
                  ]),
                  ("Emission-funded", AMBER, [
                      ("Source", "Newly issued protocol tokens"),
                      ("Persistence", "Ends when the schedule or the gauge vote ends"),
                      ("Dilution", "Continuous, borne by existing holders"),
                      ("Denominated in", "A token whose price must absorb the issuance"),
                  ]),
                  "The test takes one minute: set emissions to zero and ask whether you would still supply the pool "
                  "at the rate that remains.")


def fig_bonding_curves(d):
    layout_curve(d, "invariant design", "The invariant decides where depth lives",
                 "Three curve families plotted on the same axes, from perfectly flat to perfectly convex.",
                 "RESERVE RATIO", "MARGINAL PRICE", (0.35, 3.0), (0, 3.2),
                 [(lambda t: 1.0 / t, MINT, "Constant product", False),
                  (lambda t: max(0.02, min(3.15, 1 + (1.0 / t - 1) * 0.14)), AMBER, "Amplified stable", False),
                  (lambda t: max(0.02, min(3.15, 2.0 - 0.62 * t)), ROSE, "Constant sum", True)],
                 "A constant-sum curve gives perfect execution until reserves run out. A constant-product curve never "
                 "runs out but charges impact everywhere. Every practical invariant sits between the two, and the "
                 "choice is a statement about what the pair is expected to do.")


def fig_dynamic_fees(d):
    layout_curve(d, "fee design", "A dynamic fee prices volatility instead of guessing it",
                 "What a pool charges as conditions change, under fixed tiers and under a hook.",
                 "REALISED VOLATILITY", "FEE CHARGED (BPS)", (0.1, 2.0), (0, 60),
                 [(lambda v: 5, MUTED, "Fixed 5 bps tier", True),
                  (lambda v: 30, MINT, "Fixed 30 bps tier", True),
                  (lambda v: min(58, 4 + 26 * v * v), AMBER, "Dynamic fee hook", False)],
                 "A fixed tier is either too cheap during a repricing or too expensive during calm conditions. A hook "
                 "that raises the fee with realised volatility charges arbitrage more precisely when the pool's quote "
                 "is most likely to be stale.")


def fig_depth(d):
    layout_curve(d, "executable depth", "Depth, not deposits, decides what a trade costs",
                 "Price impact against order size for three pools with the same headline TVL.",
                 "ORDER SIZE (% OF ACTIVE DEPTH)", "PRICE IMPACT", (0, 50), (-36, 2),
                 [(lambda s: -100 * (s / 100) / (1 + s / 100) * 2.0, ROSE, "Thin active depth", False),
                  (lambda s: -100 * (s / 100) / (1 + s / 100), AMBER, "Moderate depth", False),
                  (lambda s: -100 * (s / 100) / (1 + s / 100) * 0.45, MINT, "Deep active band", False)],
                 "Two pools with identical total value locked can sit on any of these curves. The measurement that "
                 "matters is capital within a defined band of the current price, at the moment the trade executes.")


def fig_range_strategy(d):
    def density(w):
        return 100 * min(1.0, 6.0 / w)

    def in_range(w):
        return 100 * (1 - math.exp(-w / 12.0))

    def net(w):
        return max(0.0, (density(w) * in_range(w) / 100.0 - 220.0 / w) / 13.9 * 100.0)

    layout_curve(d, "range width", "Fee density and time in range pull in opposite directions",
                 "Each series indexed to its own maximum. Net includes the gas a narrow band keeps costing.",
                 "BAND WIDTH (PLUS OR MINUS PERCENT)", "INDEXED OUTCOME", (3, 40), (0, 105),
                 [(density, MINT, "Fee density per dollar", False),
                  (in_range, AMBER, "Expected time in range", False),
                  (net, ROSE, "Net of rebalancing cost", False)],
                 "The net curve peaks in the middle and the peak moves with realised volatility: more volatile pairs "
                 "push it wider, calmer pairs pull it tighter. There is no universally correct width, only one that "
                 "matches the volatility you face and the rebalancing you will actually pay for.",
                 xticks=["3%", "12%", "21%", "30%", "40%"],
                 yticks=[(0, "0"), (50, "50"), (100, "100")])


def fig_beginners(d):
    layout_steps(d, "start here", "Five decisions, in the order they actually arrive",
                 "Everything else in liquidity provision is a refinement of these five.",
                 [("PICK THE PAIR", "You will hold both assets in changing proportions. Start from what you would hold anyway.", MINT),
                  ("PICK THE CURVE", "Pegged assets belong on stable curves, volatile pairs on constant product or a range.", MINT),
                  ("PICK THE TIER", "Higher fee, less routed volume. The product of the two is what pays you.", AMBER),
                  ("SIZE THE POSITION", "Gas on entry, management and exit must be small against expected fee income.", AMBER),
                  ("SET THE EXIT RULE", "Decide in advance what ends the position: a price, a date, or a measured shortfall.", ROSE)],
                 "None of these steps requires predicting a price. All of them require being honest about what you are "
                 "willing to hold when the market moves against the position.")


def fig_token_liquidity(d):
    layout_cards(d, "token-level research", "Six measurements that describe a token's real liquidity",
                 "Market capitalisation says nothing about whether a position can be exited.",
                 [("ACTIVE DEPTH", "Capital within two percent of the current price, summed across venues.", MINT),
                  ("EXIT SIZE", "The trade that moves price five percent. That number is your practical position cap.", MINT),
                  ("VENUE SPREAD", "Liquidity split across chains and pools is thinner than the total suggests.", AMBER),
                  ("HOLDER SHAPE", "Concentrated supply means the exit you plan may be behind someone else's.", AMBER),
                  ("VOLUME QUALITY", "Separate organic flow from arbitrage and wash activity before trusting a volume figure.", ROSE),
                  ("LOCK STATUS", "Liquidity that can be withdrawn by one party is not liquidity you can rely on.", ROSE)],
                 "Run these before sizing, not after. Each one is available onchain and none needs a paid data feed.")


def fig_onchain_liquidity(d):
    layout_steps(d, "market structure", "How decentralized liquidity is actually assembled",
                 "From a single deposit to the quote a trader receives, five layers deep.",
                 [("DEPOSITS", "Individual LPs supply pairs into pool contracts on many chains.", MINT),
                  ("POOLS", "Each contract prices trades from its own reserves and invariant.", MINT),
                  ("ROUTERS", "Aggregators split an order across pools to minimise total execution cost.", AMBER),
                  ("SOLVERS", "Intent systems compete to fill an outcome, netting flow before touching a pool.", AMBER),
                  ("ARBITRAGE", "Searchers reconcile prices across venues, which is what keeps quotes honest.", ROSE)],
                 "Onchain liquidity is not one book. It is a set of independent quotes held consistent by arbitrage, "
                 "which is precisely why LPs pay for that consistency.")


def fig_pancakeswap(d):
    layout_rows(d, "protocol comparison", "PancakeSwap pools alongside the Uniswap model",
                "Similar mathematics, different chains, fee schedules and incentive design.",
                [("PANCAKESWAP", AMBER), ("UNISWAP", MINT)],
                [("Core curves", "Constant product and concentrated ranges", "Constant product and concentrated ranges"),
                 ("Primary chains", "BNB Chain plus several EVM networks", "Ethereum plus major L2s"),
                 ("Fee tiers", "1 / 5 / 25 / 100 bps depending on pool type", "1 / 5 / 30 / 100 bps"),
                 ("Incentives", "CAKE emissions directed by gauge voting", "Mostly fee-funded, campaign incentives vary"),
                 ("LP claim", "ERC-20 for v2, position NFT for v3", "ERC-20, NFT or ERC-6909 by version"),
                 ("What to check", "Emission schedule and gauge weight", "Routed volume by tier and hook permissions")],
                "The invariant transfers between venues; the incentive design does not. Read the emission schedule "
                "before comparing a farmed rate against a fee-only one.", label_w=330)


def fig_profit_calculator(d):
    layout_ledger(d, "tool", "Net LP result: three inputs, one honest number",
                  "Fee income, divergence and friction resolved into a single comparison against holding.",
                  ("Inputs", MINT, [
                      ("Position", "$10,000 into an ETH/USDC pool at 2,000"),
                      ("Price now", "2,800 per ETH, k = 1.40"),
                      ("Fee capture", "$430 collected over 60 days"),
                      ("Friction", "$54 of gas across five transactions"),
                  ]),
                  ("Output", AMBER, [
                      ("Divergence vs holding", "-1.44%, or -$168"),
                      ("Net result vs holding", "+$208"),
                      ("Annualised net", "+12.7% on deployed capital"),
                      ("Break-even fees", "$168 over the same window"),
                  ]),
                  "The calculator exists to answer one question: did this position beat holding the basket it started "
                  "from, after everything that was actually paid?")


def fig_mining_vs_farming(d):
    layout_rows(
        d, "funding sources", "Three activities, three people paying",
        "Staking, liquidity provision and liquidity mining are routinely quoted as one annualised number.",
        [("STAKING", MINT), ("LIQUIDITY PROVISION", AMBER), ("LIQUIDITY MINING", ROSE)],
        [
            ("Who pays", "Network issuance and priority fees", "Traders, via the swap fee", "Token holders, via dilution"),
            ("Assets committed", "One asset, quantity unchanged", "A pair, quantity rotates", "The LP claim, staked into a gauge"),
            ("Divergence loss", "None", "Yes, on every relative move", "Inherited from the pool beneath"),
            ("Durability", "Structural, while the chain runs", "While routed volume persists", "Programme-limited by design"),
            ("What ends it", "Unbonding queue or exit", "Volume migrating elsewhere", "The emission schedule"),
        ],
        "Yield farming is the user-side strategy layered on top of these three. It is not a fourth source of money.",
        label_w=340,
    )


def fig_lp_profitable(d):
    layout_bars(
        d, "the arithmetic", "Fee revenue is the only line most dashboards show",
        "A $20,000 position over 90 days in a 30 bp volatile pool, with every deduction priced.",
        [
            ("FEE INCOME", "Routed volume x fee tier x liquidity share", 1.00, "+$2,190", MINT),
            ("TIME IN RANGE", "Position inactive 39% of the period", 0.39, "-$854", AMBER),
            ("DIVERGENCE", "The invariant rebalanced the basket", 0.78, "-$1,704", ROSE),
            ("GAS AND CLAIMS", "Six transactions across the lifecycle", 0.03, "-$54", AMBER_DIM),
            ("EMISSIONS REALISED", "Reward tokens sold, not accrued", 0.13, "+$290", MINT_DIM),
            ("NET VS HOLDING", "The only figure that answers the question", 0.06, "-$132", ROSE),
        ],
        "The pool collected more than three times the fees of a stable pair over the same period and still lost to holding.",
        axis_label="scaled against gross fee income",
    )


def fig_meteora_strategy(d):
    chrome(d, "bin distribution", "Shape decides what the position does when price moves",
           "The same bin range funded three ways: spot, curve and bid-ask.")
    shapes = [
        ("SPOT", MINT, lambda i, n: 1.0),
        ("CURVE", AMBER, lambda i, n: math.exp(-((i - (n - 1) / 2) ** 2) / (2 * (n / 6.0) ** 2))),
        ("BID-ASK", ROSE, lambda i, n: 0.18 + 0.82 * (abs(i - (n - 1) / 2) / ((n - 1) / 2)) ** 2),
    ]
    n = 17
    for col, (name, colour, fn) in enumerate(shapes):
        x0 = 100 + col * 480
        panel(d, (x0, 258, x0 + 440, 700), fill=PANEL_ALT)
        d.rectangle([x0, 258, x0 + 440, 265], fill=colour)
        d.text((x0 + 22, 288), name, font=font(25, "mono-bold"), fill=colour)
        base = 668
        bw = 380 // n
        for i in range(n):
            h = int(300 * fn(i, n))
            bx = x0 + 30 + i * bw
            active = i == (n - 1) // 2
            d.rectangle([bx, base - max(6, h), bx + bw - 4, base],
                        fill=colour if not active else INK)
        d.line([(x0 + 30, base + 4), (x0 + 30 + n * bw, base + 4)], fill=LINE, width=2)
        d.text((x0 + 22, base + 16), "ACTIVE BIN IN WHITE", font=font(17, "mono"), fill=MUTED)
    notes = [
        "Spot tolerates being wrong about direction.",
        "Curve earns most while price stays put.",
        "Bid-ask is a pair of scaled limit orders.",
    ]
    for col, text in enumerate(notes):
        paragraph(d, (122 + col * 480, 724), text, font(20), MUTED, 400, 26)
    paragraph(d, (100, 812),
              "Only the active bin earns fees on a swap. Capital in bins price never reaches contributes nothing, "
              "and each bin crossed converts inventory from one asset to the other.",
              font(22), MUTED, 1400)


def fig_raydium_clmm(d):
    layout_ledger(
        d, "solana pool types", "Two designs, two entirely different jobs",
        "Raydium runs constant-product and concentrated pools side by side.",
        ("CPMM / constant product", MINT, [
            ("Price coverage", "Every price from zero to infinity"),
            ("Management", "None: the position cannot go inactive"),
            ("Capital efficiency", "Low, most capital backs prices never traded"),
            ("Divergence", "Standard constant-product divergence"),
            ("Suits", "Long-tail pairs and unattended capital"),
        ]),
        ("CLMM / concentrated", AMBER, [
            ("Price coverage", "Between the lower and upper tick only"),
            ("Management", "Range monitoring and rebalance decisions"),
            ("Capital efficiency", "20x at a ten percent band, while in range"),
            ("Divergence", "Amplified inside the band, total at each edge"),
            ("Suits", "Liquid pairs with an operator watching them"),
        ]),
        "Below the lower bound the position is entirely the base asset; above the upper bound, entirely the quote asset.",
    )


def fig_v3_calculator(d):
    chrome(d, "range calculator", "What a bounded position holds, at every price",
           "Token composition and fee state across a concentrated range [Pa, Pb].")
    box = (100, 300, 1000, 740)
    plot_frame(d, box, "PRICE", "SHARE OF POSITION VALUE IN THE BASE ASSET")
    pa, pb = 0.75, 1.35

    def share(p):
        if p <= pa:
            return 100.0
        if p >= pb:
            return 0.0
        x = (1 / math.sqrt(p) - 1 / math.sqrt(pb))
        y = (math.sqrt(p) - math.sqrt(pa))
        return 100.0 * (x * p) / (x * p + y)

    draw_curve(d, box, share, (0.55, 1.6), (-4, 104), MINT, 5)
    for value, colour, label in ((pa, AMBER, "Pa"), (pb, AMBER, "Pb")):
        gx = box[0] + (box[2] - box[0]) * (value - 0.55) / (1.6 - 0.55)
        d.line([(gx, box[1] + 2), (gx, box[3] - 2)], fill=colour, width=2)
        d.text((gx + 8, box[1] + 10), label, font=font(20, "mono-bold"), fill=colour)
    ticks(d, box, (0.55, 1.6), (-4, 104),
          ["0.55", "0.76", "0.97", "1.18", "1.39", "1.60"],
          [(0, "0%"), (50, "50%"), (100, "100%")])
    cards = [
        ("BELOW Pa", "100% base asset. The curve bought all the way down. No fees accrue.", ROSE),
        ("IN RANGE", "A mixture that shifts continuously. This is the only state that earns.", MINT),
        ("ABOVE Pb", "100% quote asset. The curve sold all the way up. No fees accrue.", AMBER),
    ]
    y = 300
    for heading, body, colour in cards:
        panel(d, (1040, y, 1500, y + 132), fill=PANEL_ALT)
        d.rectangle([1040, y, 1500, y + 7], fill=colour)
        d.text((1064, y + 26), heading, font=font(22, "mono-bold"), fill=colour)
        paragraph(d, (1064, y + 62), body, font(19), MUTED, 412, 25)
        y += 154
    paragraph(d, (100, 806),
              "Concentration multiplies depth per dollar and shortens the price band over which the position exists "
              "at all. Both effects are computable before the position is funded.",
              font(22), MUTED, 1400)

FIGURES = {
    "out-of-range-liquidity": fig_out_of_range,
    "uniswap-v3-vs-v4": fig_v3_vs_v4,
    "impermanent-loss-formula": fig_il_formula,
    "lp-fees-vs-impermanent-loss": fig_fees_vs_il,
    "apr-vs-apy-in-defi": fig_apr_apy,
    "yield-farming-explained": fig_yield_farming,
    "liquidity-pool-types": fig_pool_types,
    "liquidity-pool-vs-staking": fig_pool_vs_staking,
    "slippage-and-price-impact": fig_slippage,
    "uniswap-fee-tiers-explained": fig_fee_tiers,
    "loss-versus-rebalancing": fig_lvr,
    "can-you-lose-money-in-a-liquidity-pool": fig_lose_money,
    "impermanent-loss-calculator": fig_il_calculator,
    "liquidity-pool-calculator": fig_lp_calculator,
    "what-is-a-liquidity-provider": fig_liquidity_provider,
    "how-to-avoid-impermanent-loss": fig_avoid_il,
    "impermanent-loss-examples": fig_il_examples,
    "uniswap-liquidity-pools": fig_uniswap_pools,
    "uniswap-v3-ticks-and-lp-nfts": fig_ticks,
    "uniswap-v2-vs-v3": fig_v2_vs_v3,
    "liquidity-pool-rug-pulls": fig_rug_pulls,
    "lp-gas-costs": fig_gas_costs,
    "single-sided-liquidity": fig_single_sided,
    "lending-pool-vs-liquidity-pool": fig_lending_vs_pool,
    "real-yield-liquidity-pools": fig_real_yield,
    "bonding-curves-and-amm-invariants": fig_bonding_curves,
    "dynamic-fees-in-amms": fig_dynamic_fees,
    "liquidity-depth-and-execution": fig_depth,
    "concentrated-liquidity-strategy": fig_range_strategy,
    "liquidity-pools-for-beginners": fig_beginners,
    "token-liquidity-analysis": fig_token_liquidity,
    "onchain-liquidity-explained": fig_onchain_liquidity,
    "pancakeswap-liquidity-pools": fig_pancakeswap,
    "lp-profit-calculator": fig_profit_calculator,
    "liquidity-mining-vs-yield-farming": fig_mining_vs_farming,
    "is-providing-liquidity-profitable": fig_lp_profitable,
    "meteora-dlmm-strategy": fig_meteora_strategy,
    "raydium-clmm-liquidity-guide": fig_raydium_clmm,
    "uniswap-v3-liquidity-calculator": fig_v3_calculator,
}


def render(slug: str) -> str:
    img, d = canvas()
    FIGURES[slug](d)
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"{slug}.webp")
    img.save(path, "WEBP", quality=88, method=6)
    return path


if __name__ == "__main__":
    targets = sys.argv[1:] or sorted(FIGURES)
    for slug in targets:
        print(f"wrote {render(slug)}")
