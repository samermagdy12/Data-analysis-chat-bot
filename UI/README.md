# Analyst Console

A ChatGPT/Claude-style frontend for the **AI Data Analyst** FastAPI backend found in
`first llm project/app`. Upload a CSV/Excel dataset and chat with it — the assistant
answers using descriptive statistics, missing-value/duplicate checks, value counts,
sandboxed Python execution, and matplotlib charts (histogram, bar, line, scatter, pie,
box, correlation heatmap), all driven by the backend's tool-calling loop.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS · shadcn/ui-style components (Radix
primitives) · Axios · TanStack React Query · Zustand · react-markdown + remark-gfm ·
react-syntax-highlighter · react-dropzone

## How this maps to the real backend

| Frontend action | Backend call | Notes |
|---|---|---|
| Drop a CSV/XLSX in a new analysis | `POST /api/upload` (multipart, field `file`) | Creates a **new** session server-side and returns `session_id`. There is no endpoint to attach a second dataset to an existing session — a new file always starts a new analysis. |
| Send a message | `POST /api/chat` `{ session_id, message }` | Returns `{ answer, success, message, result, chart, metadata }`. `chart` is a raw base64 PNG (no `data:` prefix) — the UI renders it directly. `result` shape varies by tool (dict, list-of-records, or a scalar), so the UI renders it generically. |
| Sidebar "Delete" | `DELETE /api/sessions/{id}` *(optional, see below)* | Best-effort; failures are swallowed since chat history is otherwise tracked entirely client-side. |

**Important architectural fact discovered while reading the backend:** a chat session
cannot exist without an uploaded dataset (`session_manager.create_session()` is only
ever called from `upload_service.py`). There is no "general chat" mode and no
endpoint to list existing sessions or fetch a session's history. Because of this:

- The sidebar's chat list, search, and message history are maintained **entirely
  client-side** (Zustand + localStorage). This is a deliberate design choice, not an
  oversight — the backend has nothing to list against.
- "New analysis" starts a *draft* chat with no `session_id` yet; the first file
  upload is what mints the real backend session and turns the draft into a real chat.
- The message composer is disabled until a dataset has been uploaded for that chat.

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your backend isn't on localhost:8000
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000/api` | Backend root **including** the `/api` prefix that `main.py` mounts both routers under. |

### Production build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Required/recommended backend changes

The frontend works against the backend **as-is** for uploading and chatting. Two
changes are recommended, provided in `backend-patch/` (drop-in replacements/additions
for the files in `first llm project/app`):

1. **CORS** (`app/main.py`) — the original config uses
   `allow_origins=["*"]` with `allow_credentials=True`, which most browsers reject
   outright and is unsafe if it did work. The patch restricts it to the Vite dev
   origin (`http://localhost:5173`) plus a placeholder for your deployed frontend.

2. **Optional `app/routs/sessions.py`** — adds `GET /api/sessions`,
   `GET /api/sessions/{id}/history`, and `DELETE /api/sessions/{id}` so the sidebar's
   "Delete" action can also free the session on the server, and so a future
   debug/admin view can list what's in memory. The frontend calls `DELETE` best-effort
   already; it works fine without this endpoint (it just leaves the session in
   server memory until restart).

To apply: copy `backend-patch/app/main.py` over the existing one, and copy
`backend-patch/app/routs/sessions.py` into `app/routs/`. No other backend files need
to change for the frontend to function.

### Pre-existing issues worth fixing (not patched here, since they touch secrets/config)

- `app/config.py` calls `os.getenv("gsk_...")` — passing the **key value** as the
  env var *name* instead of reading e.g. `os.getenv("OPENAI_API_KEY")`. This means
  `OPENAI_API_KEY` is always `None`.
- `app/llm.py` hardcodes a live Groq API key directly in source instead of using
  `app.config.OPENAI_API_KEY`. This key should be rotated and moved into `.env`.
- `app/tools.py` at the project root is dead code (fully commented out); the actual
  tools live in `app/tools/` (the package) and are wired via `app/tools/__init__.py`.
  Harmless, but worth deleting to avoid confusion.

None of these block the frontend — they affect whether the backend's LLM calls
succeed, which is orthogonal to this UI.

## Project structure

```
src/
  lib/            # types.ts (API contracts), api.ts (axios client), utils.ts
  store/          # useChatStore.ts — Zustand store, persisted to localStorage
  hooks/          # useTheme, useAnalystApi (React Query mutations)
  components/
    ui/           # shadcn-style primitives (Button, Dialog, Dropdown, Tooltip, …)
    layout/       # Sidebar
    chat/         # ChatWindow, MessageBubble, MarkdownRenderer, CodeBlock,
                   # ResultView (generic table renderer for tool results),
                   # ChartImage, FileDropzone, EmptyState, MessageInput, DatasetChip
    settings/     # SettingsDialog
```

## Design notes

Dark "ink & cyan" theme (light mode included) chosen to sit alongside your EyeDrive
branding without duplicating it outright — deep navy surfaces, a cyan/teal accent for
assistant responses and interactive elements, Space Grotesk for headings, Inter for
body text, and JetBrains Mono for tabular/numeric data so dataset values are easy to
scan. Assistant messages carry a thin left accent border as a "trace" motif, and the
dataset chip pinned above the thread reads like a spec plate for the loaded file.
