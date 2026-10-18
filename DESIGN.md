# Rea Manda — Design System Specification

> Brand: Rea Manda · Elegan, Tulus, dan Abadi
> Quiet editorial Indonesian fashion house, living hospitality & catering perjamuan.
> Clean-slate UI redesign grounded in three reference aesthetics:
> 1. Busana: Modest editorial fashion house
> 2. Properti: Warm sand hospitality & living
> 3. Katering: Modern Indonesian banquet, packages & dish menus

---

## 1. Colour Tokens (Light Only — Strictly Approved Palette)

All colours **must** be used via CSS custom properties. No other hex or rgb value may appear in any component:

| Token | Value | Usage |
|---|---|---|
| `--white` | `#FFFFFF` | Solid header, active tab strips, card backgrounds |
| `--surface` | `#F6F4F0` | Default page background, cards, secondary panels |
| `--surface-2` | `#ECE7DF` | Editorial placeholders, image backs, tonal bands |
| `--sand` | `#E7E1D1` | Properti section background (Rukita-inspired warm sand) |
| `--line` | `#E6E2DC` | 1px hairline dividers, structural borders |
| `--ink` | `#4D4946` | Body text (1.0625rem / 1.7) |
| `--charcoal` | `#4F4D4A` | Headings, active tabs, Busana section accent |
| `--muted` | `#6F6B67` | Secondary text, captions, metadata |
| `--caramel` | `#987245` | Brand warm gold |
| `--caramel-deep`| `#7E5D34` | Small caramel text on light, Katering section accent |
| `--indigo` | `#162C74` | Properti section accent, admin bar |
| `--sale` | `#EA33B7` | **ONLY** for SALE badges & Sale menu pill, nowhere else |
| `--status-available` | `#7C9070` | Property: Tersedia |
| `--status-deposit` | `#C79A4B` | Property: Sudah DP |
| `--status-occupied`| `#A8645A` | Property: Sudah Ditempati |
| `--overlay` | `rgba(79,77,74,0.45)` | Photo text overlay |
| `--overlay-indigo` | `rgba(22,44,116,0.45)` | Properti hero overlay |

### Section Accents & Backgrounds
- **Busana (Fashion):** Accent `--charcoal`, Background `--white` / `--surface`
- **Properti (Hospitality & Living):** Accent `--indigo`, Background `--sand` / `--white`
- **Katering (Perjamuan & Events):** Accent `--caramel-deep`, Background `--surface` / `--white`

---

## 2. Typography

- **Display Headings:** `Cormorant Garamond` light (weight 300), `clamp(3rem, 8vw, 7rem) / 1.02`
- **Section Titles:** `Cormorant Garamond` light, `clamp(2.25rem, 4.5vw, 3.75rem)`
- **Body:** `Jost` 300/400, `1.0625rem / 1.7`, `max-width: 58ch`
- **Labels & Nav:** `Jost` 400, `12px` uppercase, `tracking: 0.18em` (nav tracking 0.14em)

---

## 3. Shape, Borders & Spacing

- **Border-radius:** `2px` standard UI, `4px` for cards. Only SALE badge/pill uses pill shape.
- **Borders:** `1px` solid `--line`.
- **Shadows & Gradients:** Strictly none, except sticky bid card & drawers. No glassmorphism.
- **Icons:** Thin `1.25px` line icons only (`lucide-react`). No emojis.
- **Spacing Scale:** `4`, `8`, `12`, `16`, `24`, `32`, `48`, `64`, `96`, `128`px only.
- **Container:** Max-width `1280px` with side padding `20px` (mobile), `32px` (tablet), `48px` (desktop).
- **Section Padding:** `80px` mobile, `128px` desktop.
- **Z-Index Scale:** Header: `40`, Drawer: `60`, Modal: `70`, Toast: `80`.

---

## 4. Stacked Chrome Hierarchy (Normal Flow)

1. **Admin Bar (40px):** Normal flow, `--indigo` bg, white text: "Mode Admin", Edit ON/OFF switch, "Dasbor", "Keluar". Shown only when logged in.
2. **Brand Tab Strip (40px):** White bg, 1px bottom `--line`. Tabs: Busana | Properti | Katering (12px uppercase). Active tab: `--charcoal` bg, white text. Inactive: ink on white.
3. **Announcement Bar (40px):** `--charcoal` bg, white 12px uppercase text, one line, ellipsis on mobile. Editable by admin.
4. **Header (72px / 60px mobile):** Sticky, solid white, 1px `--line` bottom border. CSS grid `minmax(0,1fr) auto minmax(0,1fr)`, gap 24px.
   - Left: wordmark REA MANDA in `--charcoal`, serif.
   - Centre (from 1100px): section-specific navigation (Busana, Properti, Katering).
   - Right: search, cart (with count badge), admin status icon.
   - Below 1100px: hamburger left, wordmark centred, icons right.

---

## 5. Scope Boundaries

- **In Scope:** 3 business lines (Busana, Properti, Katering), simple cart checkout, property inquiry/bidding, catering order inquiry, admin inline CRUD & dashboard, static WhatsApp direct link.
- **Out of Scope (strictly omitted):** External payment gateways, WhatsApp bot/API integration, dark mode toggles, chat widgets, loyalty points, customer registration/accounts, wishlist, floating widgets.
