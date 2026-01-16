# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Adobe Experience Manager Edge Delivery Services (AEM EDS) project built on the aem-boilerplate template. It uses a document-based authoring approach where content is authored in Microsoft Word/Google Docs and delivered via AEM's edge delivery network.

## Commands

```bash
# Install dependencies
npm i

# Start local development server (opens http://localhost:3000)
aem up

# Run all linting (JS + CSS)
npm run lint

# Run only JavaScript linting
npm run lint:js

# Run only CSS linting
npm run lint:css

# Fix linting issues automatically
npm run lint:fix
```

## Architecture

### Page Loading Sequence

The page loading follows a phased approach defined in `scripts/scripts.js`:

1. **Eager Phase** (`loadEager`) - Runs first for LCP optimization
   - Decorates template/theme from metadata
   - Calls `decorateMain()` which runs `decorateButtons`, `decorateIcons`, `buildAutoBlocks`, `decorateSections`, `decorateBlocks`
   - Loads only the first section immediately

2. **Lazy Phase** (`loadLazy`) - Runs after eager completes
   - Loads header and footer blocks
   - Loads remaining sections
   - Loads `lazy-styles.css` and fonts

3. **Delayed Phase** (`loadDelayed`) - Runs 3 seconds after page load
   - Imports `scripts/delayed.js` for non-critical functionality
   - Currently loads Universal Editor debug instrumentation

### Block System

Blocks are self-contained components in `blocks/{block-name}/`:
- `{block-name}.js` - JavaScript with a default export `decorate(block)` function
- `{block-name}.css` - Styles loaded automatically when block is used

Block JS and CSS are lazy-loaded only when the block appears on a page. The `aem.js` utility handles loading via `loadBlock()`.

### Key Files

- `scripts/aem.js` - Core utilities: `buildBlock`, `loadBlock`, `decorateButtons`, `decorateIcons`, `decorateSections`, `createOptimizedPicture`, `getMetadata`, `loadCSS`, `loadScript`, `sampleRUM`
- `scripts/scripts.js` - Page initialization, auto-blocking logic, and load orchestration
- `styles/styles.css` - CSS custom properties (colors, fonts, sizes) and base styles
- `head.html` - Injected into every page's `<head>`
- `fstab.yaml` - Content source configuration (AEM Cloud URL)
- `paths.json` - Path mappings for content resolution

### Universal Editor Integration

This project is configured for Universal Editor authoring:
- `component-definition.json` - Defines available components for authoring
- `component-models.json` - Defines component field schemas
- `component-filters.json` - Controls component placement rules

### Auto-Blocking

The `buildAutoBlocks()` function in `scripts/scripts.js`:
- Automatically creates hero blocks when a page starts with picture + h1
- Converts links containing `/fragments/` into fragment block embeds

### Fragment System

Fragments (`blocks/fragment/`) allow embedding reusable content:
- Fetches content from `{path}.plain.html`
- Decorates and loads sections within the fragment
- Used for shared components like headers/footers

## Linting Rules

- ESLint extends `airbnb-base` with browser environment
- JS imports must include `.js` extension
- Unix linebreaks required
- Stylelint uses `stylelint-config-standard` for CSS
