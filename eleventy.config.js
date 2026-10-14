import fs from 'node:fs';
import path from 'node:path';
import { I18nPlugin } from '@11ty/eleventy';
import Image from '@11ty/eleventy-img';
import { minify } from 'html-minifier-terser';
import site from './src/_data/site.json' with { type: 'json' };

// Language directories are those containing a {lang}.json file, e.g. src/en/en.json
const languages = fs
  .readdirSync('src', { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(`src/${entry.name}/${entry.name}.json`))
  .map((entry) => entry.name);

// Generate favicons from a single source image (16/32 for tabs, 180 for iOS, 192 for Android)
async function generateFavicons(outputDir) {
  await Image('src/assets/images/favicon.png', {
    widths: [16, 32, 180, 192],
    formats: ['png'],
    outputDir: path.join(outputDir, 'assets/favicons/'),
    urlPath: '/assets/favicons/',
    filenameFormat: function (_id, _src, width, format) {
      if (width === 180) return `apple-touch-icon.${format}`;
      return `favicon-${width}.${format}`;
    }
  });
}

export default function (eleventyConfig) {
  // Language-aware URLs: provides `locale_url`, `locale_links` filters and `page.lang`
  eleventyConfig.addPlugin(I18nPlugin, {
    defaultLanguage: site.defaultLanguage,
    errorMode: 'allow-fallback'
  });

  // Page dates default to the last git commit of the file (used for sitemap <lastmod>).
  // Front matter `date` (e.g. on blog posts) still takes precedence.
  eleventyConfig.addGlobalData('date', 'git Last Modified');

  // Generate favicons before each build
  eleventyConfig.on('eleventy.before', ({ directories }) => generateFavicons(directories.output));

  // Passthrough static assets
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Alpine.js (CSP-compatible build), self-hosted so no third-party script is needed
  eleventyConfig.addPassthroughCopy({ 'node_modules/@alpinejs/csp/dist/cdn.min.js': 'assets/js/alpine.min.js' });

  // Shortcode for responsive images:
  // {% image "src/assets/images/photo.jpg", "Alt text", "100vw", "rounded-lg", "eager", "high" %}
  // Use loading "eager" + fetchpriority "high" for the main above-the-fold image.
  eleventyConfig.addAsyncShortcode('image', async function (src, alt = '', sizes = '100vw', className = '', loading = 'lazy', fetchpriority = '') {
    if (!alt) {
      throw new Error(`Missing "alt" on image from: ${src}`);
    }

    let metadata = await Image(src, {
      widths: [320, 640, 1024, 1600],
      formats: ['avif', 'webp', 'jpeg'],
      outputDir: path.join(eleventyConfig.directories.output, 'assets/images/'),
      urlPath: '/assets/images/'
    });

    let imageAttributes = {
      alt,
      sizes,
      loading,
      decoding: 'async',
      ...(className && { class: className }),
      ...(fetchpriority && { fetchpriority })
    };

    // You can return a string of markup
    return Image.generateHTML(metadata, imageAttributes);
  });

  // Basic passthrough copy for fonts
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'assets/fonts' });

  // Add a simple filter
  eleventyConfig.addFilter('year', () => new Date().getFullYear());

  // Add a date filter for Nunjucks (YYYY-MM-DD)
  eleventyConfig.addFilter('date', function(dateObj) {
    if (!dateObj) return '';
    // If dateObj is a string, convert to Date
    const d = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    if (isNaN(d)) return '';
    return d.toISOString().slice(0, 10);
  });

  // Human-readable date in the page's language, e.g. "January 18, 2026" / "18 janvier 2026"
  // Optionally pass a locale: {{ page.date | readableDate("fr-FR") }}
  eleventyConfig.addFilter('readableDate', function (dateObj, locale) {
    if (!dateObj) return '';
    const d = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
    if (isNaN(d)) return '';
    return new Intl.DateTimeFormat(locale || this.page?.lang || site.defaultLanguage, {
      dateStyle: 'long',
      timeZone: 'UTC'
    }).format(d);
  });

  // hreflang alternates for a URL: the page itself, its translations and x-default.
  // Returns [] when the page has no translations.
  eleventyConfig.addFilter('alternates', function (url) {
    const translations = eleventyConfig.getFilter('locale_links').call(this, url);
    if (!translations.length) return [];
    const own = { lang: url.split('/')[1] || site.defaultLanguage, url };
    const links = [own, ...translations];
    const fallback = links.find((link) => link.lang === site.defaultLanguage);
    return fallback ? [...links, { lang: 'x-default', url: fallback.url }] : links;
  });

  // Language switcher links: every language, pointing to this page's translation when it exists,
  // otherwise to that language's homepage. Labels are native language names ("English", "Français").
  eleventyConfig.addFilter('languageLinks', function (url) {
    const current = url.split('/')[1] || site.defaultLanguage;
    const translations = eleventyConfig.getFilter('locale_links').call(this, url);
    return languages.map((code) => {
      const name = new Intl.DisplayNames([code], { type: 'language' }).of(code);
      return {
        lang: code,
        label: name.charAt(0).toLocaleUpperCase(code) + name.slice(1),
        url: code === current ? url : translations.find((t) => t.lang === code)?.url || `/${code}/`,
        current: code === current
      };
    });
  });

  // Posts collections (by convention): `posts` for all languages, `posts_<lang>` per language
  const byDateDesc = (a, b) => b.date - a.date;
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByGlob('src/*/posts/*.md').sort(byDateDesc);
  });
  for (const lang of languages) {
    eleventyConfig.addCollection(`posts_${lang}`, function (collectionApi) {
      return collectionApi.getFilteredByGlob(`src/${lang}/posts/*.md`).sort(byDateDesc);
    });
  }

  // Minify HTML in production builds (`npm run build`), not while serving
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    eleventyConfig.addTransform('htmlmin', function (content) {
      if (!(this.page.outputPath || '').endsWith('.html')) return content;
      return minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      });
    });
  }

  // Ensure sitemap and robots are output (templates handle generation)
}

export const config = {
  dir: {
    input: 'src',
    output: '_site',
    includes: '_includes',
    layouts: '_layouts',
    data: '_data'
  }
};
