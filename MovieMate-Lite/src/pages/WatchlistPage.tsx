import { Typography, Button, Container } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import Watchlist from "../components/WatchList";
import useWatchlist from "../hooks/useWatchlist";

const WatchlistPage = () => {
  const { user } = useAuth();
  const { watchlist, removeMovie, toggleWatched } = useWatchlist(user?.email);

  if (watchlist.length === 0) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary" gutterBottom>
          Your watchlist is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Looks like you haven't added any movies to your watchlist yet.
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Browse Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>My Watchlist</Typography>
      <Watchlist watchlist={watchlist} onRemove={removeMovie} onToggleWatched={toggleWatched} />
    </Container>
  );
};

export default WatchlistPage;