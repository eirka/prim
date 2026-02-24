# Prim

Frontend for the [Pram](https://github.com/eirka) imageboard API.

## Features

- Browse image threads with pagination and keyboard navigation
- View images with prev/next navigation, tagging, and favoriting
- Thread directory with search and sorting
- Tag browser with filtering by type (tag, artist, character, copyright)
- Trending content (newest, popular, most favorited)
- User accounts (register, login, email/password management, avatars)
- Drawing pad with undo/redo, color palette, and canvas download
- Comment formatting (bold, italic, links, image/YouTube embeds, emoticons)
- Quote system with hover preview popups
- Moderation tools (delete posts/threads, close/sticky threads, ban IP/file)
- Admin panel with board statistics charts and audit logs
- Discord server widget integration
- Keyboard shortcuts throughout

## Stack

| | |
|---|---|
| Framework | Vue 3 (Composition API) |
| Router | Vue Router 4 |
| State | Pinia |
| Build | Vite |
| Styling | SCSS |
| Charts | Chart.js / vue-chartjs |
| Toasts | vue-toastification |

## Quick Start

```bash
cd vue
npm install
npm run dev
```

The dev server starts on `http://localhost:3000`.

## Build

```bash
cd vue
npm run build
```

Output goes to `vue/dist/`. Serve the `index.html` and assets with any static file server. The app uses HTML5 history mode, so configure your server to fall back to `index.html` for all routes.

## Configuration

The host page must set `window.primConfig` before the app loads:

```html
<script>
  window.primConfig = {
    api_srv: 'https://api.example.com',
    img_srv: 'https://img.example.com',
    ib_id: 1,
    csrf_token: 'your-csrf-token',
    title: 'Board Name',
    discord_widget: 'https://discord.com/api/guilds/YOUR_ID/widget.json'
  };
</script>
```

| Key | Description |
|---|---|
| `api_srv` | Base URL for the Pram REST API |
| `img_srv` | Base URL for images, thumbnails, avatars, and emoticons |
| `ib_id` | Imageboard ID (supports multi-board) |
| `csrf_token` | CSRF token for form submissions |
| `title` | Site title used in the page `<title>` |
| `discord_widget` | Discord widget JSON endpoint (optional) |

## Authentication

Auth is handled via HTTP-only JWT cookies. The frontend uses `credentials: 'include'` on all API requests and never touches the token directly. On 401 responses the session is cleared and the page reloads; on 403 the user is redirected to the login page.

## Legacy

The original AngularJS 1.7 frontend source is in `src/` for reference. It uses Gulp + Browserify and is no longer maintained.

## License

MIT
