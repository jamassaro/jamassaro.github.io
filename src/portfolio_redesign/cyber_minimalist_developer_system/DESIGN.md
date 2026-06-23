---
name: Cyber-Minimalist Developer System
colors:
  surface: '#111318'
  surface-dim: '#111318'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#b9caca'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#fcf8ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#dbdaff'
  on-tertiary-container: '#4c4ed9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#111318'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  display:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 120px
  card-padding: 32px
---

## Brand & Style

The design system is engineered for a high-end software engineering portfolio. It blends the raw, technical aesthetic of a terminal with the sophisticated polish of modern SaaS products. The brand personality is precise, innovative, and deeply technical, evoking a sense of "premium craftsmanship" in code.

The visual direction utilizes a **Neo-Brutalist-Glassmorphism** hybrid:
- **Dark-First:** A deep, layered dark theme that reduces eye strain and emphasizes technical content.
- **Coder Aesthetic:** Monospaced typography for data and labels to honor the developer's medium.
- **Subtle Glows:** High-contrast neon accents (cyan and emerald) used sparingly to guide the eye and signify interactive elements.
- **Structured Precision:** A rigid grid system that communicates architectural thinking and organizational clarity.

## Colors

This design system utilizes a "Deep Space" palette to provide maximum contrast for neon accents. 

- **Primary (Cyan):** Used for primary actions, active states, and critical data highlights.
- **Secondary (Emerald):** Reserved for success states, "live" project indicators, and secondary technical tags.
- **Neutrals:** A scale of cool-toned grays and blacks. The background is near-black to allow glass effects to pop.
- **Accents:** Neon colors should be used with a 5-10% distribution to maintain a professional, rather than "gamer," aesthetic.
- **Glows:** Primary and secondary colors are used in low-opacity (10-20%) blurs for border "auras" around active cards.

## Typography

The typography strategy leverages three distinct fonts to separate concerns:
- **Geist** provides a sharp, technical feel for headlines, emphasizing modern engineering.
- **Inter** ensures long-form project descriptions remain highly readable and accessible.
- **JetBrains Mono** is used for all technical metadata, tags, and small labels to reinforce the "coder" identity.

Large display type should use tight letter spacing, while mono labels should use increased tracking for legibility at small sizes.

## Layout & Spacing

The design system follows a **12-column fixed-width grid** for desktop, transitioning to a fluid single-column layout for mobile. 

- **Rhythm:** All spacing is based on a 4px baseline unit. 
- **Sectioning:** Deep vertical breathing room (120px+) is used between major portfolio sections to allow the dark aesthetic to feel "expansive" rather than cramped.
- **Alignment:** Content follows a strict left-aligned axis to mirror the structure of a code editor.
- **Grid Discipline:** Elements should snap to the grid. Avoid centering text in large sections; maintain a strong vertical line on the left margin.

## Elevation & Depth

Depth in this system is achieved through light and transparency rather than traditional soft shadows.

1.  **Glassmorphism Level 1:** Cards use a `rgba(255, 255, 255, 0.03)` fill with a `blur(12px)`.
2.  **Edge Treatment:** All "elevated" surfaces must have a 1px solid border at `rgba(255, 255, 255, 0.1)`. 
3.  **Accent Glows:** Interactive cards utilize a secondary "outer glow" on hover—a 1px primary-colored border with a 15px `box-shadow` of the same color at 20% opacity.
4.  **Tonal Stacking:** The main background is the darkest point. Each successive layer (cards, modals) becomes slightly lighter and more neutral.

## Shapes

The shape language is **Soft-Geometric**. We avoid "Pill" shapes for structural elements to maintain a professional, architectural feel.

- **Primary Elements:** 0.25rem (4px) radius for a "precision-tooled" look.
- **Cards/Containers:** 0.5rem (8px) radius for a slightly softer frame around content.
- **Interactive Triggers:** Small buttons and tags use the 4px radius. 
- **Icons:** Use sharp or slightly rounded line-art icons (2px stroke) to match the monospaced technical aesthetic.

## Components

### Buttons
- **Primary:** Solid Cyan background, black text (Geist Bold). No shadow, sharp hover state (slight brightness increase).
- **Secondary:** Transparent with a 1px border. On hover, the border glows and a 5% primary color overlay appears.

### Cards (Project/Experience)
- Subtle glass background.
- Top-left alignment for titles.
- Bottom-left placement for technical tags (JetBrains Mono).
- Use a "terminal" header style (three small dots in the top corner) as a stylistic decorative element.

### Tags / Chips
- Small, uppercase, monospaced text.
- Dark gray background with a subtle border color that matches the language category (e.g., blue for React, green for Node).

### Input Fields
- Underline-only or dark-filled with no top/side borders.
- Active state transitions the underline to a Primary Cyan glow.

### Navigation
- Minimalist top bar or a fixed-position side-rail.
- Use "Index" numbering (e.g., 01_Work, 02_About) to lean into the technical theme.