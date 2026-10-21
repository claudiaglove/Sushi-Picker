# Design tokens

Extracted from the Figma file "Restaurant Journal (Copy)" (file key `sVpieCKgZEjqzEcuvhFyCU`, canvas node `6:265`).
Read from 7 screens: Homepage, Log in, Create account, Empty journal, Entry detail, Journal list, New entry form.

Notes:

- The Figma file defines only 8 variables; the rest are raw values grouped and named here.
- `--color-success-variable` and `--color-neutral-tint` are Figma variables whose usage was not seen on any screen.
- The Components section was only read structurally, so no styles came from it.
- Values are desktop (1440px) designs. The file has no dark theme and no responsive values beyond a note that cards should stack on mobile.

```css
:root {
  /* ── Color ─────────────────────────────── */
  --color-bg: #faf7f2; /* page, nav, price-toggle track, upload dropzone */
  --color-surface: #ffffff; /* cards, inputs */
  --color-border: #e6dfd6; /* "Eggshell": nav, inputs, cards, footer, dividers */
  --color-text: #2d1b14; /* headings, body, avatar, "Sign Up" button, snackbar, FAB */
  --color-text-muted: #6b5a52; /* "Faded brown": secondary text, labels, placeholders */
  --color-primary: #bc592d; /* "Orange": CTAs, links, tab underline, badges, selected card border */
  --color-on-primary: #ffffff;
  --color-accent-gold: #e29e4b; /* "Gold" (star rating) */
  --color-success: #00875a; /* "Yes, definitely" */
  --color-success-variable: #007113; /* variable color/green/22 (usage not seen) */
  --color-star-muted: #525252; /* variable star/muted */
  --color-neutral-tint: #e5e3df; /* variable color/orange/89 (usage not seen) */
  --color-overlay-light: rgba(255, 255, 255, 0.8); /* photo "remove" button */
  --color-overlay-track: rgba(255, 255, 255, 0.2); /* snackbar progress track */

  /* ── Shadows ───────────────────────────── */
  --shadow-card: 0 12px 20px rgba(45, 27, 20, 0.05); /* auth card */
  --shadow-fab: 0 8px 12px rgba(45, 27, 20, 0.25); /* "New Entry" pill */
  --shadow-fab-glow: 0 8px 12px rgba(209, 107, 61, 0.25); /* empty-state "+" button */
  --shadow-snackbar: 0 10px 24px -6px rgba(0, 0, 0, 0.15);

  /* ── Typography ────────────────────────── */
  --font-heading:
    'Playfair Display', serif; /* Bold 700; Regular 400 for empty-state heading and card quotes */
  --font-body: 'Inter', sans-serif; /* 400, 500, 600, 700; italic for review quote */

  --font-size-2xs: 10px; /* "New" badge */
  --font-size-xs: 12px; /* meta text, avatar initials, count pill */
  --font-size-sm: 13px; /* form labels, overline, footer, captions */
  --font-size-md: 14px; /* buttons, secondary text, breadcrumbs */
  --font-size-base: 15px; /* input text, detail values */
  --font-size-lg: 16px; /* tabs, link CTAs */
  --font-size-xl: 18px; /* hero subtext */
  --font-size-2xl: 20px; /* feature card titles */
  --font-size-3xl: 24px; /* wordmark, journal card title */
  --font-size-4xl: 32px; /* empty-state heading */
  --font-size-5xl: 48px; /* page titles */
  --font-size-display: 64px; /* hero heading */

  --line-height-normal: normal; /* most UI text */
  --line-height-tight: 1.1; /* 64px hero and 48px entry title */
  --line-height-heading: 1.2; /* wordmark on entry detail */
  --line-height-quote: 1.4; /* journal card quote */
  --line-height-compact: 1.5; /* card body (14px) */
  --line-height-relaxed: 1.6; /* hero subtext, entry detail values */

  /* ── Border radius ─────────────────────── */
  --radius-xs: 4px; /* "New" badge */
  --radius-sm: 6px; /* price-toggle option */
  --radius-md: 8px; /* buttons, inputs, thumbnails, dropzone */
  --radius-lg: 12px; /* snackbar, small photos */
  --radius-xl: 16px; /* cards */
  --radius-2xl: 24px; /* auth card, form card, hero photo */
  --radius-pill: 100px; /* count pill, "New Entry" button */
  --radius-circle: 50%; /* avatar (36px), FAB (80px), radio dots */

  /* ── Spacing ───────────────────────────── */
  --space-3xs: 2px;
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-md-plus: 20px; /* gap between form fields and inside feature cards */
  --space-lg: 24px;
  --space-xl: 32px; /* card padding, card grid gap */
  --space-xl-plus: 40px;
  --space-2xl: 48px; /* form/auth card padding, footer padding */
  --space-3xl: 64px; /* page side gutter, hero padding */
  --space-4xl: 80px;
  --space-5xl: 120px; /* login page vertical padding */
  --space-6xl: 160px; /* empty-state vertical padding */

  /* ── Layout and sizing ─────────────────── */
  --border-width: 1px;
  --border-width-strong: 2px; /* selected journal card, tab underline */
  --size-nav-height: 88px;
  --size-control-height: 48px; /* buttons and inputs */
  --size-control-height-sm: 40px; /* price toggle; search field is 44px */
  --size-avatar: 36px;
  --size-fab: 80px;
  --width-auth-card: 480px;
  --width-form: 720px;
  --width-hero-text: 800px;
  --width-detail: 900px;
  --width-snackbar: 380px;
  --size-journal-card-height: 240px; /* image column 240px wide */
  --canvas-width: 1440px;
}
```
