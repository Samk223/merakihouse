# 03_Design_System.md

# Meraki House Design System

**Version:** 1.0

---

# 1. Design Philosophy

Meraki House follows a **Modern Minimal Bohemian** design language.

Every interface should feel:

* Calm
* Organic
* Premium
* Minimal
* Spacious
* Elegant

The interface should never feel crowded.

Whitespace is considered a design element.

---

# 2. Grid System

Desktop Container

```text
1440px
```

Content Width

```text
1280px
```

Container Padding

```text
32px
```

Mobile Padding

```text
20px
```

Maximum Content Width

```text
1280px
```

---

# 3. Spacing Scale

Always use consistent spacing.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
120px
```

Never use random spacing values.

---

# 4. Border Radius

Use only these values.

```text
Small      8px

Medium    16px

Large     24px

Extra      32px
```

---

# 5. Shadows

Soft Shadow

```css
0 8px 30px rgba(0,0,0,.08)
```

Large Shadow

```css
0 18px 50px rgba(0,0,0,.12)
```

Never use harsh shadows.

---

# 6. Buttons

Only four button types are allowed.

---

## Primary Button

Purpose

Primary Call To Action

Examples

* Shop Now
* Buy Now
* Checkout

Style

Filled

Rounded XL

Soft Shadow

---

## Secondary Button

Purpose

Alternative Action

Examples

* Learn More
* View Collection

Style

Outlined

Transparent Background

---

## Ghost Button

Purpose

Secondary UI actions

Examples

* Wishlist
* Cancel

No background.

---

## Icon Button

Circular

Contains only an icon.

Examples

* Cart

* Search

* Wishlist

* Profile

---

# 7. Cards

Every card should have

* Rounded corners
* Large padding
* Soft shadow
* White background
* Smooth hover animation

Card Types

* Product Card
* Category Card
* Review Card
* Feature Card
* Blog Card

---

# 8. Product Card

Contains

* Product Image
* Product Name
* Category
* Price
* Rating
* Wishlist Button
* Buy Button

Hover

* Slight scale
* Shadow increase
* Image zoom

---

# 9. Category Card

Contains

* Category Image
* Category Name

Hover

* Image zoom
* Overlay fade

---

# 10. Navbar

Contains

Logo

Navigation

Search

Wishlist

Cart

Profile

Desktop

Horizontal

Mobile

Hamburger Drawer

Sticky on scroll

---

# 11. Footer

Contains

Brand

Quick Links

Policies

Contact

Social Icons

Newsletter

---

# 12. Forms

Rounded Inputs

Large Padding

Soft Border

Minimal Labels

No heavy outlines

---

# 13. Input Fields

Border Radius

16px

Focus

Brand Color

Placeholder

Muted Grey

---

# 14. Drawer

Used for

Cart

Filters

Quick View

Wishlist

Slide from right

Overlay background

---

# 15. Modal

Rounded

Blur Background

Centered

Large Padding

---

# 16. Accordion

Used for

FAQs

Product Information

Shipping Policy

---

# 17. Tabs

Used for

Product Details

Reviews

Ingredients

Directions

---

# 18. Badge

Examples

Organic

Cruelty Free

New

Best Seller

Limited

Rounded Pill

Small

---

# 19. Chips

Used for

Filters

Selected Categories

Ingredients

---

# 20. Hero Section

Contains

Headline

Description

CTA

Image

Video

Never cluttered.

---

# 21. Homepage Sections

Navbar

Announcement Bar

Hero

Featured Categories

Why Choose Us

Featured Collection

Category Showcase

Best Sellers

Brand Story

Reviews

Instagram

Newsletter

Footer

---

# 22. Icons

Source

The Noun Project

Rules

Outline Only

Thin Stroke

Rounded

Consistent Size

SVG Only

---

# 23. Illustrations

Organic

Minimal

Hand Drawn

Warm Palette

---

# 24. Photography

Natural Lighting

Minimal Props

Neutral Background

Organic Materials

Wood

Stone

Cotton

Plants

---

# 25. Animations

Duration

200ms

350ms

500ms

Preferred

Fade

Scale

Slide

Avoid

Bounce

Shake

Flash

---

# 26. Responsive Breakpoints

Mobile

<768px

Tablet

768–1023px

Laptop

1024–1439px

Desktop

≥1440px

---

# 27. Accessibility

Minimum touch target

44px

Keyboard Navigation

Required

Alt Text

Required

ARIA Labels

Required where applicable

Color Contrast

WCAG AA compliant

---

# 28. Component Reusability

Every component should:

* Accept props
* Be reusable
* Avoid duplicated styles
* Keep business logic separate from presentation

---

# 29. Naming Convention

Components

PascalCase

Pages

PascalCase

Hooks

camelCase with `use`

Files

Match component names

CSS

Global styles only in `/styles`

---

# 30. Final Principle

Every new page should be assembled from reusable components instead of creating one-off designs.

If a UI pattern appears more than once, convert it into a reusable component before continuing development.
