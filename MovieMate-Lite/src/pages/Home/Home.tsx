import { useState, useMemo } from "react";
import {
  TextField, Container, Typography, MenuItem,
  Select, CircularProgress, Button, Snackbar, Alert,
} from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import type { Movie } from "../../types/movie";
import MovieList from "../../components/MovieList";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import useMovies from "../../hooks/useMovies";
import { deleteMovie } from "../../services/movieservice";
import useWatchlist from "../../hooks/useWatchlist";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sortOrder, setSortOrder] = useState<"" | "asc" | "desc">("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { movies, loading, error, reload } = useMovies();
  const { watchlist, trendingGenre, addMovie } = useWatchlist(user?.email);

  const handleAddToWatchlist = async (movie: Movie) => {
    if (!user) {
      setSnackbarOpen(true);
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    await addMovie(movie);
  };

  const handleDelete = async (id: string) => {
    await deleteMovie(id);
    reload();
  };

  const genres = useMemo(
    () => Array.from(new Set(movies.flatMap((m) => m.genre))),
    [movies]
  );

  const sortedMovies = useMemo(
    () =>
      [...movies]
        .filter((m) => {
          const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
          const matchesGenre = genre === "" || m.genre.includes(genre);
          return matchesSearch && matchesGenre;
        })
        .sort((a, b) => {
          if (!sortOrder) return 0;
          const ratingA = a.rating ?? 0;
          const ratingB = b.rating ?? 0;
          return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
        }),
    [movies, search, genre, sortOrder]
  );

  return (
    <Container sx={{ mt: 3, pb: 4 }}>
      {trendingGenre && (
        <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 3 }}>
          🔥 Trending Now: {trendingGenre}
        </Typography>
      )}

      {loading ? (
        <div className={styles.loading}>
          <CircularProgress />
        </div>

      ) : error ? (
        <div className={styles.error}>
          <WifiOffIcon sx={{ fontSize: 64, color: "text.disabled" }} />
          <Typography variant="h6" fontWeight={600}>Couldn't load movies</Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your connection and try again.
          </Typography>
          <Button variant="contained" onClick={reload} sx={{ mt: 1 }}>Retry</Button>
        </div>

      ) : (
        <>
          <div className={styles.controls}>
            <TextField label="Search movies..." variant="outlined" size="small"
              className={styles.searchField}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Select value={genre} onChange={(e) => setGenre(e.target.value)}
              displayEmpty size="small" className={styles.genreSelect}>
              <MenuItem value="">All Genres</MenuItem>
              {genres.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
            <Select value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc" | "")}
              displayEmpty size="small" className={styles.sortSelect}>
              <MenuItem value="">Sort by Rating</MenuItem>
              <MenuItem value="asc">Lowest → Highest</MenuItem>
              <MenuItem value="desc">Highest → Lowest</MenuItem>
            </Select>
          </div>

          <div className={styles.movieList}>
            <MovieList movies={sortedMovies} watchlist={watchlist}
              onAdd={handleAddToWatchlist}
              onDelete={user?.role === "admin" ? handleDelete : undefined} />
          </div>

          <Snackbar open={snackbarOpen} autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
              Please login to add to watchlist
            </Alert>
          </Snackbar>
        </>
      )}
    </Container>
  );
};

export default Home;