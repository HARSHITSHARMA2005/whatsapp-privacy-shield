# 🛡️ WhatsApp Privacy Shield

A lightweight Chrome extension that automatically blurs WhatsApp Web messages during screen sharing sessions — so your personal conversations stay private during Google Meet, Zoom, or Teams calls.

---

## 🎯 The Problem

When sharing your screen during a meeting, switching to WhatsApp Web exposes your private messages to everyone watching. This extension solves that instantly — no manual toggling needed.

## ✨ Features

- **Auto-detection** — detects screen sharing and blurs automatically
- **Hover to reveal** — hover over any message or chat to read it
- **Smart modes** — Auto, Always On, and Always Off
- **Contact name stays visible** — you always know who you're chatting with
- **Persistent settings** — remembers your preference across sessions
- **Zero performance impact** — pure CSS blur, no heavy processing

## 📸 How It Works

| State | Behavior |
|---|---|
| Not screen sharing | WhatsApp works normally |
| Screen sharing starts | All chats and messages blur instantly |
| Hover over a message | That message un-blurs for you to read |
| Screen sharing stops | Everything returns to normal |

---

## 🚀 Installation

### Chrome / Edge / Brave

1. [Download the latest ZIP](../../releases/latest) and unzip it
2. Open your browser and go to `chrome://extensions`
3. Enable **Developer Mode** (toggle in top-right corner)
4. Click **Load unpacked** → select the unzipped folder
5. Go to **Details** → turn on the `web.whatsapp.com` site access toggle
6. Pin the 🛡️ icon to your toolbar via the 🧩 puzzle piece menu

### Firefox

> Firefox version coming soon.

---

## 🎮 Usage

Click the **🛡️ shield icon** in your toolbar to switch modes:

| Mode | Description |
|---|---|
| 🤖 **Auto** | Blur only activates when screen sharing is detected |
| 🔒 **Always On** | Messages are always blurred |
| 👁️ **Always Off** | Extension is disabled |

**Recommended:** Leave it on 🤖 Auto and forget about it.

---

## 🔧 How It Works (Technical)

The extension uses two detection strategies:

**1. `getDisplayMedia` interception**
Monkey-patches the browser's screen capture API. The moment you click "Share screen" in any app, the extension catches it and activates blur instantly.

**2. Polling fallback**
Every 2 seconds, scans video elements on the page for `displaySurface` tracks — catches edge cases like OBS or other tools that bypass `getDisplayMedia`.

The blur itself is pure CSS applied via a `wa-privacy-on` class on `document.body`, making it lightweight and instant.

---

## 🗂️ Project Structure

```
whatsapp-privacy-shield/
├── manifest.json      # Chrome Extension config (Manifest V3)
├── content.js         # Injected into WhatsApp Web — handles blur logic
├── detector.js        # Injected into page context — detects screen sharing
├── popup.html         # Toolbar popup UI
├── popup.js           # Popup logic — mode switching
├── privacy.css        # Blur styles
└── icon*.png          # Extension icons
```

---

## 🛠️ Tech Stack

- **JavaScript** — content scripts, Chrome APIs, async messaging
- **CSS** — blur filters, hover transitions
- **Chrome Extensions API** — Manifest V3, storage, scripting, tabs
- **Web APIs** — MediaDevices, MutationObserver, CustomEvents

---

## ⚠️ Known Limitations

- WhatsApp Web occasionally updates its HTML structure. If blur stops working after a WhatsApp update, open an issue and I'll push a fix.
- The `getDisplayMedia` hook only catches sharing that starts after WhatsApp is already open. The 2s polling fallback handles the reverse case.

---

## 🤝 Contributing

Pull requests are welcome! If WhatsApp updates their selectors and breaks the blur, updating `content.js` with the new `data-testid` values is all that's needed.

1. Fork the repo
2. Create a branch (`git checkout -b fix/selector-update`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built to solve a real problem. No tracking, no data collection, no external servers — everything runs locally in your browser.*
