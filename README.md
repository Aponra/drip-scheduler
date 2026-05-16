# Docs Version History

A writing scheduler that drips your text into a fresh Google Doc on a pace you choose — minutes, hours, or days. Write or import a draft, pick a duration, and watch it stream into Google Docs block-by-block, with formatting preserved.

Live: [https://docsversionhistory.com](https://docsversionhistory.com)

---

## How It Works

1. **Sign in with Google.** Firebase Authentication handles the login.
2. **Write or import.** Type in the rich-text editor, or import a `.txt`, `.md`, `.docx`, or `.pdf` (parsed entirely in your browser).
3. **Pick a duration.** Choose a preset from 30 minutes to a full week, or set a custom interval per chunk.
4. **Click Start Dripping or Export to Google Docs.** The app either previews the chunks in a Sent feed (local) or creates a new Google Doc and streams your content into it on schedule (remote), preserving headings, bold/italic/underline, lists, links, and colors.

You can save schedules to load again later, stop mid-run, and reconnect Google Docs at any time.

---

## Target Users

- **Writers and students** who want to pace a long draft over a window instead of pasting it all at once.
- **Bloggers and content folks** drafting in Markdown, Word, or PDF who want a clean format-aware path into Google Docs.
- **Productivity nerds** who like scheduled work, "soak" intervals, or controlled review-as-you-write workflows.

### Why use it

- You keep one canonical source for your writing and only push it into Google Docs when you're ready.
- Formatting survives the trip — no manual re-styling once it lands.
- Long imports don't have to live in a single mega-paste in the doc.
- File parsing happens client-side, so uploaded files never touch a server.

---

## Project Details

### Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4 |
| Rich-text editor | TipTap 3 (StarterKit + TextStyle + Color + Highlight) |
| Auth | Firebase Authentication (Google provider) |
| Database | Cloud Firestore |
| Google Docs integration | `googleapis` SDK with OAuth 2.0 |
| Document parsing | `mammoth` (.docx → HTML), `pdfjs-dist` (.pdf → text), browser `FileReader` (.txt / .md) |
| Hosting | Vercel |
| Fonts | Geist Sans + Geist Mono |

### Features

- Drag-and-drop document import with type + size validation (25 MB cap)
- TipTap rich-text editor: bold, italic, underline, H1–H3, bullet + numbered lists, links, text color, highlight color
- Duration presets (30 min, 1 hr, 2 hrs, 6 hrs, 12 hrs, 1 day, 3 days, 1 week) + custom interval
- Save / Load / Delete schedules to Firestore, scoped per user
- Local "Sent" feed previewing how chunks will land
- Format-aware Google Docs export: per-block insert + `updateTextStyle` / `updateParagraphStyle` / `createParagraphBullets`
- Retry with exponential backoff (5 attempts; only retries network and 5xx errors)
- Stop mid-export — the doc keeps everything that was already written
- Connection status toasts (success, permission-denied, generic error)
- HTTP-only cookie token storage (tokens never persist on the server-side database)

### App routes

| Route | Purpose |
|---|---|
| `/` | Marketing landing page when signed out; dashboard when signed in |
| `/privacy` | Privacy policy (incl. Google API Limited Use disclosure) |
| `/terms` | Terms of service |
| `/api/google-docs/auth` | Initiates the OAuth flow (`drive.file` scope only) |
| `/api/google-docs/callback` | Exchanges the auth code for tokens, sets HTTP-only cookies |
| `/api/google-docs/status` | Returns `{ connected: boolean }` based on cookie presence |
| `/api/google-docs/export` | Creates a new, empty Google Doc and returns `{ documentId, documentUrl }` |
| `/api/google-docs/append` | Appends text to the doc (end-of-segment or at a given index) |
| `/api/google-docs/batch` | Generic forwarder for batchUpdate requests (style + bullets) |

### Scopes

The app uses the **single minimum** scope required:

```
https://www.googleapis.com/auth/drive.file
```

This means the app can read and modify only the documents it itself creates. It cannot list, see, or touch any other content in your Drive.

---

## Goals

The app exists to solve a small but real set of problems:

- **One-shot paste fatigue.** Long imports into Google Docs are awkward — version history balloons, the editor lags. Dripping content over a window is calmer.
- **Format loss.** Pasting from Word, PDF, or Markdown into Google Docs frequently mangles headings, lists, and links. The format-aware export pipeline keeps them intact.
- **No "scheduled writing" tool.** Most writing apps publish at the end. This one publishes throughout — useful if you want a controlled rollout, or want to step through a long doc in your own time.
- **Keeping your source of truth.** Drafts live in the app's rich editor (and optionally Firestore); Google Docs is just a destination, not the working surface.

---

## Usage

### Live

[docsversionhistory.com](https://docsversionhistory.com) — sign in with Google and you're set.

### Local development

#### 1. Clone and install

```bash
git clone https://github.com/Aponra/drip-scheduler.git
cd drip-scheduler
npm install
```

#### 2. Create a Firebase project

- Enable **Authentication → Sign-in method → Google**.
- Add `localhost` to **Authentication → Settings → Authorized domains**.
- In **Project settings → General**, copy the Web app config.

#### 3. Create a Google Cloud OAuth client

In **APIs & Services**:

- **OAuth consent screen** — fill in app name, support email, and add yourself as a Test user.
- **Credentials → Create OAuth client ID → Web application**:
  - Authorized JavaScript origins: `http://localhost:3000`
  - Authorized redirect URIs: `http://localhost:3000/api/google-docs/callback`
- Enable the **Google Docs API** in the **Library** (the Drive API is already enabled for `drive.file`).

#### 4. Configure environment variables

Create a `.env.local` at the repo root:

```bash
# Firebase web app config
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Google OAuth (server-side only)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-docs/callback
```

#### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production checklist

When deploying to your own domain (e.g. via Vercel):

- Set the env vars above in your hosting provider, with `GOOGLE_REDIRECT_URI` pointing at the production callback (`https://yourdomain.com/api/google-docs/callback`).
- Add the production domain to Firebase **Authorized domains**.
- Add the production origin and redirect URI to your Google OAuth client.
- Update the **OAuth consent screen** with the production home, privacy (`/privacy`), and terms (`/terms`) URLs.

---

## Credits / Contact

Built by **Apon**. Source: [github.com/Aponra/drip-scheduler](https://github.com/Aponra/drip-scheduler).

Questions, bug reports, or data-deletion requests: [abuisaapon962974@gmail.com](mailto:abuisaapon962974@gmail.com).

See [/privacy](https://docsversionhistory.com/privacy) and [/terms](https://docsversionhistory.com/terms) for the privacy policy and terms of service.
