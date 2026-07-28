# Weekly Model Allocation (rules-based)

*As of equities 2026-07-27 / crypto 2026-07-27. Rules-based model portfolio for research/education. Not financial advice, not a prediction. Every weight traces to a measured, cited rule; the rules are tilts and risk controls, not knowledge of the future.*

| Weight | Asset | Sleeve | Rule (auditable) |
|---|---|---|---|
| 12.0% | **TLT** | diversifier | low measured STRESS-day correlation to equities (study 4) |
| 10.3% | **SPY** | core | inverse-vol core (12m vol 15%), cap 20% |
| 10.2% | **EFA** | core | inverse-vol core (12m vol 16%), cap 20% |
| 8.1% | **EEM** | core | inverse-vol core (12m vol 20%), cap 20% |
| 7.9% | **GLD** | diversifier | low measured STRESS-day correlation to equities (study 4) |
| 7.8% | **QQQ** | core | inverse-vol core (12m vol 20%), cap 20% |
| 7.5% | **IWM** | core | inverse-vol core (12m vol 21%), cap 20% |
| 2.7% | **AAPL** | momentum-tilt | top-3 composite screen; documented factor, but it FAILED our own 3y test (study 5) — kept small |
| 2.7% | **JPM** | momentum-tilt | top-3 composite screen; documented factor, but it FAILED our own 3y test (study 5) — kept small |
| 2.7% | **XLK** | momentum-tilt | top-3 composite screen; documented factor, but it FAILED our own 3y test (study 5) — kept small |
| 28.4% | **CASH** | reserve | cash floor + vol-target overlay overflow + closed crypto gate |

Portfolio vol overlay: realized 15.1% vs target 12% → scale 0.80.

## Why these rules and not "better" ones

- **Inverse-vol core** — volatility is the one demonstrably predictable input (INSIGHTS study 3); weighting by its inverse equalizes risk contributions instead of dollar amounts.
- **TLT/GLD sleeve** — the only pairs whose correlation to equities stayed low on measured STRESS days (study 4). Diversification chosen from crash behavior, not brochure behavior.
- **Momentum tilt kept small** — the factor is documented across a century of data, but it FAILED in our own 3-year window (study 5). A rule that can fail for years gets 10%, not 55%.
- **Crypto trend-gated and capped at 5%** — fattest tails in the dataset (study 1) and zero luck-adjusted evidence of timing edge (STRATEGY-LAB: DSR 0/38).
- **Vol-target overlay** — when the portfolio's realized vol exceeds target, risk scales into cash. Sizing responds to the measurable thing.

**What this does not do:** predict returns, promise outperformance, or react to news. It rebalances weekly by rule. Any week the rules produce the same weights, the correct action is nothing.

*Regenerated weekly. History: `./scripts/longterm.sh`.*
