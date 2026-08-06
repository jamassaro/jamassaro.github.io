# SEO Assets

## Open Graph Image (og-image.jpg)

**Current Status**: ⚠️ Placeholder reference in meta tags

**Required Specs**:

- **Recommended Size**: 1200x630px (Facebook/LinkedIn standard)
- **Minimum Size**: 600x315px
- **Aspect Ratio**: 1.91:1
- **Max File Size**: < 8MB
- **Format**: JPG or PNG

**Content Suggestions**:

1. Your name/title prominently displayed
2. Professional headshot or brand logo
3. Key tech stack icons (React, TypeScript, Python, etc.)
4. Professional color scheme matching your portfolio

**Tools to Create**:

- [Canva](https://www.canva.com/) - Free templates for OG images
- [Figma](https://www.figma.com/) - Design custom image
- [Placid.app](https://placid.app/) - Automated OG image generation
- [Bannerbear](https://www.bannerbear.com/) - Dynamic social images

**Quick Fix**:
Place your OG image at: `/public/og-image.jpg`

---

## Apple Touch Icon (apple-touch-icon.png)

**Required**: 180x180px PNG
**Location**: `/public/apple-touch-icon.png`

This is used when users add your site to their iOS home screen.

**Quick Creation**:

```bash
# If you have ImageMagick installed
convert your-logo.png -resize 180x180 apple-touch-icon.png
```

---

## Favicon

Currently using default Vite icon at `/public/vite.svg`

**To customize**:

1. Create a square logo/icon
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/) to generate all sizes
3. Replace `/public/vite.svg` with your custom icon
