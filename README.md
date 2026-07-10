# TaskBoard — Task Management System

**Built by Aarya Shirsath**

A full-stack task management app: a login page that opens onto a Task
Management board where admins log employee tasks and mark them complete.

- **Frontend:** HTML, CSS, JS (`/frontend`)
- **Backend (middleware):** Python + Flask (`/backend`)
- **Database:** MySQL (`schema.sql`), 2 tables: `users` (login) and `tasks` (task management)

## What's new in this version

- **Redesigned UI** — a split-panel login screen, a teal-and-amber visual
  identity, Fraunces/Manrope/JetBrains Mono type pairing, and a proper card
  layout with focus states and hover feedback instead of the plain boxed
  wireframe look.
- **Live task list** — the Task Management page now pulls every saved task
  from `GET /api/tasks` and shows it as a running ledger below the form,
  with a colored tab and status pill (Done / Pending) per row. The list
  refreshes automatically after each save.
- **Signed-in greeting + logout** — the top bar shows who's logged in
  (remembered from the login page for the session) and a logout link that
  clears it.
- Fully responsive: the login panel collapses to a single column and the
  ledger reflows on narrow/mobile screens.

Functionality is unchanged: the Flask API, MySQL schema, and request/response
shapes are exactly the same as before, so nothing on the backend needs to
change to use this version.

## 1. Set up MySQL

```bash
mysql -u root -p < schema.sql
```

This creates the `task_management_db` database with:
- `users` — login table (id PK auto-increment, username, password_hash, role)
- `tasks` — task management table (task_id PK auto-increment, employee_name, task_title, completed)

`task_id` is generated automatically by MySQL `AUTO_INCREMENT` — the frontend never sends it.

## 2. Set up the backend

```bash
cd backend
pip install -r requirements.txt
```

Edit `DB_CONFIG` at the top of `app.py` (and in `create_admin.py`) with your MySQL
username/password.

Create your first admin login:

```bash
python create_admin.py
# enter a username and password when prompted
```

Start the API server:

```bash
python app.py
```

The backend runs at `http://localhost:5000` and exposes:
- `POST /api/login` — `{ username, password }` → checks the `users` table (bcrypt password check)
- `POST /api/tasks` — `{ employee_name, task_title, completed }` → inserts a row into `tasks`, MySQL generates `task_id`
- `GET /api/tasks` — lists all saved tasks (now used by the frontend to render the live task list)

## 3. Open the frontend

Just open `frontend/login.html` in your browser (or serve the folder with any
static server, e.g. `python -m http.server` from inside `frontend/`).

Flow:
1. `login.html` — enter the admin username/password created in step 2 → on success, redirects to `task_management.html`
2. `task_management.html`:
   - Top bar shows who's signed in, with a logout link
   - **New task** card — Task Id (auto-generated), employee name, task title
     (task1/task2/task3), completed (true/false), Save task
   - **Recent tasks** ledger — every saved task, newest first, with a
     Done/Pending status pill

## Notes

- Passwords are hashed with `bcrypt` before being stored — never stored in plain text.
- CORS is enabled on the Flask app so the frontend (opened as a plain file or from
  a different port) can call the API.
- If you'd rather use radio buttons instead of a dropdown for "Completed", swap the
  `<select>` in `task_management.html` for two `<input type="radio" name="completed">`
  inputs (`true` / `false`) — the JS and backend already accept either as long as the
  value sent is the string `"true"` or `"false"`.
- Fonts (Fraunces, Manrope, JetBrains Mono) load from Google Fonts via `style.css`;
  an internet connection is needed the first time the page loads for them to render
  with the intended type styles (the page still works fine offline, just falls back
  to system fonts).
