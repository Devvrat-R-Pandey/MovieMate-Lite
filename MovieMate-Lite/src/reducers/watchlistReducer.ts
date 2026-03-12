import type { Movie } from "../types/movie";

export interface WatchlistState {
  watchlist: Movie[];
  trendingGenre: string | null;
}

export type WatchlistAction =
  | { type: "SET_WATCHLIST"; payload: Movie[] }
  | { type: "ADD_MOVIE"; payload: Movie[] }
  | { type: "REMOVE_MOVIE"; payload: Movie[] };

export const watchlistInitialState: WatchlistState = {
  watchlist: [],
  trendingGenre: null,
};

const getTrendingGenre = (list: Movie[]): string | null => {
  if (list.length === 0) return null;
  const counts: Record<string, number> = {};
  list.forEach((m) => m.genre.forEach((g) => { counts[g] = (counts[g] || 0) + 1; }));
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

const watchlistReducer = (state: WatchlistState, action: WatchlistAction): WatchlistState => {
  switch (action.type) {
    case "SET_WATCHLIST":
    case "ADD_MOVIE":
    case "REMOVE_MOVIE":
      return {
        watchlist: action.payload,
        trendingGenre: getTrendingGenre(action.payload),
      };
    default:
      return state;
  }
};

export default watchlistReducer;