# 🎬 MovieMate Lite

A lightweight movie browsing and watchlist management app built with React, TypeScript, and Material UI — powered by a local JSON Server backend.

---

## ✨ Features

- **Browse Movies** — Search by title, filter by genre, and sort by rating
- **Watchlist** — Add movies to your personal watchlist (requires login)
- **Trending Genre** — Highlights the most-watched genre in your watchlist
- **Authentication** — Register and log in as a regular user or admin
- **Role-Based Access** — Admin-only pages for adding movies and viewing analytics
- **Analytics Dashboard** — View average ratings, genre breakdowns, and top-rated films (admin only)
- **Profile Management** — Update personal details and change your password
- **Dark/Light Theme** — Toggle between themes via the header
- **Responsive UI** — Built with MUI components for a clean, responsive experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| UI Library | Material UI (MUI v7) |
| Routing | React Router v7 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Backend | JSON Server (mock REST API) |
| Build Tool | Vite |
| Testing | Jest + Testing Library |

---

## 📁 Project Structure

```
MovieMate-Lite/
├─ public/
│  └─ images/
│     ├─ Fight Club.jpg
│     ├─ Inception.jpg
│     ├─ Interstellar.jpg
│     ├─ Kung Fu Panda.jpg
│     ├─ placeholder.svg
│     ├─ Pulp Fiction.jpg
│     ├─ The Dark Knight.jpg
│     └─ The Shawshank Redemption.jpg
├─ src/
│  ├─ __mocks__/
│  │  └─ fileMock.js
│  ├─ __tests__/
│  │  ├─ searchAndFilter.test.ts
│  │  └─ watchlistReducer.test.ts
│  ├─ auth/
│  │  ├─ AuthContext.tsx
│  │  └─ ProtectedRoute.tsx
│  ├─ components/
│  │  ├─ Header/
│  │  │  ├─ Header.styles.ts
│  │  │  └─ Header.tsx
│  │  ├─ MovieCard/
│  │  │  ├─ MovieCard.module.css
│  │  │  ├─ MovieCard.styles.ts
│  │  │  └─ MovieCard.tsx
│  │  ├─ MovieList.tsx
│  │  └─ WatchList.tsx
│  ├─ hooks/
│  │  ├─ useMovies.ts
│  │  └─ useWatchlist.ts
│  ├─ pages/
│  │  ├─ AddMoviePage/
│  │  │  ├─ AddMoviePage.styles.ts
│  │  │  └─ AddMoviePage.tsx
│  │  ├─ Home/
│  │  │  ├─ Home.module.css
│  │  │  └─ Home.tsx
│  │  ├─ RegisterPage/
│  │  │  ├─ RegisterPage.module.css
│  │  │  └─ RegisterPage.tsx
│  │  ├─ AccessDeniedPage.tsx
│  │  ├─ AnalyticsPage.tsx
│  │  ├─ LoginPage.tsx
│  │  ├─ NotFoundPage.tsx
│  │  ├─ ProfilePage.tsx
│  │  └─ WatchlistPage.tsx
│  ├─ reducers/
│  │  ├─ moviesReducer.ts
│  │  ├─ profileReducer.ts
│  │  ├─ registerReducer.ts
│  │  └─ watchlistReducer.ts
│  ├─ services/
│  │  ├─ movieservice.ts
│  │  └─ watchlistservice.ts
│  ├─ theme/
│  │  ├─ theme.ts
│  │  └─ ThemeContext.tsx
│  ├─ types/
│  │  ├─ movie.ts
│  │  └─ user.ts
│  ├─ utils/
│  │  └─ validationRules.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ jest.config.js
├─ movies.json
├─ package-lock.json
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```

---

## 👤 User Roles

| Role | Capabilities |
|---|---|
| **Guest** | Browse and search movies |
| **User** | Everything above + manage watchlist + edit profile |
| **Admin** | Everything above + add/delete movies + view analytics |

When registering, you can select your role. Admin accounts get access to the `/add-movie` and `/analytics` routes.

---

## 📸 Screenshots

### Home Page --Light Mode
<img width="1889" height="863" alt="image" src="https://github.com/user-attachments/assets/90a21c01-7e3c-41cb-ab02-9e3cfbb50df9" />

### Home Page --Dark Mode
<img width="1910" height="862" alt="image" src="https://github.com/user-attachments/assets/ca387e7f-9fb1-455c-9863-5f9816dd3928" />

### Watchlist Page
<img width="1912" height="863" alt="image" src="https://github.com/user-attachments/assets/9b15f7bf-ac1c-4e7e-850b-2f6bc55ee2b7" />

### Analytics Page
<img width="1910" height="864" alt="image" src="https://github.com/user-attachments/assets/be601c74-f213-4fec-a9b6-ce99cc0d38cd" />

### User Profile Page
<img width="1911" height="861" alt="image" src="https://github.com/user-attachments/assets/5523f87e-8b93-468e-828c-f07aa3a180a4" />

### Add Movie Page
<img width="1913" height="865" alt="image" src="https://github.com/user-attachments/assets/58df0480-e1c9-4f61-9fad-fde56eadc919" />




