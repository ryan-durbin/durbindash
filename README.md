# DurbinDash

A **1990s Yahoo/AOL-style personal dashboard** for self-hosted apps.

Remember when the internet felt cozy? When portals were your home base — weather in the corner, RSS feeds down the side, links to your favorite bookmarks all on one page? DurbinDash brings that nostalgic aesthetic to your self-hosted homelab.

## Features

- 🌐 Portal-style layout inspired by Yahoo! and AOL from the late 90s
- 📰 RSS feed aggregator
- 🔗 Quick links to self-hosted services
- 🌤 Weather widget
- ⚙️ Personal dashboard for your homelab apps

## Tech Stack

- **Runtime:** Node.js v22+
- **Framework:** Express
- **Port:** 7748

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:7748](http://localhost:7748) in your browser.

## Project Structure

```
durbindash/
├── public/          # Static assets (HTML, CSS, JS, images)
├── server.js        # Express server
├── package.json
└── README.md
```

## Dependencies

- `express` — Web server
- `node-fetch` — HTTP requests
- `rss-parser` — RSS/Atom feed parsing
