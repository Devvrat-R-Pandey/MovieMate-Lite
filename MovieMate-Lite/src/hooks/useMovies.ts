import { useEffect, useCallback, useReducer } from "react";
import { fetchMovies } from "../services/movieservice";
import type { Movie } from "../types/movie";
import moviesReducer, { moviesInitialState } from "../reducers/moviesReducer";

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const useMovies = (): UseMoviesReturn => {
  const [state, dispatch] = useReducer(moviesReducer, moviesInitialState);

  const load = useCallback(() => {
    dispatch({ type: "FETCH_START" });
    fetchMovies()
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch(() => dispatch({ type: "FETCH_ERROR", payload: "Oops! We couldn't load movies right now. Please try again later." }));
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
};

export default useMovies;