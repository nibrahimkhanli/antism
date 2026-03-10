# CLAUDE.md

## Project Overview

**Antism** is a content creator platform (similar to Patreon) built as a vanilla JavaScript single-page application. The UI language is Azerbaijani. Creators can share videos, articles, and status updates; users can purchase premium content.

## Architecture

The entire application lives in a single `index.html` file (~5,500 lines) containing embedded CSS, HTML, and JavaScript. There is no build system, bundler, or framework — it's a static file served directly.

### Structure within index.html

- **CSS** (~3,000 lines): Custom properties for theming, responsive media queries, BEM-like class naming
- **HTML** (~2,000 lines): Pre-rendered page sections toggled via JS (SPA routing)
- **JavaScript** (~500+ lines): Functional style, DOM manipulation, localStorage/backend API calls

### Key page IDs

`page-home`, `page-dashboard`, `page-profile`, `page-article`, `page-video`, `page-onboarding`, `page-creator-onboard`, `page-apply`, `page-about`, `page-pricing`, `page-terms`

## Running Locally

Serve `index.html` with any HTTP server:

```sh
python3 -m http.server 8000
```

No install or build step is needed.

## Testing / Linting

There is no test suite or linter configured for this project.

## Code Conventions

- **CSS**: Hyphen-separated class names (`post-card`, `feed-layout`, `dash-page`). Dark theme with CSS variables (`--bg`, `--accent`, `--ink`, `--down`).
- **JavaScript**: camelCase function names. Functional style (no classes). Prefix database helpers with `db` or `sb` (`dbLoadPosts`, `sbGet`).
- **HTML**: Page containers use `id="page-*"` convention.
- **Language**: All user-facing text is in Azerbaijani (`lang="az"`).
