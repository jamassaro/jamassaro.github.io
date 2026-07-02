# Mobile & Tablet Quick Reference

## 📱 Breakpoint Quick Reference

```css
/* Copy-paste breakpoint templates */

/* Large Desktop (1200px+) */
@media (min-width: 1200px) {
  /* Maximum spacing, full features */
}

/* Desktop (1024-1200px) */
@media (max-width: 1200px) {
  /* Standard desktop layout */
}

/* Tablet (1024px) */
@media (max-width: 1024px) {
  /* Balanced two-column or transitioning */
}

/* Small Tablet (900px) - LAYOUT SHIFT */
@media (max-width: 900px) {
  /* Architecture below chat, stacked */
}

/* Mobile (768px) */
@media (max-width: 768px) {
  /* Single column, touch-optimized */
}

/* Small Mobile (480px) */
@media (max-width: 480px) {
  /* Compact layout, maximum width usage */
}

/* Landscape Mobile */
@media (max-width: 900px) and (orientation: landscape) {
  /* Horizontal optimization */
}
```

---

## 🎯 Component Sizing Cheat Sheet

### AIAssistantSection
```css
/* Title Font Sizes */
Desktop:  36px
Tablet:   28px
Mobile:   22px
Small:    18px

/* Section Padding */
Desktop:  120px 0
Tablet:   80px 0
Mobile:   60px 0
Small:    48px 0

/* Grid Layout */
Desktop:   1fr 0.6fr
Tablet:    1fr 0.75fr
<900px:    1fr (stacked)
```

### AIChatWindow
```css
/* Header Padding */
Desktop:  20px 24px
Tablet:   18px 20px
Mobile:   14px 16px
Small:    12px 14px

/* Chat Height */
Desktop:  700px
Tablet:   650px → 600px
Mobile:   550px
Small:    500px
Landscape: 450px
```

### AIChatInput
```css
/* Button Height (Touch Targets) */
Desktop:  36px
Mobile:   44px (WCAG/iOS standard)

/* Button Layout */
Desktop:  flex-direction: row
Mobile:   flex-direction: column
Landscape: flex-direction: row (compact)

/* Input Font (iOS Zoom Prevention) */
Mobile:   16px minimum
```

### AIMessage
```css
/* Max Width */
Desktop User:      85%
Mobile User:       92%
Desktop Assistant: 90%
Mobile Assistant:  98%

/* Content Font */
Desktop:  14px
Tablet:   13px
Mobile:   12px
Small:    11px
```

### QuickPromptList
```css
/* Button Padding */
Desktop:  8px 16px
Tablet:   7px 15px
Mobile:   7px 12px
Landscape: 6px 12px

/* Font Size */
Desktop:  13px
Tablet:   12px
Mobile:   11px
```

### ArchitecturePanel
```css
/* Position */
Desktop:  position: sticky; top: 24px;
Tablet:   position: relative;
Mobile:   position: relative;

/* Title Font */
Desktop:  18px
Tablet:   17px
Mobile:   15px
Small:    14px

/* Padding */
Desktop:  24px
Tablet:   22px
Mobile:   18px
Small:    16px
```

---

## 🎨 Common Responsive Patterns

### Pattern 1: Font Scaling
```css
.title {
  font-size: 36px; /* Desktop base */
}

@media (max-width: 1024px) {
  .title { font-size: 32px; } /* -4px */
}

@media (max-width: 768px) {
  .title { font-size: 22px; } /* -14px */
}

@media (max-width: 480px) {
  .title { font-size: 18px; } /* -4px */
}
```

### Pattern 2: Padding Reduction
```css
.container {
  padding: 24px; /* Desktop base */
}

@media (max-width: 1024px) {
  .container { padding: 20px; } /* -4px */
}

@media (max-width: 768px) {
  .container { padding: 16px; } /* -4px */
}

@media (max-width: 480px) {
  .container { padding: 12px; } /* -4px */
}
```

### Pattern 3: Layout Shift
```css
.grid {
  display: grid;
  grid-template-columns: 1fr 0.6fr; /* Desktop */
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

### Pattern 4: Touch Optimization
```css
.button {
  height: 36px; /* Desktop */
}

@media (max-width: 768px) {
  .button {
    height: 44px; /* Touch-friendly */
    width: 100%; /* Full-width on mobile */
  }
}
```

### Pattern 5: Landscape Compact
```css
@media (max-width: 900px) and (orientation: landscape) {
  .container {
    padding: 8px; /* Compact vertical */
  }
  
  .element {
    margin-bottom: 8px; /* Reduced gaps */
  }
}
```

---

## 🚀 Quick Implementation Checklist

When adding new components:

### Layout
- [ ] Define base (desktop) styles first
- [ ] Add @media (max-width: 1024px) - tablet
- [ ] Add @media (max-width: 768px) - mobile
- [ ] Add @media (max-width: 480px) - small mobile
- [ ] Add landscape query if vertical space matters

### Typography
- [ ] Scale fonts down 10-20% per breakpoint
- [ ] Minimum 11px font size (readability)
- [ ] Use 16px on inputs (prevent iOS zoom)
- [ ] Adjust line-heights for mobile (1.4-1.5)

### Spacing
- [ ] Reduce padding 15-25% per breakpoint
- [ ] Maintain minimum 8px gaps
- [ ] Use 44px touch targets on mobile
- [ ] Test with extreme content lengths

### Touch
- [ ] Buttons minimum 44px height on mobile
- [ ] Gap between buttons minimum 8px
- [ ] Full-width buttons on mobile (optional)
- [ ] Remove hover states for touch devices

### Performance
- [ ] Use transform for animations (GPU)
- [ ] Add -webkit-overflow-scrolling: touch
- [ ] Minimize repaints (contain property)
- [ ] Test on slower devices

---

## 📐 Golden Ratios

### Font Size Reduction
- **Large breakpoint**: -10% to -15%
- **Medium breakpoint**: -25% to -35%
- **Small breakpoint**: -40% to -50%

### Padding Reduction
- **Large breakpoint**: -15% to -20%
- **Medium breakpoint**: -30% to -35%
- **Small breakpoint**: -40% to -50%

### Touch Targets
- **Minimum**: 44x44px (iOS/WCAG)
- **Recommended**: 48x48px (Material Design)
- **Optimal**: 44-56px (comfort zone)

### Gap Spacing
- **Desktop**: 16-24px
- **Tablet**: 12-18px
- **Mobile**: 8-12px

---

## 🎯 Device Testing Shortcuts

### Chrome DevTools
```
Cmd/Ctrl + Shift + M - Toggle device toolbar
Cmd/Ctrl + Shift + R - Rotate device
```

### Common Test Sizes
```
iPhone SE:       375 x 667
iPhone 12:       390 x 844
iPhone 14 Pro:   430 x 932
iPad Mini:       768 x 1024
iPad Pro:       1024 x 1366
Galaxy S21:      360 x 800
Pixel 5:         393 x 851
```

### Quick Test Script
```bash
# Open in browser and test responsive
npm run dev

# Then in browser:
# 1. Open DevTools (F12)
# 2. Toggle device mode (Cmd+Shift+M)
# 3. Select device from dropdown
# 4. Test portrait and landscape
```

---

## 🔍 Common Issues & Fixes

### Issue: Horizontal scroll on mobile
```css
/* Fix: Add to container */
max-width: 100%;
overflow-x: hidden;
```

### Issue: Buttons too small on mobile
```css
/* Fix: Ensure minimum touch targets */
@media (max-width: 768px) {
  .button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Issue: iOS zooms on input focus
```css
/* Fix: Increase font size */
input, textarea {
  font-size: 16px; /* Minimum to prevent zoom */
}
```

### Issue: Landscape height cramped
```css
/* Fix: Add landscape query */
@media (max-width: 900px) and (orientation: landscape) {
  .container {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
```

### Issue: Text overflow
```css
/* Fix: Add ellipsis */
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
```

---

## 💡 Pro Tips

1. **Mobile First**: Write mobile styles first, enhance for desktop
2. **Touch Targets**: Always ≥44px on mobile
3. **Font Size**: Never below 11px (readability)
4. **Input Size**: 16px prevents iOS zoom
5. **Test Real Devices**: Simulators miss issues
6. **Use Transform**: GPU-accelerated animations
7. **Reduce Motion**: Respect prefers-reduced-motion
8. **Landscape Matters**: Don't forget orientation
9. **Safe Area**: Use env() for notch/home indicator
10. **Performance**: Minimize repaints on scroll

---

## 📱 Quick Debug Commands

```bash
# Count mobile breakpoints
grep -r "@media.*768px" src/features/ai-assistant/ | wc -l

# Find landscape queries
grep -r "orientation: landscape" src/features/ai-assistant/

# Check touch target sizes (should be ≥44px)
grep -r "height:.*44px\|min-height:.*44px" src/features/ai-assistant/

# Find font size ranges
grep -r "font-size:" src/features/ai-assistant/ | sort | uniq

# Check all breakpoints
grep -r "@media" src/features/ai-assistant/ | grep -o "max-width: [0-9]*px" | sort | uniq
```

---

**Quick Reference Complete** 📱✨

Keep this handy when adding new responsive components!
