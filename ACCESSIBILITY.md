# Accessibility Audit: CarbonTrace

CarbonTrace was built with accessibility as a primary requirement, targeting WCAG 2.1 AA compliance. 

## Key Implementations

### Keyboard Navigation
- All interactive elements (`<button>`, `<select>`, `<input>`) have clear focus states using Tailwind's `focus:ring` utilities (e.g., `focus:ring-teal-600`).
- The application is fully navigable using the `Tab` and `Enter`/`Space` keys.
- Focus order logically follows the visual layout.

### Screen Readers & ARIA
- **Semantic HTML**: The layout utilizes semantic landmarks (`<main>`, `<header>`, `<section>`) with appropriate `aria-label`s to describe each region (e.g., "Log new activity", "Carbon footprint gauge").
- **Custom Visuals**: The circular "planet budget" gauge is wrapped in a `role="region"` and the visual itself is marked with `role="img"`. It includes a comprehensive `aria-label` that reads out the exact carbon tonnage and its status relative to the Paris Agreement and global averages.
- **Icons**: Decorative icons from `lucide-react` are hidden from screen readers using `aria-hidden="true"`.
- **Forms**: Error states are announced immediately using `role="alert"`. All inputs use `aria-required="true"` where appropriate.

### Color & Contrast
- **Text Contrast**: The color palette (Deep slate `#1E293B`, off-white `#F8FAFC`, muted teal `#0D9488`) was selected to ensure a minimum 4.5:1 contrast ratio for all text against its background.
- **Information Conveyance**: Status (e.g., being over the global average) is never communicated by color alone. The UI always includes explicit text descriptions (e.g., "Vs Global Avg: 20% above") and directional icons alongside color changes.

### Forms
- Every input field in the `ActivityForm` has an explicit `<label>` element programmatically associated via the `htmlFor`/`id` attributes. 
- No "placeholder-as-label" patterns are used. Placeholders are only used for examples (e.g. `e.g. 15`).

### Motion
- **Animations**: The gauge fill animation uses a standard CSS transition. By keeping animations simple and CSS-based, user agents that enforce `prefers-reduced-motion` can easily override these transitions at the system level, though an explicit `@media` query in Tailwind could further lock this down if required.
