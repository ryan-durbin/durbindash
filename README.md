# DurbinDash

A **1990s Yahoo/AOL-style personal dashboard** for self-hosted apps.

Remember when the internet felt cozy? When portals were your home base — weather in the corner, RSS feeds down the side, links to your favorite bookmarks all on one page? DurbinDash brings that nostalgic aesthetic to your self-hosted homelab.

Inspired by **Yahoo! circa 1997** and the classic **AOL portal** experience, DurbinDash is your retro-styled gateway to all your self-hosted services.

---

## About

DurbinDash is a personal dashboard with a deliberate retro aesthetic. Think table-based layouts, link directories, and the warm glow of a CRT monitor. It's functional, fast, and unashamedly old-school.

---

## Features (Planned)

- 🌐 Portal-style layout inspired by Yahoo! and AOL from the late 90s
- 📰 RSS feed aggregator
- 🔗 Quick links to self-hosted services
- 🌤 Weather widget
- ⚙️ Personal dashboard for your homelab apps
- 🖥 Retro CSS styling (think Times New Roman, blue links, and table layouts)

---

## Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **npm** (comes with Node.js)
- **git**

### Installation

```bash
git clone https://github.com/ryan-durbin/durbindash.git
cd durbindash
npm install
```

### Running

```bash
npm start
```

Open [http://localhost:7748](http://localhost:7748) in your browser.

> **Port:** 7748

---

## Tech Stack

- **Runtime:** Node.js v22+
- **Framework:** Express
- **Port:** 7748

---

## Project Structure

```
durbindash/
├── public/          # Static assets (HTML, CSS, JS, images)
├── server.js        # Express server
├── package.json
└── README.md
```

---

## Dependencies

- `express` — Web server
- `node-fetch` — HTTP requests
- `rss-parser` — RSS/Atom feed parsing

---

## The Aesthetic

DurbinDash is unapologetically retro. The design draws inspiration from:

- **Yahoo!** (circa 1997) — categorized link directories, portal widgets
- **AOL portal** — the feeling of "you've got everything on one page"

If it doesn't look like it belongs in a Netscape Navigator window, we're doing it wrong.
