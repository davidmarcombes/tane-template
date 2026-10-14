#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const tokensPath = path.join(import.meta.dirname, '..', 'design-tokens.json');
const outputPath = path.join(import.meta.dirname, '..', 'src', 'css', 'theme.css');

// Read design tokens
let tokens;
try {
  tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
} catch (error) {
  console.error('❌ Error reading design-tokens.json:', error.message);
  console.error('Make sure design-tokens.json exists in the project root.');
  process.exit(1);
}

// Basic validation and defaults
if (typeof tokens !== 'object' || tokens === null) {
  console.error('❌ design-tokens.json must be an object');
  process.exit(1);
}

if (!tokens.colors || Object.keys(tokens.colors).length === 0) {
  console.warn('⚠️  No colors found in design-tokens.json - injecting a default primary color');
  tokens.colors = { primary: { 500: '#005af0' } };
}

if (!tokens.typography || !tokens.typography.fonts) {
  console.warn('⚠️  No typography.fonts found - adding sensible defaults');
  tokens.typography = tokens.typography || {};
  tokens.typography.fonts = tokens.typography.fonts || {
    sans: ['Inter', 'system-ui', 'sans-serif']
  };
}

// Flatten nested token groups into CSS custom properties,
// e.g. { primary: { 500: '#005af0' } } -> --color-primary-500: #005af0;
function toVars(prefix, group = {}) {
  const lines = [];
  for (const [key, value] of Object.entries(group)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(...toVars(`${prefix}-${key}`, value));
    } else if (typeof value === 'string') {
      lines.push(`  ${prefix}-${key}: ${value};`);
    } else {
      console.warn(`⚠️  Skipping ${prefix}-${key}: expected a CSS string value, got ${JSON.stringify(value)}`);
    }
  }
  return lines;
}

// Font stacks: quote family names that contain spaces
function fontStack(fonts) {
  const list = Array.isArray(fonts) ? fonts : [fonts];
  return list.map((f) => (/\s/.test(f) && !/^["']/.test(f) ? `"${f}"` : f)).join(', ');
}

const fontVars = Object.entries(tokens.typography?.fonts || {}).map(
  ([name, fonts]) => `  --font-${name}: ${fontStack(fonts)};`
);

// spacing.unit is the base spacing multiplier in Tailwind v4 (p-4 = 4 * --spacing)
const { unit: spacingUnit, ...namedSpacing } = tokens.spacing || {};
const spacingVars = [
  ...(spacingUnit ? [`  --spacing: ${spacingUnit};`] : []),
  ...toVars('--spacing', namedSpacing)
];

// Keyframes are written as CSS objects: { fade: { from: { opacity: '0' }, to: { opacity: '1' } } }
const keyframes = Object.entries(tokens.keyframes || {}).map(([name, frames]) => {
  const steps = Object.entries(frames).map(([step, decls]) => {
    const body = Object.entries(decls).map(([prop, val]) => `${prop}: ${val};`).join(' ');
    return `    ${step} { ${body} }`;
  });
  return `  @keyframes ${name} {\n${steps.join('\n')}\n  }`;
});

const sections = [
  ['Colors', toVars('--color', tokens.colors)],
  ['Font families', fontVars],
  ['Font sizes', toVars('--text', tokens.typography?.sizes)],
  ['Spacing', spacingVars],
  ['Animations', toVars('--animate', tokens.animations)],
  ['Keyframes', keyframes]
].filter(([, lines]) => lines.length > 0);

// Generate Tailwind theme (with helpful comments)
const css = `/*
 * This file is auto-generated from design-tokens.json
 * Do not edit manually - run 'npm run tokens' to regenerate
 * If you need customizations, update design-tokens.json or extend this generator
 */

@theme {
${sections.map(([label, lines]) => `  /* ${label} */\n${lines.join('\n')}`).join('\n\n')}
}
`;

// Write Tailwind theme
try {
  fs.writeFileSync(outputPath, css);
  console.log('✅ Generated src/css/theme.css from design-tokens.json');
} catch (error) {
  console.error('❌ Error writing src/css/theme.css:', error.message);
  process.exit(1);
}
