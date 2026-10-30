# Rheamanda — Design System Specification

> Brand: Rheamanda · Elegan, Tulus, dan Abadi
> Quiet editorial Indonesian fashion house, women's kost & catering perjamuan.
> Clean-slate UI redesign grounded in three reference aesthetics:
> 1. Busana: Modest editorial fashion house
> 2. Kost Eksklusif Wanita: D’Rhea Syariah Guest House
> 3. Katering: Modern Indonesian banquet, packages & dish menus

---

## 1. Colour Tokens (Light Only — Working Palette)

Current implemented values live in `src/styles/tokens.css`. Treat this as a proposed direction for client review, not an approved brand guide. Use CSS custom properties in components:

| Token | Value | Usage |
|---|---|---|
| `--white` | `#FFFEFB` | Header, cards, secondary panels |
| `--surface` | `#F5F0E8` | Warm page background |
| `--surface-2` | `#EBE4D8` | Fashion visual ground, image backs |
| `--sand` | `#DFD4C4` | Catering visual ground |
| `--line` | `#D6CBBA` | Hairline dividers, structural borders |
| `--ink` | `#2A241E` | Body text |
| `--charcoal` | `#1B1713` | Headings, active tabs, Busana section accent |
| `--muted` | `#5C554C` | Secondary text and metadata |
| `--caramel` | `#A67C42` | Warm decorative accent |
| `--caramel-deep`| `#7D5A28` | Accent text on light, Katering section accent |
| `--indigo` | `#2C353F` | Slate accent for Kost section and admin bar |
| `--sale` | `#7A3B45` | Sale badges and menu pill |
| `--status-available` | `#6A7A66` | Legacy property status: Tersedia |
| `--status-deposit` | `#B08A48` | Legacy property status: Sudah DP |
| `--status-occupied`| `#8A5C54` | Legacy property status: Sudah Ditempati |
| `--overlay` | `rgba(27,23,19,0.5)` | Photo text overlay |
| `--overlay-indigo` | `rgba(44,53,63,0.52)` | Slate photo overlay |

### Section Accents & Backgrounds
- **Busana (Fashion):** Accent `--charcoal`, Background `--white` / `--surface`
- **Kost Eksklusif Wanita (D’Rhea Syariah Guest House):** Slate accent `--indigo`, Background `--surface` / `--white`; display its light logo on slate
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
2. **Brand Tab Strip (40px):** White bg, 1px bottom `--line`. Tabs: Busana | Kost Eksklusif Wanita | Katering. Active tab: `--charcoal` bg, white text. Inactive: ink on white.
3. **Announcement Bar (40px):** `--charcoal` bg, white 12px uppercase text, one line, ellipsis on mobile. Editable by admin.
4. **Header (72px / 60px mobile):** Sticky, solid white, 1px `--line` bottom border. Flex layout with 24px minimum gaps on desktop.
   - Left: Rheamanda monogram and wordmark by default; on the Kost Wanita route, use the D’Rhea Syariah emblem and compact guest-house lockup instead.
   - Centre (from 1280px): section-specific navigation (Busana, Kost Wanita, Katering).
   - Right: search, cart (with count badge), admin status icon.
   - Below 1280px: hamburger left, route-specific logo centred, icons right.

---

## 5. Scope Boundaries

- **In Scope:** 3 business lines (Busana, Kost Eksklusif Wanita, Katering), simple cart checkout, informational kost page, catering order inquiry, admin dashboard, static WhatsApp direct link. Kost rates, facilities, location and availability require confirmed client data.
- **Out of Scope (strictly omitted):** External payment gateways, WhatsApp bot/API integration, dark mode toggles, chat widgets, loyalty points, customer registration/accounts, wishlist, floating widgets.
