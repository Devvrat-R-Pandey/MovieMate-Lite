import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Movie } from "../../types/movie";
import styles from "../MovieCard/MovieCard.module.css";
import {
  cardSx,
  contentSx,
  ratingTextSx,
  watchlistBadgeSx,
  actionBoxSx,
  addButtonSx,
  deleteButtonSx,
  watchedButtonSx,
} from "../MovieCard/MovieCard.styles";

interface Props {
  movie: Movie;
  onAdd?: (movie: Movie) => void;
  onRemove?: (id: string) => void;
  onToggleWatched?: (id: string) => void;
  onDelete?: (id: string) => void;
  isInWatchlist?: boolean;
}

const MovieCard = ({
  movie,
  onAdd,
  onRemove,
  onToggleWatched,
  onDelete,
  isInWatchlist = false,
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card className={styles.card} sx={cardSx}>
        <div className={styles.posterWrapper}>
          <CardMedia
            component="img"
            height="300"
            image={movie.poster || "/images/placeholder.svg"}
            alt={movie.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder.svg";
            }}
          />

          <div className={styles.ratingBadge}>
            <StarIcon sx={{ fontSize: 16, color: "#fbc02d" }} />
            <Typography variant="body2" sx={ratingTextSx}>
              {movie.rating}
            </Typography>
          </div>

          {isInWatchlist && (
            <div className={styles.watchlistBadge}>
              <BookmarkIcon sx={watchlistBadgeSx} />
            </div>
          )}
        </div>

        <CardContent sx={contentSx}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            className={styles.title}
          >
            {movie.title}
          </Typography>

          <div className={styles.genres}>
            {movie.genre.map((g) => (
              <Chip
                key={g}
                label={g}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </div>

          <Box sx={actionBoxSx}>
            {onAdd && (
              <Box display="flex" gap={0.5}>
                <Button
                  variant="contained"
                  size="small"
                  sx={addButtonSx}
                  onClick={() => onAdd(movie)}
                  disabled={isInWatchlist}
                >
                  {isInWatchlist ? "Added" : "Add to Watchlist"}
                </Button>

                {onDelete && (
                  <Tooltip title="Delete Movie">
                    <IconButton
                      size="small"
                      sx={deleteButtonSx}
                      onClick={() => setConfirmOpen(true)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}

            {onRemove && (
              <div className={styles.actions}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => onRemove(movie.id)}
                >
                  Remove
                </Button>
                {onToggleWatched && (
                  <Tooltip
                    title={movie.watched ? "Mark Unwatched" : "Mark Watched"}
                  >
                    <IconButton
                      size="small"
                      sx={watchedButtonSx(!!movie.watched)}
                      onClick={() => onToggleWatched(movie.id)}
                    >
                      {movie.watched ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <RadioButtonUncheckedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{movie.title}</strong>? This
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              onDelete?.(movie.id);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MovieCard;
