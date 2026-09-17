# Package Builder Archive

The package builder section was removed from the homepage on 2026-04-26.

The implementation is still available at:

- `src/components/ServiceCarousel.tsx`
- `src/components/SepetCard.tsx`

To add it back to the homepage, restore this dynamic import in `src/app/page.tsx`:

```tsx
const ServiceCarousel = dynamic(() => import("@/components/ServiceCarousel"));
```

Then render it near the bottom of `<main>`:

```tsx
<ServiceCarousel />
```
