# AGENTS.md - Project Documentation

This file provides guidance for AI assistants working on this codebase.

**Project-specific instructions and content details are in `SITE.md`** - always read that file first to understand the specific site you're working on.

## Communication Style

Be terse. Use as few words as possible.

- Answer first; no preamble, no restating the request, no closing summary of what was just said
- Short sentences or bullets, not paragraphs
- Report results, not process: what changed, what was verified, what is left
- Mention only problems or decisions that need the user's input
- No filler ("Great question", "I'll now…", "Let me…"), no hedging, no repetition
- Expand only when the user asks for detail

## Reasoning

Keep reasoning compressed.

- Think in short notes, not prose; skip the obvious
- Decide once: don't re-derive settled facts or re-argue choices already made
- Don't enumerate options you won't pursue; pick the best one and move on
- Stop reasoning when there is enough information to act
- Spend effort on the hard part (ambiguity, risk, correctness), not on routine edits

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Eleventy (11ty)** | 3.x | Static site generator (ESM config) |
| **Tailwind CSS** | 4.x | Utility-first CSS framework (CSS-first config, `@tailwindcss/cli`) |
| **Alpine.js** | 3.x (CSP build, self-hosted) | Lightweight reactive interactivity |
| **Nunjucks** | - | Templating engine |
| **@11ty/eleventy-img** | 7.x | Image optimization |
| **Node.js** | 22+ | Runtime (project is ES modules: `"type": "module"`) |

## Design System

**All design tokens are defined in `design-tokens.json`** at the project root.

This file contains:
- Color palette with semantic naming and shade scales
- Typography definitions (font families, sizes, weights, line heights)
- Spacing scale and sizing values
- Animation/transition definitions
- Any other design values

**`src/css/theme.css` is generated from `design-tokens.json`** (as a Tailwind v4 `@theme` block) and should not be edited directly. There is no `tailwind.config.js`. When making design changes:
1. Update `design-tokens.json`
2. Regenerate the theme (`npm run tokens`)
3. Rebuild CSS

Token mapping: `colors.primary.500` → `--color-primary-500` (`bg-primary-500`), `typography.fonts.sans` → `--font-sans`, `typography.sizes.*` → `--text-*`, `spacing.unit` → `--spacing` (the base multiplier, so `p-4` = 4 × unit), other `spacing.*` → `--spacing-*`, `animations.*` → `--animate-*`, `keyframes.*` → `@keyframes`. Values must be CSS strings; anything else is skipped with a warning.

### Design Tokens Structure

```json
{
  "colors": {
    "primary": {
      "50": "#...",
      "500": "#...",
      "900": "#..."
    }
  },
  "typography": {
    "fonts": {
      "sans": ["Font Name", "fallback"],
      "display": ["Font Name", "fallback"]
    },
    "sizes": { ... }
  },
  "spacing": { ... },
  "animations": { ... }
}
```

## Project Architecture

### Standard Directory Structure

```
project-root/
├── design-tokens.json     # Design system source of truth
├── eleventy.config.js     # Eleventy configuration (ESM)
├── package.json           # Dependencies and scripts
├── AGENTS.md              # This file - generic instructions for AI assistants
├── CLAUDE.md              # Imports AGENTS.md and SITE.md for Claude Code
├── SITE.md                # Project-specific instructions
│
└── src/
    ├── _data/             # Global data files
    │   ├── site.json      # Site metadata, URLs, social links, defaultLanguage
    │   ├── navigation.json # Menu structure (keyed by language)
    │   └── i18n.json      # UI strings (keyed by language)
    │
    ├── _layouts/          # Page templates
    │   ├── base.njk       # Base HTML structure (SEO, header, footer)
    │   ├── home.njk       # Homepage layout
    │   ├── page.njk       # Standard page layout
    │   ├── post.njk       # Blog post layout
    │   ├── blog.njk       # Blog listing layout (posts of the page's language)
    │   └── not-found.njk  # 404 page layout
    │
    ├── _includes/         # Reusable components
    │   ├── components/    # UI components (buttons, cards, forms)
    │   ├── sections/      # Page sections (hero, features, testimonials)
    │   └── partials/      # seo.njk (canonical, Open Graph, hreflang), structured-data.njk (JSON-LD)
    │
    ├── css/
    │   ├── input.css      # Tailwind entry point + custom components
    │   └── theme.css      # Generated from design tokens (git ignored)
    │
    ├── assets/            # Static files
    │   ├── images/        # Image files
    │   ├── js/theme.js    # Dark mode: applied before paint + header toggle component
    │   ├── fonts/         # Web font files (if self-hosting)
    │   └── images/favicon.png # Favicon source (sizes generated at build time)
    │
    ├── index.njk          # Redirects / to the default language
    ├── 404.njk            # Root 404 page (default language)
    ├── sitemap.xml.njk    # Sitemap with hreflang alternates
    ├── robots.txt.njk     # robots.txt
    ├── htaccess.njk       # Apache config (/.htaccess): headers, caching, redirects
    │
    ├── en/                # English content (default language)
    │   ├── en.json        # Language config: { "lang": "en", "locale": "en-US" }
    │   ├── index.md       # Homepage content
    │   ├── 404.md         # Language 404 page (permalink /en/404.html)
    │   ├── posts/         # Blog posts: YYYY-MM-DD-slug.md → /en/blog/slug/
    │   │   └── posts.json # Sets layout: post and the /{lang}/blog/{slug}/ permalink
    │   └── *.md           # Other pages (about, services, contact, etc.)
    │
    └── fr/                # French content (additional language)
        ├── fr.json        # Language config: { "lang": "fr", "locale": "fr-FR" }
        ├── index.md       # Homepage content (French)
        ├── posts/         # Blog posts (French), with its own posts.json
        └── *.md           # Other pages (French equivalents)

_site/                     # Build output (git ignored)
```

### Default Content Structure

Every site should follow this organization:

**Pages** - Top-level content files:
- `index.md` - Homepage
- `about.md` - About page
- `services.md` - Services/offerings page
- `contact.md` - Contact page
- `blog.md` or `posts.md` - Blog listing page
- `legal.md` - Legal notice (linked from the footer)
- `privacy.md` - Privacy policy (linked from the footer)

**Blog Posts** - In `/posts/` subdirectory:
- Filename format: `YYYY-MM-DD-slug.md` (e.g., `2024-03-15-new-product-launch.md`)
- URL: `/{lang}/blog/{slug}/` (date prefix dropped), set by `posts/posts.json`, so posts sit in the Blog nav section
- Auto-collected by date: `collections.posts` (all languages) and `collections.posts_{lang}` (one language)
- Tagged for categorization

**Data Files** - In `_data/`:
- `site.json` - Site-wide metadata, company info, contact details
- `navigation.json` - Menu structure
- `i18n.json` - Translated UI strings used by layouts and components (skip link, footer, 404 page, blog), keyed by language
- `team.json` - Team members (optional)
- `testimonials.json` - Customer testimonials (optional)

## Multilingual Support

This stack supports multiple languages with parallel content directories.

### Language Structure

Each language has its own directory under `src/`:
- `src/en/` - English (default language)
- `src/fr/` - French
- `src/de/` - German
- etc.

### Language Configuration

Each language directory contains a `{lang}.json` file:

```json
{
  "lang": "en",
  "locale": "en-US"
}
```

This makes `lang` and `locale` variables available to all pages in that directory.

### Language-Aware Templates

Templates reference the `{{ lang }}` variable for language-specific rendering, and `{{ i18n[lang] }}` for translated UI strings.

Eleventy's built-in **I18n plugin** links translations by file path: `src/en/about.md` and `src/fr/about.md` are the same page in two languages, even if their permalinks differ. The default language is `defaultLanguage` in `src/_data/site.json`. It provides:

- `{{ page.url | locale_links }}` - the page's translations (`url`, `lang`, native-language `label`)
- `{{ "/about/" | locale_url }}` - a URL in the current page's language
- `{{ page.url | alternates }}` (custom filter) - hreflang list: the page, its translations and `x-default`

**hreflang tags are generated automatically** in `partials/seo.njk` and in the sitemap, only for pages that have at least one translation. Don't hand-write them.

### Navigation Menus

Navigation is keyed by language in `_data/navigation.json`:

```json
{
  "en": [
    { "text": "Home", "url": "/en/" },
    { "text": "About", "url": "/en/about/" }
  ],
  "fr": [
    { "text": "Accueil", "url": "/fr/" },
    { "text": "À propos", "url": "/fr/about/" }
  ]
}
```

Access in templates: `{% for item in navigation[lang] %}`

### Content Parity

When adding content:
1. Create the page in the primary language directory
2. Create equivalent pages in all other language directories
3. Keep URLs parallel: `/en/about/` and `/fr/about/`
4. Update navigation in all languages
5. Keep the same file path in each language directory so translations are linked (hreflang is automatic)

Shared pages linked from templates (e.g. `legal.md` and `privacy.md` in the footer) are linked by their **default-language URL** passed through `locale_url`: `{{ '/en/legal/' | locale_url }}` gives `/fr/legal/` on French pages. Translations are matched by file name, so the URL can be translated with `permalink` (e.g. `src/fr/legal.md` with `permalink: /fr/mentions-legales/`). If a language has no translation yet, the link falls back to the default-language page instead of breaking the build. Each language should still have its own `legal.md` and `privacy.md`.

### Language Switcher

Built into `components/header.njk` (desktop and mobile menu), using the `languageLinks` filter from `eleventy.config.js`:
- Lists every language directory (`src/{lang}/{lang}.json`), labelled with its code and native name ("Français")
- Links to the current page's translation, or to that language's homepage when there is none
- Hidden when the site has only one language

### Header Navigation

`components/header.njk`: desktop nav from `md` up, Alpine mobile menu below (closes with Escape). The current page link gets `aria-current="page"`; its section is highlighted too (e.g. Blog on posts, because the post URL starts with the Blog URL).

## Configuration Files

| File | Purpose |
|------|---------|
| `eleventy.config.js` | Eleventy config: collections, filters, shortcodes, passthrough |
| `src/css/input.css` | Tailwind entry point: imports, dark-mode variant, custom components |
| `src/css/theme.css` | **Generated from design-tokens.json** - do not edit manually |
| `design-tokens.json` | Design system source of truth |
| `package.json` | Dependencies and build scripts |
| `SITE.md` | **Project-specific instructions** |

## Build Commands

```bash
npm start        # Start development server with live reload
npm run dev      # Run Eleventy + Tailwind in watch mode
npm run build    # Production build (minified CSS, optimized assets)
npm run clean    # Remove _site/ directory
```

Development server runs at `http://localhost:8080` with live reload.

## Coding Conventions

### CSS
- **Utility-first approach**: Use Tailwind classes directly in templates
- **Custom components**: Define in `src/css/input.css` using `@layer components` (in v4, `@apply` only accepts utilities, not other custom classes)
- **Class naming**: kebab-case (`.btn-primary`, `.card-header`)
- **Design tokens**: All values come from `design-tokens.json` → `src/css/theme.css` (`@theme`)
- **Dark mode**: Class-based approach with `.dark` class on `<html>` (via `@custom-variant dark` in `input.css`)
- **Responsive design**: Mobile-first with Tailwind breakpoints (sm, md, lg, xl, 2xl)

### Templates (Nunjucks)
- **Layout inheritance**: Pages extend base layouts via `layout` frontmatter
- **Reusable components**: Store in `_includes/components/` and import with `{% include %}`
- **Data access**: Use `{{ site.title }}` for global data, `{{ title }}` for page data
- **Language awareness**: Use `{{ lang }}` and `{{ locale }}` for multilingual features
- **Filters**: Available Eleventy filters listed in `eleventy.config.js`

### Content (Markdown)
- **Frontmatter**: YAML at top of each `.md` file for metadata
- **Required fields**: `layout`, `title`, `lang`, `locale`
- **Optional fields**: `description`, `date`, `tags`, `permalink`
- **Content sections**: Can be defined in frontmatter for component-based layouts (e.g. `hero` and `features` in `index.md` for the `home` layout)
- **No hardcoded text in templates**: Wording in layouts/components comes from `i18n[lang]` (UI labels) or page front matter (page copy), so every language gets its own text. When adding a UI string, add it for every language in `i18n.json`

Example frontmatter:
```yaml
---
layout: page
title: About Us
lang: en
locale: en-US
description: Learn about our company and mission
---
```

### Images
- **Shortcode usage**: Use `{% image %}` for automatic optimization
- **Arguments**: `{% image "src/assets/images/photo.jpg", "Alt text", "sizes", "class", "loading", "fetchpriority" %}` - only `src` and alt text are required
- **Hero/LCP image**: pass `"eager", "high"` for loading and fetchpriority on the main above-the-fold image
- **Output formats**: AVIF, WebP with fallbacks
- **Responsive sizes**: Multiple widths generated automatically
- **Loading strategy**: Lazy loading by default
- **Source location**: `src/assets/images/`
- **Alt text**: Always required for accessibility

### JavaScript (Alpine.js)
- **Keep it minimal**: Use for interactive UI components only
- **Declarative syntax**: Define behavior in HTML with `x-data`, `x-show`, etc.
- **State management**: Simple component-level state, avoid complex global state
- **Common patterns**: Dropdowns, modals, tabs, mobile menus, accordions, language switchers
- **Dark mode toggle**: Button in the header. `src/assets/js/theme.js` (loaded without `defer` in `<head>`) applies the `.dark` class before first paint: the visitor's choice from localStorage (`theme` = `dark`/`light`), otherwise the system setting. It also registers the `themeToggle` Alpine component. Icons switch with `dark:` classes, not Alpine, so there is no flash
- **CSP build**: Alpine is the `@alpinejs/csp` build, copied from `node_modules` to `/assets/js/alpine.min.js`, so it runs under a strict Content Security Policy (no `unsafe-eval`). Inline expressions support simple JavaScript (property access, assignments, comparisons, method calls); for anything more complex, register a component with `Alpine.data()` in a script file.

## Rules for Updates

### General Principles
1. **Read SITE.md first** - Project-specific instructions override these generic guidelines
2. **Read before modifying** - Always review existing code to understand patterns
3. **Maintain consistency** - Follow established conventions throughout the codebase
4. **Keep it simple** - Avoid over-engineering; make only necessary changes
5. **Test locally** - Run `npm run dev` to verify changes before committing
6. **Preserve functionality** - Don't break existing features when adding new ones
7. **Respect design tokens** - Never hardcode colors or fonts; use Tailwind utilities

### Design System Updates
1. Edit `design-tokens.json` only
2. Regenerate `src/css/theme.css` from tokens (`npm run tokens`)
3. Rebuild CSS with `npm run dev`
4. Test changes across all pages and breakpoints
5. Verify dark mode compatibility if applicable

### Content Updates
1. Edit Markdown files in appropriate language directories
2. Maintain content parity across all languages
3. Use consistent frontmatter across similar content types
4. Follow existing naming conventions for files
5. Update navigation menus if adding new pages

### Styling Updates
1. **Prefer utilities**: Use Tailwind classes from design tokens
2. **Component layer**: Add reusable styles to `src/css/input.css` under `@layer components`
3. **Consistency**: Maintain visual consistency with existing components
4. **Dark mode**: Ensure all changes work in both light and dark modes
5. **Responsive**: Test changes at all breakpoints (mobile, tablet, desktop)
6. **No hardcoding**: Use design token values, not arbitrary colors/sizes

### Layout/Template Updates
1. Modify templates in `src/_layouts/` and `src/_includes/`
2. Base layout contains site-wide elements (header, footer, SEO tags)
3. Use Nunjucks blocks and includes for modular, reusable code
4. Keep Alpine.js usage declarative and minimal
5. Preserve accessibility attributes (ARIA labels, semantic HTML)
6. Maintain language-aware rendering for multilingual sites

### Adding New Pages
1. Create `.md` file in appropriate language directory (e.g., `src/en/new-page.md`)
2. Set required frontmatter: `layout`, `title`, `lang`, `locale`
3. Add navigation entry in `src/_data/navigation.json` for each language
4. Create equivalent pages in all other language directories
5. Ensure hreflang alternates are correct
6. Test page renders correctly and navigation works

### Adding New Languages
1. Create new language directory: `src/{lang}/`
2. Add `{lang}.json` with `lang` and `locale` values
3. Copy all pages from existing language as templates (including `legal.md`, `privacy.md`, `404.md` and `posts/posts.json`)
4. Translate all content
5. Add navigation menu to `_data/navigation.json`
6. Add UI strings to `_data/i18n.json`
7. Add `src/{lang}/404.md` (copy `src/en/404.md` and change the permalink)

The `posts_{lang}` collection and hreflang alternates are created automatically for any `src/{lang}/` directory containing `{lang}.json`. Restart the dev server after adding a language.

### Image Guidelines
1. Place source images in `src/assets/images/`
2. Use `{% image %}` shortcode for content images (automatic optimization)
3. Direct references for hero/background images if needed for CSS control
4. Use descriptive filenames: `team-photo-2024.jpg` not `img001.jpg`
5. Include alt text for accessibility
6. Optimize large images before adding to repository

### Adding New Components
1. Create include file in `src/_includes/components/`
2. Use Tailwind utilities from design tokens for styling
3. Add Alpine.js for interactivity only if needed
4. Make components reusable with parameters
5. Document component usage in SITE.md if complex
6. Test component in isolation and in context

## SEO Best Practices

- Metadata defined in page frontmatter and `_data/site.json`
- Open Graph and Twitter Card tags in base layout
- Canonical URLs set per page
- Hreflang alternates (with `x-default`) for pages that have translations
- XML sitemap generated at `/sitemap.xml`, with hreflang alternates. `<lastmod>` is the page's front matter `date`, otherwise the file's last git commit (`date: "git Last Modified"` set globally in `eleventy.config.js`)
- Robots.txt configured for crawlers
- Structured data (JSON-LD) for rich results: Organization, WebSite, WebPage, and BlogPosting on posts (from `site.json`)
- Localized 404 pages (`/404.html` and `/{lang}/404.html`)
- `/` redirects to the default language
- Semantic HTML5 elements throughout
- Proper heading hierarchy on all pages

## Performance Optimization

- CSS purged of unused classes in production build
- HTML minification (whitespace, comments removed) in `npm run build`, not in the dev server
- Images optimized to modern formats (AVIF, WebP)
- Fonts preloaded or loaded asynchronously with `font-display: swap`
- Minimal JavaScript footprint (Alpine.js self-hosted)
- Favicons generated at build time in the needed sizes
- Static HTML for fast initial page loads and SEO

## Accessibility Checklist

- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, etc.)
- Proper heading hierarchy (single `<h1>`, logical h2-h6 structure)
- Alt text for all images (descriptive, not redundant)
- ARIA labels for interactive elements without visible text
- Keyboard navigation support (focus states, tab order)
- Sufficient color contrast ratios (WCAG AA minimum)
- Focus states visible on all interactive elements
- Skip-to-content link for keyboard users
- Form labels properly associated with inputs
- Language attribute on `<html>` tag

## Deployment

The site builds to `_site/` as static HTML/CSS/JS/assets.

**Compatible with:**
- Netlify, Vercel, Cloudflare Pages
- GitHub Pages, GitLab Pages
- Traditional web servers (Apache, Nginx)
- Any static hosting service

**Build output includes:**
- Minified CSS with unused classes removed
- Minified HTML
- Optimized images with modern formats
- All static assets copied to `_site/`

**Apache hosting:** `src/htaccess.njk` generates `/.htaccess` with security headers (strict CSP), caching, compression, the 404 page and the root redirect. Other hosts ignore it; use their own config (e.g. Netlify/Cloudflare `_headers`) or delete the file. Update the CSP if you add third-party scripts, styles or fonts.

**Full git history required:** sitemap `<lastmod>` dates come from git. CI shallow clones (e.g. GitHub Actions' default `fetch-depth: 1`) give every page the same date; use `fetch-depth: 0` or the host's equivalent.

**Environment variables** (if needed):
- Document any required variables in SITE.md
- Use `.env` file locally (git ignored)
- Configure in hosting platform settings

## Common Tasks

### Add a blog post
1. Create `YYYY-MM-DD-post-title.md` in `src/{lang}/posts/`
2. Add frontmatter: `layout: post`, `title`, `description`, `date`, `tags` (`lang` and `locale` come from the directory's `{lang}.json`)
3. Write content in Markdown
4. Create equivalent post in other languages
5. Post appears automatically in that language's blog listing (`collections.posts_{lang}`)

### Update site-wide data
1. Edit `src/_data/site.json` for global settings
2. Edit `src/_data/navigation.json` for menu structure
3. Changes apply to all pages immediately
4. Restart dev server to see changes

### Modify design system
1. Update `design-tokens.json` with new colors/fonts/spacing
2. Regenerate `src/css/theme.css` (`npm run tokens`)
3. Rebuild CSS: `npm run dev`
4. Update any hardcoded values in templates to use new tokens

### Add new section to homepage
1. Define content in page frontmatter or separate data file
2. Create include template in `_includes/sections/`
3. Add include to homepage layout or content
4. Style with Tailwind utilities from design tokens
5. Test responsiveness and dark mode

### Update navigation
1. Edit `src/_data/navigation.json`
2. Update all language keys with new menu items
3. Ensure URLs are correct for each language
4. Test menu renders correctly on all pages

## Troubleshooting

**CSS not updating:**
- Ensure Tailwind is watching files: sources are detected from `src/` (see `source("..")` in `input.css`; add `@source` for other paths)
- Verify design tokens are properly formatted JSON
- Clear browser cache or use hard reload
- Restart dev server
- Check for syntax errors in `design-tokens.json`

**Images not optimizing:**
- Verify image path is correct in shortcode
- Check image exists in `src/assets/images/`
- Review `eleventy.config.js` image shortcode configuration
- Ensure image file is a supported format (JPG, PNG, WebP)

**Layout not applying:**
- Check frontmatter `layout` value matches filename in `_layouts/`
- Ensure layout file has proper Nunjucks syntax
- Verify layout chain (child → parent → base)
- Check for typos in layout references

**Build fails:**
- Read error message carefully for specific issue
- Check for syntax errors in templates, config files, or design tokens
- Verify all dependencies installed: `npm install`
- Try clean build: `npm run clean && npm run build`
- Check `design-tokens.json` is valid JSON

**Language switcher not working:**
- Switcher links to the homepage: the page has no translation with the same file name in that language
- Switcher hidden: only one directory has a `{lang}.json`; restart the dev server after adding a language
- Confirm `navigation.json` and `i18n.json` have all languages defined

**Dark mode not toggling:**
- Check `/assets/js/theme.js` loads in `<head>` without `defer`, before Alpine
- Verify localStorage key is consistent (`theme`)
- Ensure `.dark` class variants are defined in Tailwind
- Test in different browsers (localStorage support)

## Project-Specific Notes

**See `SITE.md` for:**
- Client information and branding guidelines
- Specific content requirements
- Custom features or integrations
- Deployment instructions
- Environment variables
- Third-party service configurations
- Special build requirements
- Contact information for stakeholders

## Recommended Additions

Consider documenting these in SITE.md:
- **Content strategy**: Tone of voice, messaging guidelines
- **Brand assets**: Logo usage, color meanings, typography rules
- **Forms**: Contact form integration, email service setup
- **Analytics**: Google Analytics, tracking codes
- **Third-party integrations**: CRM, newsletter, chat widget
- **Custom collections**: If using specialized content types
- **Redirects**: Old URLs that need redirecting
- **Testing checklist**: Browser/device testing requirements