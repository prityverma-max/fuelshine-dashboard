# Fuelshine 90-Day Sprint Dashboard

Weekly tracker for the two acquisition motions and the raise, with a full
change history.

- **Saves persist.** Everything entered is written to a database, not to the page.
- **Every save is versioned.** Who saved it, when, and exactly which fields moved.
- **Status tracking** on 34 decision rows (IP actions, associations, channels,
  verticals) — auto-saved and logged into the same timeline.
- **Any version can be restored** — and restoring writes a *new* version rather
  than erasing anything.

---

## Why the old version lost everything on refresh

The previous single-file page stored data through `claude.use('db')`. That is a
Claude Artifact runtime API — it only exists when the page is served by Claude.
On any other host (Wix, Vercel, a local file) the `claude` object does not exist,
so that line threw and the save button never even got wired up. There was no
database behind the page at all.

This version replaces that one line with a real storage layer (`assets/store.js`).

---

# Setup

Three stages: **GitHub → Vercel → Supabase.** Roughly 25 minutes end to end.
You can do GitHub and Vercel first and see it live, then add the database.

---

## Stage 1 — Put the code on GitHub

### If you have never used Git on this machine

Install [GitHub Desktop](https://desktop.github.com) — it avoids the command
line entirely:

1. Open GitHub Desktop → sign in with your GitHub account.
2. **File → New Repository.**
   - Name: `fuelshine-dashboard`
   - Local path: pick a folder
   - Leave everything else default → **Create Repository**
3. Open that newly created folder in Finder/Explorer, and copy the **contents**
   of this project into it — `index.html`, the `assets` folder, the `supabase`
   folder, `vercel.json`, `README.md`, `.gitignore`.
   Make sure `index.html` sits at the **top level**, not inside a subfolder.
4. Back in GitHub Desktop you'll see all the files listed as changes. Type a
   summary like `Initial dashboard` → **Commit to main**.
5. Click **Publish repository**. Untick *"Keep this code private"* only if you
   want it public — **leave it ticked**, this is internal.

### If you're comfortable with the terminal

```bash
cd fuelshine-dashboard
git init
git add .
git commit -m "Fuelshine sprint dashboard with persistence and change history"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fuelshine-dashboard.git
git push -u origin main
```

Create the empty repo on github.com first (**New repository**, no README, no
.gitignore — this project already has one).

---

## Stage 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub** (authorise it).
2. **Add New… → Project.**
3. Find `fuelshine-dashboard` in the list → **Import**.
4. On the configure screen:
   - Framework Preset: **Other**
   - Build Command: **leave empty**
   - Output Directory: **leave empty**
   - Install Command: **leave empty**

   This is a static site with no build step. If Vercel guesses a framework,
   change it back to *Other*.
5. **Deploy.** It takes about 30 seconds.

You now have a live URL like `fuelshine-dashboard.vercel.app`. **Every push to
`main` redeploys automatically** — commit in GitHub Desktop, hit Push, and the
site updates in under a minute.

### Custom domain (optional)

Vercel project → **Settings → Domains** → add `sprint.getfuelshine.com` →
create the CNAME record Vercel shows you at your DNS provider.

---

## Stage 3 — Connect the database

Until you do this, the dashboard saves into `localStorage` — that browser on that
device only. It works, but nothing is shared, and an amber
**"Browser-only storage"** banner sits at the top of the page saying so.

1. [supabase.com](https://supabase.com) → **New project**. Free, no card.
2. Name it, set a strong database password, pick the region closest to the team.
3. When it finishes provisioning: **SQL Editor → New query**.
4. Paste the whole of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   You should see *"Success. No rows returned."*
5. **Project Settings → API**, copy two values:
   - **Project URL** — `https://abcdefgh.supabase.co`
   - **anon / public** key — a long string starting `eyJ…`

> Copy the **anon** key, never `service_role`. The anon key is meant for
> client-side code and row-level security limits what it can touch.
> `service_role` bypasses all of it and must never be committed.

6. Open `assets/config.js` and fill them in:

```js
export const SUPABASE_URL = 'https://abcdefgh.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

While you're there, edit `EDITORS` to the people who will actually log numbers.

7. Commit and push. Vercel redeploys, and the banner turns green:
   **"Connected."**

---

## Running it locally

ES modules need a real HTTP server — double-clicking `index.html` fails with a
CORS error. From the project folder:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
npx serve                       # or this
```

---

## How the change history works

Every save — weekly numbers or a status dropdown — does two writes:

| Table | What happens | Purpose |
|---|---|---|
| `weeks` / `trackers` | The current row is overwritten | What the charts and tables read |
| `change_log` | A **new row** is appended | Permanent audit trail |

The appended row stores the full snapshot *plus* a computed diff of every field
that changed against the previous save — old value, new value, field label, who
saved it, and an optional note.

`change_log` has no update or delete policy in the schema, so nothing in the
browser can rewrite or remove history. **Restore** reads an old version's values
and saves them as a fresh entry, noted `Restored from version N`. The rollback
itself becomes part of the record.

**Export JSON** downloads every week, status and history entry — use it as a
backup before any risky change.

---

## Editing the content

All plan copy — phases, channel stack, verticals, rules, team, moat table,
objections — lives in **`assets/data.js`** as plain arrays. Edit, commit, push.
You never need to touch the HTML or the app logic.

To add a *tracked field*, add an entry to `FIELD_DEFS` in `data.js` and a
matching `<input id="f_yourFieldName">` in `index.html`. Saving, diffing and the
change log pick it up automatically.

To add a *status-tracked row*, give it a new key in the relevant table (`ip:9`,
`assoc:6`, …). **Never renumber an existing key** — the key is what ties a row to
its history.

---

## File layout

```
index.html              markup only
assets/
  config.js             ← your two Supabase values + editor names
  data.js               all plan content + field definitions + status sets
  store.js              persistence, diffing, versioning, restore
  app.js                rendering and wiring
  styles.css            brand palette + type scale
  logo.png              Fuelshine mark (header + favicon)
supabase/schema.sql     run once in the Supabase SQL editor
vercel.json             static-hosting config
```

---

## Branding

Colours are taken from the Fuelshine logo artwork, not approximated:
green `#6DB43A`, deep green `#3B6D11`, navy `#16243B`, with **warm** greys
(`#6B6A65`, `#ECECE7`). No blue anywhere, white background throughout, light-only
— matching getfuelshine.com, which has no dark variant.

Type is Plus Jakarta Sans (display) and Inter (body) on a fixed 10-step scale,
with tabular figures everywhere numbers are compared down a column.

---

## Security note

This tool has no login. Anyone with the URL can read and edit the numbers, and
the anon key in `config.js` is visible to anyone who views source — normal for an
internal tool of this kind, and RLS limits that key to these three tables.

Given it holds MRR, CAC, investor pipeline detail and named prospects, **treat
the URL as confidential.** To genuinely lock it down, the next step is Supabase
Auth with email magic links, then tightening the RLS policies in `schema.sql`
from `using (true)` to `using (auth.role() = 'authenticated')`.
