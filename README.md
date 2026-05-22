# Trello Clone

Live demo: http://65.2.121.56:3000/

This project is a Trello-style task board with a Django REST API backend and a Next.js frontend. It supports user authentication, board columns, unassigned tasks, drag-and-drop task movement, card copying, and task management with live API-backed state.

## Project Structure

- `backend/` - Django API server
- `frontend/` - Next.js application

## Tech Stack

### Backend

- Python 3
- Django 6
- Django REST Framework
- PostgreSQL
- JWT authentication with HTTP-only cookies
- CORS support via `django-cors-headers`
- `psycopg2` for PostgreSQL connectivity
- `PyJWT` for token handling
- `bcrypt` password hashing

### Frontend

- Next.js 16
- React 19
- Redux Toolkit
- React Redux
- Axios
- `@dnd-kit` for drag and drop
- `react-hook-form` and `zod` for form handling and validation
- `framer-motion` for motion and transitions
- `sonner` for toast notifications
- `date-fns` for date handling
- Tailwind CSS 4

## Features

- User registration and login
- JWT-based authentication stored in an HTTP-only cookie
- Dashboard board with draggable tasks
- Create, edit, delete, and copy cards
- Create, edit, detach, and permanently delete tasks
- Unassigned task inbox in the sidebar
- Task search in the sidebar
- Task details modal with edit and delete actions
- Copy a card and its tasks to another user
- Live refresh of board state after mutations

## How It Works

### Authentication Flow

1. A user registers with name, email, and password.
2. Login returns a JWT that is stored in a browser cookie named `jwt`.
3. Frontend requests include credentials so the backend can identify the user.
4. If the token is missing, invalid, or expired, the app treats the session as unauthenticated and redirects to login.

### Board Workflow

1. The dashboard loads cards, unassigned tasks, and all tasks from the API.
2. Cards represent board columns.
3. Tasks can exist without a card in the inbox, or inside a card column.
4. Dragging a task onto a card assigns it to that card.
5. Dragging a task back to the inbox detaches it from the card.
6. Card and task changes refresh the store so the UI stays in sync with the backend.

### Card Workflow

- Create a new card with a name, optional due date, and optional tags.
- Edit card metadata.
- Delete a card and all tasks assigned to it.
- Copy a card to another user, including its tasks.

### Task Workflow

- Create a task as an unassigned inbox item or directly under a card.
- Edit title, description, file URL, and status.
- Open a task details modal for review or editing.
- Detach a task from a card without deleting it.
- Permanently delete a task when needed.

## API Overview

The frontend talks to the backend using these main routes:

- `POST /auth/register/`
- `POST /auth/login/`
- `POST /auth/logout/`
- `GET /auth/users/`
- `GET /cards/`
- `POST /cards/create/`
- `POST /cards/copy/`
- `POST /cards/<card_id>/update/`
- `POST` or `DELETE /cards/<card_id>/delete/`
- `GET /tasks/`
- `GET /all-tasks/`
- `POST /tasks/create/`
- `POST /tasks/<task_id>/update/`
- `POST /tasks/<task_id>/delete/`
- `POST /tasks/<task_id>/hard-delete/`

## Data Model

### User

- `name`
- `email`
- `password`
- timestamps

### Card

- `user`
- `card_name`
- `due_date`
- `tags`
- timestamps
- nested tasks

### Task

- `user`
- `card`
- `task_title`
- `task_description`
- `task_file_url`
- `status`
- timestamps

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Frontend

Create or update `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:3000`.

## Build and Run

### Frontend production build

```bash
cd frontend
npm run build
npm run start
```

### Backend production notes

- The backend is configured for PostgreSQL.
- CORS is enabled for cross-origin frontend requests.
- Update database and secret settings before using this in a production environment.

## Deployment Notes

- The hosted frontend is available at http://65.2.121.56:3000/
- Make sure `NEXT_PUBLIC_API_URL` points to the deployed backend API.
- The frontend depends on cookie-based auth, so backend and frontend domains should be configured carefully in production.

## Summary

This repository is a full-stack Trello-style board built with Django REST Framework on the backend and Next.js on the frontend. The app focuses on a simple workflow: authenticate, create cards, create or move tasks, and keep the board synchronized with live API state.