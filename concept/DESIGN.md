# Design System: The Kinetic Precision

## 1. Overview & Creative North Star

### Creative North Star: "The Neon Monolith"
This design system is anchored in the concept of **Kinetic Precision**. It is a celebration of the intersection between raw, atmospheric textures and razor-sharp digital execution. Unlike standard tech interfaces that rely on flat grids and safety-blue palettes, this system utilizes a "High-End Editorial" approach. 

We break the "template" look through **intentional asymmetry** and **overlapping depth**. Content is not just placed; it is curated within a dark, cinematic space where light (the Lime Primary) acts as a physical force. Expect massive typography scales contrasted against micro-labels, and layered glass surfaces that feel like a physical stack of futuristic hardware.

---

## 2. Colors

The color palette is built on a foundation of "Absolute Obsidian" depth, contrasted with a "Bio-Digital" lime that commands immediate attention.

### Color Tokens
*   **Background (`surface`):** `#131313` — A deep, charcoal-black. Apply a subtle grain/noise texture overlay at 3% opacity to provide "soul" and prevent "OLED smearing."
*   **Primary Accent (`primary_fixed`):** `#B6FF33` (Lime) — Used sparingly for high-impact CTAs, active states, and focal points.
*   **Tonal Neutrals:**
    *   `surface_container_lowest`: `#0e0e0e` (Deepest wells)
    *   `surface_container_low`: `#1c1b1b` (Standard background sections)
    *   `surface_container_high`: `#2a2a2a` (Floating cards)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning or layout containment. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting directly on a `surface` background.
2.  **Tonal Transitions:** Using the gradient `primary` to `primary_container` for focal elements.
3.  **Vertical White Space:** Using the `20` (5rem) or `24` (6rem) spacing tokens to create logical breaks.

### The "Glass & Gradient" Rule
For premium components, use **Glassmorphism**. Apply `surface_variant` with a 40%–60% opacity and a `backdrop-filter: blur(20px)`. This allows the "neon glow" from background elements to bleed through, creating a fluid, integrated feel.

---

## 3. Typography

The typography strategy leverages **Aeonik** for its geometric authority and **Inter** for its technical precision.

*   **Display Scale (`display-lg`):** 3.5rem. Use for hero headers. Set with tight letter-spacing (-0.04em) and `bold` weight. This is the "Architectural" layer of the UI.
*   **Headline Scale (`headline-md`):** 1.75rem. For section titles. These should feel authoritative but breathable.
*   **Body Scale (`body-lg`):** 1rem. All long-form text. The high contrast of `on_background` (#e5e2e1) against the dark surface ensures elite readability.
*   **The Technical Label (`label-md`):** 0.75rem. Use for metadata or the "language switcher." These should be all-caps with generous letter-spacing (+0.1em) to mimic high-end technical readouts.

---

## 4. Elevation & Depth

We reject traditional shadows in favor of **Tonal Layering** and **Atmospheric Glow**.

*   **The Layering Principle:** Depth is achieved by stacking surface tiers. A `surface_container_highest` card (#353534) should sit on a `surface_container_low` section (#1c1b1b). This creates a soft, natural lift.
*   **Ambient Glows:** Instead of grey drop shadows, use **Tinted Ambient Glows**. For floating Lime elements, use a shadow of `#B6FF33` at 15% opacity with a 40px blur. This mimics the light emission seen in the "Envelope Back" reference image.
*   **The Ghost Border Fallback:** If a container requires a border for accessibility, use the `outline_variant` token at **15% opacity**. It should feel like a suggestion of an edge, not a hard line.
*   **Neumorphism Light-Source:** For subtle depth on dark surfaces, use a dual-shadow approach: one shadow slightly darker than the surface (`#000000` at 40%) and one slightly lighter highlight on the opposite edge (`#ffffff` at 5%) to create a "molded" hardware feel.

---

## 5. Components

### Primary Buttons (The "Glow" Button)
*   **Style:** Filled with `primary_fixed` (#B6FF33). 
*   **Effect:** A soft outer glow using the Primary color at 20% opacity. 
*   **Typography:** `label-md` in `on_primary_fixed` (Deep Black).
*   **Corner:** `xl` (0.75rem) for a modern, fluid feel.

### Glass Cards
*   **Background:** Semi-transparent `surface_container_high` with `backdrop-blur: 16px`.
*   **Border:** Top-left "Ghost Border" (1px white at 10% opacity) to catch the light, mimicking a glass edge.
*   **Hierarchy:** Never use dividers inside cards. Use Spacing Scale `4` (1rem) to separate header from content.

### Language Switcher (The "Sleek Selector")
*   **Design:** A minimalist pill using `rounded-full`. 
*   **Inactive State:** Ghost typography (40% opacity).
*   **Active State:** A small `primary_fixed` dot next to the text, rather than a background change, to maintain sophistication.

### Checkboxes & Radios
*   **Design:** Forgo the standard box. Use a circular "hollow ring" for unchecked and a "solid glowing core" for checked. The movement between states should feel like a machine powering on.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts. Let a headline bleed off the grid or overlap a glass card.
*   **Do** apply the subtle grain texture to the background to give the dark space "weight."
*   **Do** use the `primary_fixed` Lime color for "micro-moments"—a single arrow, a loading bar, or a tiny notification dot.

### Don't:
*   **Don't** use 100% opaque white for body text. Use `on_surface` (#e5e2e1) to prevent eye strain against the black.
*   **Don't** use standard 1px borders. If you feel the need for a line, try a background color shift first.
*   **Don't** clutter the screen. High-end design is defined by what you leave out. Use the `24` (6rem) spacing token generously between major sections.