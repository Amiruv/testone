# STRM — IPTV PWA

A cinematic, installable IPTV player for M3U playlists.

## Files
- `index.html` — Main app
- `manifest.json` — PWA manifest
- `sw.js` — Service worker (offline support)

## How to Use

### Option 1: Host on GitHub Pages (Free, Easiest)
1. Create a new public GitHub repo (e.g. `strm`)
2. Upload all 3 files to the repo root
3. Go to **Settings → Pages → Deploy from main branch → / (root)**
4. Your app is live at `https://yourusername.github.io/strm`
5. Open that URL on Android Chrome → tap **⋮ → Add to Home Screen**

### Option 2: Host on Netlify (Free, Instant)
1. Go to https://app.netlify.com/drop
2. Drag the folder with all 3 files → it deploys instantly
3. Open the URL on Android → Add to Home Screen

### Option 3: Local with Python
```bash
cd /path/to/files
python3 -m http.server 8080
```
Open `http://YOUR_LAN_IP:8080` on your Android (same WiFi network).
> Note: Service worker requires HTTPS for full PWA install. Local is fine for testing.

## Features
- 📺 M3U / M3U8 playlist parsing
- 🎬 HLS stream playback (via hls.js)
- 📂 Category sidebar with emoji hints
- 🔍 Real-time channel search
- ▶ Full player controls (play/pause, seek, volume, mute)
- ⏭ Previous/Next channel
- 🔳 Fullscreen support
- 💾 Saves up to 5 recent playlist URLs
- ⌨️ Keyboard shortcuts (Space, F, M, Arrow keys)
- 📱 Installable as Android/iOS home screen app

## Keyboard Shortcuts (when player is open)
| Key | Action |
|-----|--------|
| Space | Play / Pause |
| F | Fullscreen |
| M | Mute |
| ← / → | Seek ±10s (VOD) |
| ↑ / ↓ | Previous / Next channel |
| Esc | Close player |

## CORS Note
Some M3U providers block direct browser fetches. The app auto-retries via
corsproxy.io if the direct fetch fails. If your playlist still won't load,
check that the URL is publicly accessible.
