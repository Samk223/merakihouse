# Meraki House Workspace Guidelines

All code, design, styling, and copy generated within this workspace must reflect the **Meraki House** premium bohemian brand language.

---

## 1. Brand Aesthetics & Visual Language

### Target Vibe (Modern Bohemian, Soft Luxury)
- **Bohemian & Organic**: Use warm neutrals, curved interfaces, soft shadows, and nature-inspired motifs.
- **Calm & Editorial**: Spacing should feel airy and expansive, mimicking a high-end boutique lookbook.
- **Feminine & Inclusive**: Soft rose, lavender, and mauve tones that feel luxurious, premium, and welcoming to all.
- **Handmade & Boutique**: Subtle visual details (tactile card elevations, soft borders) that suggest items are thoughtfully crafted by hand.

### Avoid Corporate & Cold Patterns
- **No Sharp/Clinical Interfaces**: Avoid default Material UI, flat blue bootstrap buttons, or cold sharp-edged blocks.
- **No Enterprise Software Bloat**: Keep layouts clean and focused on high-quality editorial imagery.

---

## 2. Animation & Interaction Language

- **Natural Motion**: Use smooth, custom easing curves like `cubic-bezier(0.3, 0, 0, 1)` (emphasized) rather than sudden, robotic CSS transitions.
- **Subtle Moments of Delight**:
  - **Hover Lift**: Apply gentle upward translations (e.g., `translateY(-4px)`) and soft shadow growth on cards.
  - **Tactile Press**: Shrink buttons slightly (e.g., `scale(0.96)`) on mouse click/active states.
  - **Focus Rings**: Ensure keyboard navigation rings are rounded and colored with the primary brand rose-gold color.
- **Reduced Motion Respect**: Always support `@media (prefers-reduced-motion: reduce)` to disable transitions for accessibility.

---

## 3. UI Element Standards

- **Rounded Borders**: Prefer soft corners (`--radius-medium: 12px`, `--radius-large: 16px`).
- **Tactile Shadows**: Shadows should be light, warm, and highly diffused (e.g., `rgba(40, 39, 63, 0.04)`).
- **Welcoming Forms**: Input borders should transition smoothly from neutral borders to a warm rose-gold focus ring.
