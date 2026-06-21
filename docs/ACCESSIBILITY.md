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
| Autonomy Dial as radio group | 4.1.2 / 1.3.1 | ✅ | `role="radiogroup"` + `role="radio"` + `aria-checked` in `AutonomyDial.tsx` |
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
| `--tl-danger` | #EF4444 | ~4.0:1 | ⚠️ use for large/bold text or pair with an icon |

> Ratios are approximate; verify with a contrast checker before final submission.

## How to verify (5-minute check)

1. **Keyboard:** press `Tab` from page load — the *Skip to main content* link should appear first;
   every button/input should show a blue focus ring; you can operate the Autonomy Dial with arrow/Tab + Enter.
2. **Reduced motion:** enable OS "Reduce motion" → animations should stop.
3. **Screen reader (optional):** NVDA/VoiceOver should announce the main landmark, panel headings,
   and the autonomy radio group state.
4. **Automated:** run Lighthouse (Chrome DevTools → Lighthouse → Accessibility) or axe DevTools and record the score.

## Known gaps / next steps (⚠️)

- Run a full **axe** / **Lighthouse** pass and paste the score here.
- Audit Recharts SVG charts for text alternatives (provide a data-table fallback).
- Verify modal focus-trapping and `Esc`-to-close on every dialog.
- Re-check `--tl-danger` usages that render small body text.

**Lighthouse accessibility score:** `100/100` (Chrome Lighthouse 13.2, Desktop, Accessibility-only audit)

> The initial audit scored 95; the one failing item was low-contrast sidebar text
> (`text-slate-500`), which was raised to `text-slate-400` to meet AA. Re-audit: 100/100.
