# Back to Home Button Enhancement Plan

## Task
Improve the "Back to Home" buttons across all pages to make them look better and more visually appealing.

## Files to Update
- [ ] src/app/search-results/page.tsx
- [ ] src/app/pharmacy-login/page.tsx  
- [ ] src/app/pharmacyregistration/page.tsx
- [ ] src/app/pharmacydashboard/page.tsx

## Enhancements to Implement
1. Add Home icon (HomeIcon from @mui/icons-material)
2. Add gradient background with glow effect
3. Add smooth hover animations (scale + shadow + color transition)
4. Add ripple effect on click
5. Add floating animation
6. Make consistent across all pages

## Current Button Styles Found:
- search-results: variant="contained", teal bg, basic hover
- pharmacy-login: variant="outlined", teal border, hover fill
- pharmacyregistration: variant="outlined", minimal styling
- pharmacydashboard: variant="outlined", hover scale + shadow

## New Enhanced Style:
- Gradient background (teal to blue)
- Glow effect on hover
- Scale up on hover (1.05)
- Enhanced shadow
- Home icon
- Smooth transitions (0.3s)
- Border radius: 8px
