# Rumoro — Design System Wireframe (v0.1)
Date: 2025-08-12
Scope: **Design-only wireframe** for theming and components. Screen-by-screen layouts will follow later.

---

## 1) Brand Direction (dating-app vibe)
- **Mood:** warm, bold, social, slightly romantic (coral/rose), energetic but safe.
- **Shape language:** rounded, soft edges, large pills, subtle depth.
- **Motion:** quick, delightful, never blocking (≤300ms for primary interactions).

---

## 2) Color System (Light & Dark)
> Accessible pairs target **WCAG AA** for body text. Use tonal steps for states.

### 2.1 Brand Palette (Rose/Coral)
- **Primary 700:** #C12A49 (pressed / dark surfaces)
- **Primary 600:** #E03A58 (primary on dark)
- **Primary 500:** #FF4D6D (brand)
- **Primary 400:** #FF6B86
- **Primary 100:** #FFE3E8 (tint on light)
- **Primary 050:** #FFF0F3 (subtle tint)

**Gradient (hero/large CTAs):** `linear( #FF6B6B → #FF3E8A )`

**Accent (Kashmir saffron nod):**
- **Accent 500:** #F4A261  (limited use: highlights, chips)
- **Accent 100:** #FFE8CE

### 2.2 Neutrals
- **Ink 900:** #111114  (titles)
- **Ink 800:** #1A1D24
- **Ink 700:** #2B2E3A  (body)
- **Muted 500:** #6B7280  (secondary text)
- **Line 300:** #E5E7EB  (dividers)
- **Surface 0:** #FFFFFF
- **Surface Alt:** #F8F9FB

### 2.3 Dark Theme
- **Surface D0:** #101114
- **Surface D1 (elevated):** #171821
- **Line D:** #2A2D34
- **Ink D (text):** #F5F6FA
- **Muted D:** #9CA3AF
- **Primary on Dark:** use **Primary 600 (#E03A58)** for filled elements; text/icons on brand = **#FFFFFF**

### 2.4 Semantics
- **Success:** #22C55E (on-success text: #062913)
- **Warning:** #F59E0B (on-warning text: #2A1500)
- **Danger:**  #EF4444 (on-danger text: #2A0909)
- **Info:**    #3B82F6 (on-info text: #0A1A33)

**Validation tints (light):** 100-level of each semantic + 10–12% opacity overlays.  
**Validation tints (dark):** use 700-level fills; keep text **Ink D** for legibility.

---

## 3) Typography
- **Display (brand):** Sora or Poppins (600–800)
- **UI text:** Inter (400/500/600)
- **Scale (px)**: H1 28/34 · H2 22/28 · H3 18/24 · Body 16/22 · Sub 14/20 · Caption 12/16
- **Letter-spacing:** default 0; tighten titles by −0.2 to −0.4 where needed.
- **Minimum touch text size:** 14px (Body).

---

## 4) Spacing, Grid, and Shape
- **Grid:** 8pt base; core paddings 16/24/32.
- **Touch target:** ≥ 44×44.
- **Radii:** 12 (cards), 16 (sheets), **999 (pills/chips)**, 28 (modal top corners).
- **Borders:** 1px Line 300 (light) / Line D (dark).

---

## 5) Elevation & Shadows
- **Depth 0:** none
- **Depth 1 (cards):** 0 2 8 (8% black) + border
- **Depth 2 (sheets, menus):** 0 6 20 (12% black)
- **Depth 3 (modals):** 0 10 32 (16% black)
- **Focus ring:** 2px **Primary 400** outer, no glow.

---

## 6) Motion Tokens
- **Durations:** Instant 90ms · Snappy 150ms · Base 200ms · Emphasized 250–300ms
- **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` (standard), `ease-out` for reveals, `ease-in` for exits.
- **Reduce Motion:** switch to opacity/translate ≤ 8px; remove overshoots.

---

## 7) Iconography & Illustration
- **Icons:** 2px stroke, rounded joins/caps, corner radii consistent with UI radius.
- **Sizes:** 20, 24 (standard), 28 (primary actions).
- **Empty-state art:** flat shapes with coral/rose + saffron accent; avoid skeuomorphism.

---

## 8) Component Wireframes (visual spec only)

### 8.1 Buttons
- **Primary (Filled):** bg **Primary 500** (light) / **Primary 600** (dark), text **#FFFFFF**  
  - Hover/Pressed: darken by ~8–12%  
  - Disabled: reduce alpha to 40%, text to 60%
- **Tonal (Filled Tint):** bg **Primary 100** (light) / **Primary 700@16%** (dark), text **Primary 700/400**
- **Outline:** 1px **Primary 400/600**, text same, bg transparent (pressed adds 8% brand tint)
- **Ghost/Text:** text **Primary 500/600**; pressed tint 8%
- **Icon Button:** 48×48, 12 radius, hit area 44×44

### 8.2 Chips
- **Channel Chip (filter):** pill 999, medium (36h), bg **Primary 050** (light) / **D1@8%** (dark), selected = **Primary 500** bg, text **#FFF**
- **Guideline Chip:** outline style; on tap shows tooltip

### 8.3 Inputs
- **Text Field:** 56h, 12 radius, 1px border Line 300; focus ring 2px **Primary 400**  
  - Helper/Errors: Muted 500 / Danger
- **Search Field:** leading icon, filled bg **Surface Alt**; clear “×”
- **OTP Cells:** 6× (44×56 each), focused cell ring 2px Primary 400

### 8.4 Avatars & Badges
- **Avatar:** 40/56/72; fallback with initials; optional saffron ring for claimed profiles
- **Badges:** Buzz badge (pill) bg **Primary 100**, text **Primary 700**

### 8.5 Cards
- **Profile Card:** Depth 1; avatar left; handle + platform badge; “View Profile” ghost button
- **Gossip Card:** handle + channel chip; excerpt (2–4 lines); actions row (Reply, Boost, Report)

### 8.6 Navigation
- **Top App Bar:** 56h, title center; search field variant on Home
- **Bottom Nav:** 5 items max, active = **Primary 500** icon/text; inactive = Muted 500
- **FAB:** 56 circle, **Primary 500**; shadow Depth 2

### 8.7 Surfaces & Overlays
- **Bottom Sheet:** 16 radius top; grabber; Depth 2; scrim 40–60% black
- **Dialog:** Depth 3; primary action emphasized; danger secondary when applicable
- **Toast/Snackbar:** bottom anchored, 12 radius; success/danger/info color bars (4px left)

### 8.8 Lists & States
- **Skeletons:** shimmer bars (Ink at 8–12% alpha), 12 radius
- **Empty State:** icon + one-liner + primary CTA; spacing 24–16–16
- **Error State:** icon (danger), one-liner, secondary CTA “Retry”
- **Offline Banner:** sticky at top; bg Warning 100; text Ink 900

### 8.9 Media
- **Image Thumb:** 12 radius; 1px border; remove EXIF indicator (shield icon)
- **Viewer:** full-bleed; swipe to dismiss; safe area paddings

---

## 9) Token Naming (prefix `--rm-`)
### 9.1 Colors
- `--rm-color-primary-050/100/400/500/600/700`
- `--rm-color-accent-100/500`
- `--rm-color-ink-700/900`, `--rm-color-muted-500`, `--rm-color-line-300`
- `--rm-surface-0`, `--rm-surface-alt`, `--rm-surface-d0/d1`
- `--rm-sem-success/warn/danger/info`
- `--rm-on-primary`, `--rm-on-surface`, `--rm-on-success`…

### 9.2 Size & Space
- `--rm-radius-12/16/28/999`
- `--rm-space-4/8/12/16/24/32/40`
- `--rm-size-icon-20/24/28`
- `--rm-elevation-0/1/2/3`

### 9.3 Type
- `--rm-font-display`, `--rm-font-ui`
- `--rm-font-h1/h2/h3/body/sub/caption` (size/line-height pairs)

### 9.4 Motion
- `--rm-motion-fast-90`, `--rm-motion-150`, `--rm-motion-200`, `--rm-motion-300`
- `--rm-ease-standard`, `--rm-ease-out`, `--rm-ease-in`

---

## 10) Accessibility Rules
- Body text contrast ≥ 4.5:1; large titles ≥ 3:1
- Hit targets ≥ 44×44; list rows ≥ 52h
- Focus visible for keyboard/tab navigation
- Reduced Motion honored via OS setting

---

## 11) Implementation Hints (non-binding)
- **CSS variables (web):**
```css
:root {
  --rm-color-primary-500: #FF4D6D;
  --rm-color-primary-600: #E03A58;
  --rm-color-primary-700: #C12A49;
  --rm-color-primary-100: #FFE3E8;
  --rm-color-primary-050: #FFF0F3;
  --rm-color-accent-500: #F4A261;
  --rm-surface-0: #FFFFFF;
  --rm-ink-900: #111114;
  --rm-muted-500: #6B7280;
  --rm-line-300: #E5E7EB;
}
```
- **React Native tokens:** central `tokens.ts` export with light/dark maps; use theming context to swap.

---

## 12) What’s next
- I’ll take your calls on **component shapes** (e.g., extra-rounded vs standard), **chip density**, and **button tone balance**.  
- Once approved, I’ll apply these tokens to **screen wireframes** (Profile, Compose, Gossip Detail, etc.).
