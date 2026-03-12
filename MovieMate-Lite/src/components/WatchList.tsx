import { Box } from "@mui/material";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard/MovieCard";

interface Props {
  watchlist: Movie[];
  onRemove: (id: string) => void;
  onToggleWatched: (id: string) => void;
}

const Watchlist = ({ watchlist, onRemove, onToggleWatched }: Props) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {watchlist.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onRemove={onRemove}
          onToggleWatched={onToggleWatched}
          isInWatchlist={true}
        />
      ))}
    </Box>
  );
};

export default Watchlist;
