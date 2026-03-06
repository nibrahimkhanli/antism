# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**antism** is a content discovery and creator platform with an Azerbaijani-language UI. It is built as a single-file SPA — the entire application lives in `index.html` (~5,500 lines).

## Development

There is no build system, package manager, or test framework. The project is a standalone HTML file that can be opened directly in a browser or served from any static file server.

```bash
# Serve locally (pick any static server)
python3 -m http.server 8080
# or
npx serve .
```

No lint, build, or test commands exist. All changes are made directly to `index.html`.

## Architecture

### Single-file SPA Pattern

`index.html` is divided into three sections:

1. **CSS** (lines ~8–950): Inline styles using CSS custom properties (design tokens defined in `:root`).
2. **HTML** (lines ~951–1003): Static page skeletons — each "page" is a `<div id="page-*">` that is shown/hidden by JS.
3. **JavaScript** (lines ~1004–end): All application logic.

### Routing

Navigation is handled by `showPage(pageId)`, which hides all `page-*` divs and shows the requested one. There is no URL-based routing; page transitions are in-memory only.

### Backend: Supabase

The app connects to a Supabase project for auth, database, and real-time features:

```js
const SUPABASE_URL = 'https://ybwqpzlsilicgyharedc.supabase.co';
const SUPABASE_KEY = '...'; // public anon key
```

A lightweight custom class `SBQuery` wraps the Supabase REST API instead of using the Supabase JS SDK. Real-time status updates use a WebSocket subscription via `dbSubscribeStatuses()`.

### Data: Mock + Live Hybrid

Most content (articles, videos, discovery feed posts, creator profiles) is stored as hardcoded JS constants (`ARTICLES`, `VIDEOS`, `POSTS`, `CREATORS`). Auth and some social features (follows, likes) make real Supabase calls.

### Global State

Key mutable globals:
- `currentUser` — `{ id, name, role, loggedIn, email }` or `null`
- `currentArticleId`, `currentVideoCreator` — track open detail views
- `selectedCat`, `currentSort` — feed filter state

### Pages / Feature Areas

| Page ID | Feature |
|---|---|
| `page-home` | Main feed (articles, videos, statuses) |
| `page-article` | Article detail with paywall |
| `page-video` | Video detail |
| `page-profile` | User/creator profile |
| `page-dashboard` | Creator dashboard (upload, settings) |
| `page-shura` | Council moderation (review apps, videos, announcements) |
| `page-notifications`, `page-likes`, `page-bookmarks` | User activity panels |

### Design System

CSS custom properties are defined in `:root`:
- `--bg` / `--bg2` / `--bg3` / `--bg4` / `--surface` — dark background layers
- `--border` / `--border2` — dividers
- `--ink` / `--ink2` / `--ink3` — text hierarchy
- `--accent` (`#FF6800`) — primary orange
- `--down` (`#5B73D4`) — secondary blue (downvote/secondary actions)

Font: Geist Mono (monospace) loaded from Google Fonts.

### Content Categories

```js
const CATS = [
  { id: 'din',    name: 'Din və Fəlsəfə', ... },
  { id: 'tech',   name: 'Texnologiya',    ... },
  { id: 'health', name: 'Sağlamlıq',      ... },
  { id: 'econ',   name: 'İqtisadiyyat',   ... }
];
```

### Key Functional Groups

- **Auth:** `authDoRegister()`, `authDoLogin()`, `dbSignOut()`, `validateInviteCode()`
- **Articles:** `openArticle()`, `likeArticle()`, `articleBookmark()`, `submitArticle()`
- **Videos:** `openVideo()`, `videoLike()`, `videoBookmark()`, `submitVideo()`
- **Statuses:** `dbPostStatus()`, `likeHomeStatus()`, `renderHomeStatuses()`, `dbSubscribeStatuses()`
- **Discovery feed:** `renderFeed()`, `renderPostCard()`, `tryVote()`
- **Profiles:** `openProfile()`, `dbToggleFollow()`
- **Shura (moderation):** `renderApplications()`, `decideApp()`, `renderShuraVideos()`, `postAnnouncement()`
- **UI:** `showPage()`, `showToast()`, `openAuthModal()`

## Language

All UI text is in Azerbaijani (`<html lang="az">`). Keep new UI strings in Azerbaijani.
