import type { Movie } from "../types/movie";

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export type MoviesAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Movie[] }
  | { type: "FETCH_ERROR"; payload: string };

export const moviesInitialState: MoviesState = {
  movies: [],
  loading: true,
  error: null,
};

const moviesReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { movies: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default moviesReducer;