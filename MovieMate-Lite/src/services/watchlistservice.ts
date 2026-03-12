import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "http://localhost:3001";

// Each watchlist entry in db.json looks like: { id, userEmail, movies: [] }
interface WatchlistEntry {
  id?: number;
  userEmail: string;
  movies: Movie[];
}

// Get the watchlist for a user (returns movies array)
export const getWatchlist = async (userEmail: string): Promise<Movie[]> => {
  const res = await axios.get<WatchlistEntry[]>(
    `${API_URL}/watchlists?userEmail=${userEmail}`
  );
  return res.data[0]?.movies ?? [];
};

// Add a movie to the user's watchlist
export const addToWatchlist = async (userEmail: string, movie: Movie): Promise<Movie[]> => {
  const res = await axios.get<WatchlistEntry[]>(
    `${API_URL}/watchlists?userEmail=${userEmail}`
  );

  const existing = res.data[0];

  if (existing) {
    // User already has a watchlist — update it
    const alreadyAdded = existing.movies.some((m) => m.id === movie.id);
    if (alreadyAdded) return existing.movies;

    const updatedMovies = [...existing.movies, movie];
    await axios.patch(`${API_URL}/watchlists/${existing.id}`, { movies: updatedMovies });
    return updatedMovies;
  } else {
    // First time — create a new watchlist for this user
    const newEntry: WatchlistEntry = { userEmail, movies: [movie] };
    await axios.post(`${API_URL}/watchlists`, newEntry);
    return [movie];
  }
};

// Remove a movie from the user's watchlist
export const removeFromWatchlist = async (userEmail: string, movieId: string): Promise<Movie[]> => {
  const res = await axios.get<WatchlistEntry[]>(
    `${API_URL}/watchlists?userEmail=${userEmail}`
  );

  const existing = res.data[0];
  if (!existing) return [];

  const updatedMovies = existing.movies.filter((m) => m.id !== movieId);
  await axios.patch(`${API_URL}/watchlists/${existing.id}`, { movies: updatedMovies });
  return updatedMovies;
};

// Toggle watched status for a movie in the user's watchlist
export const toggleWatchedInWatchlist = async (userEmail: string, movieId: string): Promise<Movie[]> => {
  const res = await axios.get<WatchlistEntry[]>(
    `${API_URL}/watchlists?userEmail=${userEmail}`
  );

  const existing = res.data[0];
  if (!existing) return [];

  const updatedMovies = existing.movies.map((m) =>
    m.id === movieId ? { ...m, watched: !m.watched } : m
  );
  await axios.patch(`${API_URL}/watchlists/${existing.id}`, { movies: updatedMovies });
  return updatedMovies;
};