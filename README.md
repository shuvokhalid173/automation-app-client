# File System Wrapper — Frontend Dashboard

React.js dashboard for browsing, filtering, and managing files.

## Setup

```bash
cd frontend
npm install
npm start
```

The app expects the backend at `http://localhost:3000` by default. Override with:
```bash
REACT_APP_API_URL=http://your-api:3000/api npm start
```

## Features

- **Domain Filter** — Dropdown populated from `/api/domains`
- **Mailbox Filter** — Dependent dropdown, loads from `/api/mailboxes?domain_id=X`
- **Year-Month Filters** — Native month picker for downloaded & uploaded dates
- **File Table** — Sortable columns with pagination
- **Actions** — View metadata modal, open PDF in new tab, upload trigger
- **Auto-Upload Switch** — Read-only toggle showing `!is_manually_uploaded`
