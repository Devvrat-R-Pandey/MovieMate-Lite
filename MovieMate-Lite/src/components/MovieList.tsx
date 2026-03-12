import { Box } from "@mui/material";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard/MovieCard";

interface Props {
  movies: Movie[];
  watchlist?: Movie[];
  onAdd?: (movie: Movie) => void;
  onDelete?: (id: string) => void;
}

const MovieList = ({ movies, watchlist = [], onAdd, onDelete }: Props) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {movies.map((movie) => {
        const isInWatchlist = watchlist.some((m) => m.id === movie.id);
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAdd={onAdd}
            onDelete={onDelete}
            isInWatchlist={isInWatchlist}
          />
        );
      })}
    </Box>
  );
};

export default MovieList;
