# Tailwind + Alpine.js + Nunjucks + Eleventy Template

A production-ready starter template for building fast, modern marketing websites and landing pages.

## Stack

- **Eleventy 3** - Static site generator
- **Tailwind CSS 4** - Utility-first CSS framework
- **Alpine.js 3.x** - Lightweight JavaScript framework (CSP build, self-hosted)
- **Eleventy** - Templating engine
- **Eleventy Image** - Automatic image optimization

## Features

✅ Design token system with JSON configuration  
✅ Multilingual support out of the box  
✅ Automatic image optimization (AVIF, WebP)  
✅ Responsive header: mobile menu, current-page highlight, language switcher  
✅ Dark mode with header toggle (follows system setting until changed)  
✅ Legal notice and privacy policy page shells, linked from the footer  
✅ SEO optimized: canonical, Open Graph, hreflang, JSON-LD, sitemap, robots.txt  
✅ Localized 404 pages  
✅ Favicons generated at build time  
✅ Optional Apache `.htaccess` with security headers and caching  
✅ Performance optimized (95+ Lighthouse scores)  
✅ Accessible HTML5 semantic markup  
✅ Blog-ready with post collections  
✅ Component-based architecture  
✅ Coding agent ready setup

## Quick Start

### 1. Create New Project

```bash
# Using degit (recommended - fastest)
npx degit davidmarcombes/tane-template my-new-site
# Equivalent to: npx degit github:davidmarcombes/tane-template my-new-site
cd my-new-site

# Or using git clone  this will keep the git history)
git clone https://github.com/davidmarcombes/tane-template.git my-new-site
cd my-new-site
rm -rf .git
git init
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your Project

#### Option A: Quick Setup (Recommended)

```bash
npm run init
```

This interactive script will:
- Prompt for site name, client name, and brand colors
- Update configuration files automatically
- Set up your project in minutes

#### Option B: Manual Setup

***Update the following files:**

- `SITE.md` (project-specific documentation for agents)
- `src/_data/site.json` (site metadata)
- `src/_data/navigation.json` (menu structure)
- `design-tokens.json` (design system source of truth)

Check configuration:

```bash
npm run validate
```

Notes: `npm run validate` will scan the repo for common placeholder values. It treats placeholders in configuration files (e.g., `SITE.md` and files in `src/_data/`) as critical and exits with an error when they are present. Placeholders in documentation or example content are reported as warnings only.

### Generate Tailwind Theme

```bash
npm run tokens
```

This generates `src/css/theme.css` (a Tailwind v4 `@theme` block) from your design tokens.

### Start Development

```bash
npm run dev
```

Site will be available at `http://localhost:8080` with live reload.

## Project Structure

```
project-root/
├── AGENTS.md              # AI assistant instructions (generic)
├── SITE.md                # Project-specific documentation
├── design-tokens.json     # Design system source of truth
├── eleventy.config.js     # Eleventy configuration (ESM)
├── package.json
│
└── src/
    ├── _data/             # Global data
    │   ├── site.json      # Site metadata
    │   ├── navigation.json # Menu structure
    │   └── i18n.json      # UI strings per language
    │
    ├── _layouts/          # Page templates
    │   ├── base.njk       # Base HTML (SEO, header, footer)
    │   ├── home.njk       # Homepage layout
    │   ├── page.njk       # Standard page layout
    │   ├── post.njk       # Blog post layout
    │   ├── blog.njk       # Blog listing layout
    │   └── not-found.njk  # 404 page layout
    │
    ├── _includes/         # Reusable components
    │   ├── components/    # UI components
    │   ├── sections/      # Page sections
    │   └── partials/      # SEO tags, structured data
    │
    ├── css/
    │   ├── input.css      # Tailwind + custom styles
    │   └── theme.css      # Generated from design tokens (git ignored)
    │
    ├── assets/
    │   ├── images/
    │   └── fonts/
    │
    └── en/                # English content
        ├── en.json        # Language config
        ├── index.md       # Homepage
        ├── about.md
        ├── services.md
        ├── contact.md
        ├── blog.md
        ├── legal.md       # Legal notice
        ├── privacy.md     # Privacy policy
        ├── 404.md
        └── posts/         # Blog posts (URL: /en/blog/slug/)
```

## Essential Commands

```bash
npm run dev          # Development server with live reload
npm run build        # Production build
npm run clean        # Remove _site/ directory
npm run tokens       # Generate Tailwind theme from design tokens
npm run init         # Initialize new project (interactive)
npm run validate     # Validate configuration
```

## Documentation for AI Assistants

This template includes documentation for AI coding assistants:

- **`AGENTS.md`** - Generic stack instructions and conventions
- **`SITE.md`** - Project-specific details (fill this out for each project)
- **`CLAUDE.md`** - Redirects Claude Code to AGENTS.md

When working with AI assistants like Claude Code, Google Gemini or GitHub Copilot, they'll automatically read these files to understand your project structure and conventions.

## Common Tasks

### Add a New Page

1. Create `src/en/your-page.md`
2. Add frontmatter:
```yaml
---
layout: page
title: Your Page Title
lang: en
locale: en-US
description: SEO description
---
```
3. Add to navigation in `src/_data/navigation.json`
4. Create equivalent pages in other languages if multilingual

### Add a Blog Post

1. Create `src/en/posts/YYYY-MM-DD-post-slug.md`
2. Add frontmatter:
```yaml
---
layout: post
title: Post Title
date: 2024-03-15
description: Short summary for listings and SEO
tags: [tag1, tag2]
---
```
3. Post appears automatically in the blog listing for its language

### Add a New Language

1. Create `src/{lang}/` directory
2. Add `src/{lang}/{lang}.json`:
```json
{
  "lang": "fr",
  "locale": "fr-FR"
}
```
3. Copy all pages from `src/en/` to `src/{lang}/`
4. Translate content
5. Add navigation to `src/_data/navigation.json`
6. Add UI strings to `src/_data/i18n.json`

hreflang alternates, the sitemap and the `posts_{lang}` collection pick up the new language automatically.

### Customize Design System

1. Edit `design-tokens.json`
2. Run `npm run tokens` to regenerate the Tailwind theme
3. Rebuild: `npm run dev`

### Add Custom Component

1. Create `src/_includes/components/my-component.njk`
2. Use Tailwind utilities for styling
3. Add Alpine.js for interactivity if needed
4. Include in pages: `{% include "components/my-component.njk" %}`

## Deployment

### Build for Production

```bash
npm run build
```

Output is in `_site/` directory - deploy this folder.

## Customization Checklist

After running `npx degit` and `npm install`, update these files to customize your project:

### 🔧 Essential Files (Update First)

#### 1. `SITE.md`
**What:** Project-specific documentation  
**Update:** Fill in all `[bracketed]` placeholders with your project details
- Client name, contact info
- Brand guidelines and colors
- Content structure
- Features and integrations

#### 2. `design-tokens.json`
**What:** Design system (colors, fonts, spacing)  
**Update:** Replace with your brand's design values
```json
{
  "colors": {
    "primary": { "500": "#YOUR-BRAND-COLOR" }
  },
  "typography": {
    "fonts": {
      "sans": ["Your-Font", "system-ui", "sans-serif"]
    }
  }
}
```

#### 3. `src/_data/site.json`
**What:** Site-wide metadata and company info  
**Update:** Replace all placeholder values
- `title`: Your site name
- `description`: SEO description
- `url`: Production URL
- `author`: Company/organization name (used in structured data)
- `email`: Contact email
- `defaultLanguage`: Language that `/` redirects to and `x-default` points at (e.g. `en`)
- `social`: Full profile URLs (used in structured data `sameAs`); leave empty to omit

#### 4. `src/_data/navigation.json`
**What:** Menu structure for all languages  
**Update:** Customize menu items and URLs
- Update menu text for each language
- Add/remove menu items as needed
- Update URLs to match your page structure

### 📝 Content Files (Update as Needed)

#### 5. `src/en/index.md` (and other language versions)
**What:** Homepage content  
**Update:** Replace placeholder content with your copy

#### 6. `src/en/about.md`, `services.md`, `contact.md`
**What:** Main page content  
**Update:** Add your actual content or delete if not needed

#### 7. `src/en/llm.md` (LLM summary)
**What:** Short plain-text summary used to generate `/llm.txt` for LLMs  
**Update:** Replace the example summary with a concise overview of your
site (audience, key features, tone, and any constraints). This file is
rendered into plain text and included in the built site at `/llm.txt` so keep
it short and maintain it when your site or content strategy changes.


### 🎨 Assets (Replace Placeholders)

#### 7. `src/assets/images/favicon.png`
**What:** Browser favicon/icon (16, 32, 180 and 192px versions are generated at build time)  
**Update:** Replace with your brand's favicon, ideally a square PNG of at least 192px

#### 8. `src/assets/images/logo.png`
**What:** Site logo  
**Update:** Add your actual logo file

#### 9. `src/assets/images/` (other images)
**What:** Hero images, backgrounds, etc.  
**Update:** Replace placeholder images with your assets

### ⚙️ Configuration (Optional Updates)

#### 10. `package.json`
**What:** Project metadata  
**Update:** 
- `name`: Your project name
- `description`: Project description
- `author`: Your name
- `repository`: Your Git repo URL

### 🗑️ Cleanup (Remove What You Don't Need)

- **Remove unused languages:** Delete `src/fr/`, `src/de/` if single-language
- **Remove blog:** Delete `src/en/posts/` if no blog needed

### ✅ After Updates, Run:

```bash
npm run tokens    # Generate Tailwind theme from design tokens
npm run dev       # Start development server
```

## Browser Support

Tailwind CSS 4 targets modern browsers only:

- Chrome / Edge 111+
- Safari / iOS Safari 16.4+
- Firefox 128+

## Performance

Out of the box, expect:

- **Lighthouse Desktop:** 95-100
- **Lighthouse Mobile:** 90-95
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s

Performance optimizations included:
- Image optimization (AVIF, WebP)
- CSS purging (unused classes removed)
- HTML minification
- Font preloading
- Lazy loading images
- Minimal JavaScript footprint

## Accessibility

WCAG 2.1 Level AA compliant:
- Semantic HTML5
- Proper heading hierarchy
- Alt text on images
- Keyboard navigation
- Focus states
- Color contrast ratios
- Screen reader friendly

## License

MIT License

## Credits

Built with:
- [Eleventy](https://www.11ty.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Alpine.js](https://alpinejs.dev/)
- [Nunjucks](https://github.com/mozilla/nunjucks)
- [Claude Code](https://claude.ai/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Google Gemini](https://makersuite.google.com)

## Support

For issues or questions:
- Create an issue in this repo
- Email: [david@marcombes.fr]
- Documentation: See `AGENTS.md` and `SITE.md`

---
