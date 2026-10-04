# RiaMiranda — Design System

> Brand: RiaMiranda · Jakarta, est. 2009 · Founder: Indria Miranda
> Quiet editorial fashion house, soft, feminine, restrained.

---

## Colour Tokens

All colours **must** be used via CSS custom properties. Never hardcode hex values in components.

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--surface` | `#F6F4F0` | Cards, sections, placeholder bg |
| `--ink` | `#4D4946` | Body text |
| `--charcoal` | `#4F4D4A` | Headings, active tabs, fashion accent |
| `--muted` | `#8B8987` | Secondary text, captions |
| `--line` | `#E6E2DC` | Hairline dividers, borders |
| `--caramel` | `#987245` | Brand gold, signature accent, catering accent |
| `--indigo-brand` | `#162C74` | Deep accent, property section |
| `--sale` | `#EA33B7` | Sale tags & one primary promo button **only** |
| `--available` | `#7C9070` | Property: Tersedia |
| `--occupied` | `#A8645A` | Property: Sudah Ditempati |
| `--deposit` | `#C79A4B` | Property: Sudah DP |

### Section Accents
- **Fashion (Busana):** charcoal + caramel
- **Property (Properti):** indigo + caramel
- **Catering (Katering):** caramel + warm neutrals

---

## Typography

| Role | Font | Weight | Size | Style |
|---|---|---|---|---|
| Wordmark | Cormorant Garamond | 300 | 1.5–2rem | tracking-widest uppercase |
| Headings (h1–h3) | Cormorant Garamond | 300–400 | 2–4rem | wide letter-spacing |
| Body | Jost | 300–400 | 0.875–1rem | — |
| Nav / Labels | Jost | 400 | 12px | uppercase, letter-spacing 0.16em |
| Captions | Jost | 300 | 11px | uppercase, letter-spacing 0.12em |

---

## Spacing & Shape

- **Border-radius:** 0–4px on all elements. Pills (floating buttons, SALE badge): `border-radius: 9999px`.
- **Borders:** 1px hairline in `--line` only. Never box-shadows heavier than `0 1px 0 var(--line)`.
- **Whitespace:** generous — sections have at least 80px vertical padding on desktop.
- **Photography aspect ratios:** 3:4 portrait (products), 16:9 wide (hero, property), 1:1 square (food gallery).

---

## Motion

- Hover transitions: `transition-all duration-[400ms] ease-in-out`
- Scroll fade-in: `opacity-0 → opacity-100`, `translateY(16px) → translateY(0)`, no heavy parallax.
- Product second-image swap: opacity cross-fade on hover.
- No transforms > `scale(1.02)` on hover.

---

## Global Layout (every page)

```
┌─────────────────────────────────────────────────────────┐
│  BrandTabStrip: Busana | Properti | Katering            │  ~32px, charcoal active, one caramel
├─────────────────────────────────────────────────────────┤
│  AnnouncementBar                                        │  40px, charcoal bg, white text, rotating
├─────────────────────────────────────────────────────────┤
│  Header: RIAMIRANDA · nav · IDR · 🔍 👤 🛒             │  sticky, transparent→white on scroll
├─────────────────────────────────────────────────────────┤
│  <page content>                                         │
├─────────────────────────────────────────────────────────┤
│  Footer: 4 columns + newsletter + payment row           │
└─────────────────────────────────────────────────────────┘
  [Wishlist] right-edge vertical tab
  [Rewards] pill bottom-left
  [Chat Us!] pill bottom-right
```

---

## Strictly Avoid

- ❌ Purple/blue gradients, glassmorphism, neon, glow effects
- ❌ Emoji icons (use inline SVG / lucide-react thin lines only)
- ❌ `rounded-2xl`, `rounded-3xl` (except pills = `rounded-full`)
- ❌ `shadow-lg`, `shadow-xl` (only `shadow-none` or hairline `shadow-[0_1px_0_var(--line)]`)
- ❌ Generic copy: "Elevate your", "Seamless", "Unlock", "Discover"
- ❌ Lorem ipsum — write realistic Bahasa Indonesia copy
- ❌ Random stock image URLs — use `<Placeholder />` component
- ❌ Hex values outside `tokens.css`

---

## Rupiah Format

`Rp 2.850.000` — dots as thousand separators, no decimal places.

---

## Placeholder Component

```tsx
<Placeholder ratio="3/4" label="Produk" className="w-full" />
```

Renders a warm `--surface` coloured div with the correct aspect ratio. Used for all images.

---

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/busana` | Busana home |
| `/busana/koleksi/:slug` | Collection page |
| `/busana/produk/:slug` | Product detail |
| `/properti` | Property listings |
| `/properti/:id` | Property detail + bid |
| `/katering` | Catering promo |
| `*` | 404 Not Found |
