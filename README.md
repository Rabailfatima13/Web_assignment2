# EventHub – Event Management System

A React web app for exploring real events from the **Ticketmaster Discovery API**, registering for them, and managing your registrations.

Built for Web Programming – Assignment 2 using **React**, **Redux Toolkit**, and **React Router**.

## Features

- **User accounts:** register, log in and log out (a frontend simulation, with data stored in localStorage). You stay logged in after a page refresh.
- **Browse events:** upcoming events from Ticketmaster, shown as cards with image, date, venue and category.
- **Search:** keyword search that waits until you stop typing before calling the API.
- **Filters:** category chips (loaded from the API), city, and a from/to date range.
- **Pagination** through results.
- **Event details:** image, date and time, venue, full address, category and genre, sale status, price range, event info, notes, seat map, and a link to Ticketmaster.
- **Event registration:** logged-in users can register for an event and cancel later. Duplicate registrations are blocked, and a message confirms each action.
- **My Events:** your registrations split into **Upcoming** and **Completed** tabs. Upcoming registrations can be cancelled.
- **Protected routes:** My Events requires login. After logging in you return to the page you wanted.
- **Loading and error states** for every API call, with a "Try again" button.
- **Form validation** on Login, Register and the date filter.
- **Responsive design** that works on phones and desktops, in light and dark mode.

## Tech stack

| Tool | Used for |
|---|---|
| React 19 + Vite | UI and development server |
| Redux Toolkit + React Redux | Shared state: auth, events, registrations |
| React Router | Page navigation and protected routes |
| Ticketmaster Discovery API v2 | Event, category and venue data |

## Getting started

### 1. Requirements
- [Node.js](https://nodejs.org/) 18 or newer
- A free Ticketmaster API key

### 2. Get a Ticketmaster API key
1. Sign up at <https://developer.ticketmaster.com/>.
2. Open **My Apps** and copy the **Consumer Key**. This is your API key.

### 3. Install and run

```bash
git clone https://github.com/Rabailfatima13/Web_assignment2.git
cd Web_assignment2
npm install
```

Create a file called `.env` in the project root, next to `package.json`, by copying `.env.example`:

```
VITE_TM_API_KEY=your_consumer_key_here
```

Then start the app:

```bash
npm run dev
```

Open the address shown in the terminal (usually <http://localhost:5173>).

> `.env` is listed in `.gitignore`, so your key is never committed. If you change `.env`, restart `npm run dev`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production version into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the code with ESLint |

## Project structure

```
src/
├── api/ticketmaster.js        # All Ticketmaster requests + data simplifying
├── app/store.js               # configureStore + saving to localStorage
├── features/
│   ├── auth/authSlice.js      # users, currentUser, register/login/logout
│   ├── events/eventsSlice.js  # event list, filters, page, categories, selected event
│   └── registrations/registrationsSlice.js  # registrations per user
├── components/                # Reusable UI (Navbar, EventCard, SearchBar, Filters, ...)
├── pages/                     # One file per route
├── utils/formatDate.js        # Date formatting + "is this event in the past?"
├── App.jsx                    # Routes
└── main.jsx                   # Provider + BrowserRouter
```

## Routes

| Path | Page | Login needed |
|---|---|---|
| `/` | Events (search, filters, list) | No |
| `/events/:id` | Event details + register | No (login needed to register) |
| `/login` | Login | No |
| `/register` | Register | No |
| `/my-events` | My Events | **Yes** |
| `*` | 404 Not Found | No |

## Redux state

| Slice | State | Actions |
|---|---|---|
| `auth` | `users`, `currentUser`, `error` | `registerUser`, `loginUser`, `logout`, `clearAuthError` |
| `events` | `items`, `status`, `error`, `page`, `filters`, `currentPage`, `categories`, `selectedEvent` | `setFilters`, `clearFilters`, `setPage` + thunks `fetchEvents`, `fetchCategories`, `fetchEventById` |
| `registrations` | `byUser` (user id → list of events) | `registerForEvent`, `cancelRegistration` |

The `auth` and `registrations` slices are saved to localStorage after every change, and loaded again when the app starts.

## Notes and limitations

- Authentication is a **frontend-only simulation**, as the assignment allows. Passwords are stored in plain text in localStorage, which a real app must never do. Real apps check passwords on a server and store them hashed.
- The API key is in a Vite environment variable, so it is not in the repository. It is still visible in the browser while the app runs, which is normal for frontend-only apps.
- Ticketmaster allows about 2 requests per second and 5,000 per day, and only returns the first 1,000 results of a search.
- The "To" date is compared in UTC by Ticketmaster, so a small number of results can fall on the day after the chosen date.
