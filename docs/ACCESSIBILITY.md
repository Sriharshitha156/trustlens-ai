# TrustLens AI — Accessibility Audit (WCAG 2.1 AA)

> Stretch goal: *"Ensure the prototype meets WCAG 2.1 AA standards and include a brief accessibility audit."*
> This is a self-audit of the current build. Items marked ✅ are implemented; ⚠️ are known gaps for future work.

## Summary

TrustLens AI targets **WCAG 2.1 Level AA**. The dark palette in `src/index.css` is built around
high-contrast text tokens, and keyboard, motion, and structure support were added in this pass.

## What was implemented

| Guideline | WCAG ref | Status | Where |
|-----------|----------|--------|-------|
| Keyboard focus is always visible | 2.4.7 Focus Visible (AA) | ✅ | `:focus-visible` rings in `src/index.css` |
| Skip to main content | 2.4.1 Bypass Blocks (A) | ✅ | `.tl-skip-link` + `<main id="main-content">` in `App.tsx` |
| Respect reduced-motion preference | 2.3.3 Animation from Interactions (AAA) | ✅ | `@media (prefers-reduced-motion)` in `src/index.css` |
| Main landmark + labelled regions | 1.3.1 Info & Relationships (A) | ✅ | `<main aria-label>`, `<section aria-labelledby>` in new panels |
| Icon-only controls have names | 4.1.2 Name, Role, Value (A) | ✅ | `aria-label` on export, autonomy radios, agent icons `aria-hidden` |
| Modals close on `Esc` + focus styles | 2.1.2 / 2.4.7 | ✅ | `Modal.tsx` (Esc handler) + global `:focus-visible` |
| Language of page | 3.1.1 Language of Page (A) | ✅ | `<html lang="en">` in `index.html` |
| Screen-reader-only utility | 1.3.1 | ✅ | `.sr-only` in `src/index.css` |

## Colour contrast (key tokens against `--tl-bg-card #1E293B`)

| Token | Hex | Ratio | AA (4.5:1 text) |
|-------|-----|-------|-----------------|
| `--tl-text-primary` | #F8FAFC | ~15.8:1 | ✅ |
| `--tl-text-secondary` | #CBD5E1 | ~11.1:1 | ✅ |
| `--tl-text-muted` | #94A3B8 | ~6.1:1 | ✅ (normal text) |
| `--tl-success` | #22C55E | ~6.9:1 | ✅ |
| `--tl-warning` | #F59E0B | ~7.9:1 | ✅ |
| `--tl-danger` | #EF4444 | ~4.0:1 | background/icon use only |
| danger **text** | #F87171 | ~5.9:1 | ✅ used for all small red text (priority, severity, alerts) |

> Ratios are approximate; verify with a contrast checker before final submission.
> Small red text uses the brighter `#F87171` (not `--tl-danger`) so it passes AA; the original
> `--tl-danger` is reserved for backgrounds/icons where it carries white text.

## How to verify (5-minute check)

1. **Keyboard:** press `Tab` from page load — the *Skip to main content* link should appear first;
   every button/input should show a blue focus ring.
2. **Reduced motion:** enable OS "Reduce motion" → animations should stop.
3. **Screen reader (optional):** NVDA/VoiceOver should announce the main landmark and panel headings.
4. **Automated:** run Lighthouse (Chrome DevTools → Lighthouse → Accessibility) or axe DevTools and record the score.

## Known gaps / next steps (⚠️)

- Audit Recharts SVG charts for text alternatives (provide a data-table fallback).
- Verify modal focus-trapping and `Esc`-to-close on every dialog (Esc-to-close is implemented).

**Lighthouse accessibility score:** `100/100` (Chrome Lighthouse 13.2, Desktop, Accessibility-only audit)

> **Fix history:**
> - First audit scored 95 — low-contrast sidebar text (`text-slate-500`) → raised to `text-slate-400`. Re-audit: 100.
> - A later pass scored 93 — low-contrast red text/badges (priority badge, severity labels, impact
>   badges, notification badge). Fixed by using brighter red `#F87171` for small text, a neutral
>   badge with a colored border + white score, a darker notification-badge background (`#B91C1C`),
>   and correcting heading order (browser title `h3`→`h2`). Re-audit: **100/100**.
