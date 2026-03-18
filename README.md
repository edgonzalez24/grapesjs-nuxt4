<div align="center">

# 🎨 GrapesJS Page Builder

**A full-stack visual page builder powered by GrapesJS, Nuxt 4, and Supabase**

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js)](https://nuxt.com)
[![GrapesJS](https://img.shields.io/badge/GrapesJS-0.22-7c3aed?style=flat-square)](https://grapesjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

*Create, edit and preview multiple websites — all data persisted in Supabase.*

</div>

---

## ✨ Features

- 🖱️ **Drag-and-drop editor** — powered by GrapesJS with pre-built block sections
- 🌐 **Multi-site management** — create unlimited independent websites, each with its own URL slug
- 💾 **Full persistence** — sites and content stored in Supabase (PostgreSQL), not localStorage
- 📐 **JSON-schema driven** — GrapesJS project data (`gjson`) saved as JSONB for lossless restore
- 🔒 **Secure server API** — Supabase credentials never exposed to the browser
- ⚡ **Auto-save** — debounced 800ms save on every editor change
- 👁️ **Live preview** — rendered from server-side content at `/:siteId`
- 📱 **Responsive canvas** — Desktop / Tablet / Mobile device simulation

---

## 🏗️ Architecture

```
┌──────────────────────────────── Browser ────────────────────────────────┐
│                                                                          │
│   pages/index.vue          pages/[siteId]/edit.vue  pages/[siteId]/      │
│   (Dashboard — site list)  (Editor shell)            (Live preview)      │
│          │                        │                        │             │
│          └──────────┬─────────────┘                        │             │
│                     │   useWebsites composable              │             │
│                     │   $fetch('/api/sites')                │             │
│                                                                          │
└──────────────────────────────── Nuxt Server ─────────────────────────────┘
                                       │
              ┌────────────────────────┼─────────────────────────┐
              │                        │                          │
   GET /api/sites           POST /api/sites            DELETE /api/sites/:id
   GET /api/sites/:id/content          PUT /api/sites/:id/content
              │                        │
              └────────────────────────┤
                                       │
                             server/utils/supabase.ts
                             (createClient — server-side only)
                                       │
                              ┌────────┴────────┐
                              │    Supabase      │
                              │   PostgreSQL     │
                              │                  │
                              │ ┌──────────────┐ │
                              │ │    sites     │ │
                              │ │  id · name   │ │
                              │ │  created_at  │ │
                              │ └──────┬───────┘ │
                              │        │ FK      │
                              │ ┌──────▼───────┐ │
                              │ │ site_content │ │
                              │ │  html · css  │ │
                              │ │  gjson (JSONB│ │
                              │ │  updated_at) │ │
                              │ └──────────────┘ │
                              └──────────────────┘
```

---

## 📁 Project Structure

```
grapesjs/
├── app/
│   ├── assets/css/main.css          # Global design tokens & CSS
│   ├── components/
│   │   └── GrapesEditor.vue         # Full GrapesJS editor component
│   ├── composables/
│   │   └── useWebsites.ts           # Site CRUD via $fetch (server API)
│   └── pages/
│       ├── index.vue                # Dashboard — site cards grid
│       └── [siteId]/
│           ├── edit.vue             # Editor page wrapper
│           └── index.vue            # Live preview page
│
├── server/
│   ├── utils/
│   │   └── supabase.ts              # Server-only Supabase client
│   └── api/
│       └── sites/
│           ├── index.get.ts         # GET  /api/sites
│           ├── index.post.ts        # POST /api/sites
│           ├── [id].delete.ts       # DELETE /api/sites/:id
│           └── [id]/
│               ├── content.get.ts   # GET /api/sites/:id/content
│               └── content.put.ts   # PUT /api/sites/:id/content
│
├── nuxt.config.ts
├── .env                             # SUPABASE_URL + SUPABASE_KEY
└── package.json
```

---

## 🗄️ Database Schema

### `sites`
| Column | Type | Description |
|---|---|---|
| `id` | `TEXT` (PK) | URL slug, e.g. `my-portfolio` |
| `name` | `TEXT` | Human-readable display name |
| `created_at` | `TIMESTAMPTZ` | Auto-set on insert |

### `site_content`
| Column | Type | Description |
|---|---|---|
| `site_id` | `TEXT` (PK, FK → sites) | Cascades on site delete |
| `html` | `TEXT` | GrapesJS exported HTML |
| `css` | `TEXT` | GrapesJS exported CSS |
| `gjson` | `JSONB` | **Full GrapesJS JSON schema** — components + styles tree |
| `updated_at` | `TIMESTAMPTZ` | Last save timestamp |

> **Why `gjson`?** GrapesJS's `editor.getProjectData()` exports the full component tree as a JSON object. Storing it as JSONB gives lossless round-trip restore via `editor.loadProjectData()`, preserving every style property and nested component exactly. The `html` + `css` columns serve as a rendered fallback for the preview page.

---

## 🔄 Data Flow

### Creating a website
```
User types name → POST /api/sites { name }
  → slugify("My Portfolio") = "my-portfolio"
  → INSERT INTO sites (id, name)
  → redirect to /my-portfolio/edit
```

### Editing & auto-saving
```
GrapesJS editor mounts
  → GET /api/sites/:id/content
  → if gjson exists: editor.loadProjectData(gjson)   ← full schema restore
  → else if html:    editor.setComponents(html)        ← html/css fallback

User drags a block / edits content
  → editor fires "update" event
  → debounce 800ms
  → PUT /api/sites/:id/content { html, css, gjson }
  → UPSERT INTO site_content
```

### Preview
```
GET /:siteId
  → fetch /api/sites/:id/content
  → render <style>{css}</style>{html} inside the page
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone <repo>
cd grapesjs
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com), then run the following SQL in the **SQL Editor**:

```sql
CREATE TABLE public.sites (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_content (
  site_id    TEXT PRIMARY KEY REFERENCES public.sites(id) ON DELETE CASCADE,
  html       TEXT NOT NULL DEFAULT '',
  css        TEXT NOT NULL DEFAULT '',
  gjson      JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

> Use the **service role key** (not the anon key) since calls are made server-side only and never exposed to the browser.

### 4. Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🧱 Available Blocks

| Block | Category | Description |
|---|---|---|
| **Text & Banner** | Sections | Full-width hero with gradient background, headline, CTA buttons |
| **Multi Cols (2)** | Sections | Two-column feature layout with icon cards |
| **Multi Cols (3)** | Sections | Three-column showcase layout |
| **Text Content** | Basic | Minimal article-style text block |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3 + Nitro) |
| Page Builder | [GrapesJS 0.22](https://grapesjs.com) |
| Database | [Supabase](https://supabase.com) (PostgreSQL) |
| Language | TypeScript |
| Styling | Vanilla CSS with design tokens |
| Fonts | Inter via Google Fonts |

---

## 📜 Scripts

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Build for production
npm run preview   # Preview production build
```

---

<div align="center">

Made with ❤️ using GrapesJS + Nuxt 4 + Supabase

</div>
