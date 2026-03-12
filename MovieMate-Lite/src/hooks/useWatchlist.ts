import { useEffect, useCallback, useReducer } from "react";
import { getWatchlist, addToWatchlist, removeFromWatchlist, toggleWatchedInWatchlist } from "../services/watchlistservice";
import type { Movie } from "../types/movie";
import watchlistReducer, { watchlistInitialState } from "../reducers/watchlistReducer";

interface UseWatchlistReturn {
  watchlist: Movie[];
  trendingGenre: string | null;
  addMovie: (movie: Movie) => Promise<void>;
  removeMovie: (movieId: string) => Promise<void>;
  toggleWatched: (movieId: string) => Promise<void>;
}

const useWatchlist = (userEmail: string | undefined): UseWatchlistReturn => {
  const [state, dispatch] = useReducer(watchlistReducer, watchlistInitialState);

  useEffect(() => {
    if (!userEmail) return;
    getWatchlist(userEmail).then((list) => dispatch({ type: "SET_WATCHLIST", payload: list }));
  }, [userEmail]);

  const addMovie = useCallback(async (movie: Movie) => {
    if (!userEmail) return;
    const updated = await addToWatchlist(userEmail, movie);
    dispatch({ type: "ADD_MOVIE", payload: updated });
  }, [userEmail]);

  const removeMovie = useCallback(async (movieId: string) => {
    if (!userEmail) return;
    const updated = await removeFromWatchlist(userEmail, movieId);
    dispatch({ type: "REMOVE_MOVIE", payload: updated });
  }, [userEmail]);

  const toggleWatched = useCallback(async (movieId: string) => {
    if (!userEmail) return;
    const updated = await toggleWatchedInWatchlist(userEmail, movieId);
    dispatch({ type: "SET_WATCHLIST", payload: updated });
  }, [userEmail]);

  return { ...state, addMovie, removeMovie, toggleWatched };
};

export default useWatchlist;