import { useState } from "react";
import {
  Container, Typography, TextField, Button, Box,
  Paper, Alert, Chip, IconButton, Tooltip,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addMovie } from "../../services/movieservice";
import { movieTitleRules, movieYearRules, movieRatingRules } from "../../utils/validationRules";
import { noArrows, paperSx, uploadBoxSx, uploadBoxErrorSx, removeposterBtnSx } from "./AddMoviePage.styles";

type AddMovieForm = {
  title: string;
  year: number | "";
  rating: number | "";
  genreInput: string;
};

const ACCEPTED = ["image/jpeg", "image/png"];

const AddMoviePage = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<string[]>([]);
  const [genreError, setGenreError] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterError, setPosterError] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<AddMovieForm>({
      defaultValues: { title: "", year: "", rating: "", genreInput: "" },
    });

  const genreInput = watch("genreInput");

  const handleAddGenre = () => {
    const trimmed = genreInput.trim();
    if (!trimmed) return;
    if (genres.includes(trimmed)) { setGenreError("Genre already added."); return; }
    setGenres((prev) => [...prev, trimmed]);
    setValue("genreInput", "");
    setGenreError("");
  };

  const handleRemoveGenre = (g: string) => setGenres((prev) => prev.filter((x) => x !== g));

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setPosterError("Only JPG and PNG allowed.");
      return;
    }
    setPosterError("");
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleRemovePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    setPosterError("");
  };

  const onSubmit = async (data: AddMovieForm) => {
    if (genres.length === 0) { setGenreError("Add at least one genre."); return; }
    setSubmitting(true);
    try {
      await addMovie({
        title: data.title,
        year: Number(data.year),
        rating: data.rating !== "" ? Number(data.rating) : undefined,
        poster: posterFile ? `/images/${posterFile.name}` : "/images/placeholder.svg",
        genre: genres,
        watched: false,
      });
      setStatus("success");
      setTimeout(() => navigate("/home"), 1500);
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const sf = { size: "small" as const, fullWidth: true, margin: "dense" as const };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={paperSx}>
        <Typography variant="h6" fontWeight={700} mb={2}>Add New Movie</Typography>

        {status === "success" && <Alert severity="success" sx={{ mb: 2 }}>Movie added! Redirecting...</Alert>}
        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setStatus(null)}>Failed to add movie. Try again.</Alert>
        )}

        <Box display="flex" gap={2}>

          {/* Left: all fields */}
          <Box flex={1}>
            <TextField label="Title" required {...sf}
              {...register("title", movieTitleRules)}
              error={!!errors.title} helperText={errors.title?.message}
            />

            <Box display="flex" gap={1}>
              <TextField label="Year" required type="number" {...sf} sx={noArrows}
                {...register("year", movieYearRules)}
                error={!!errors.year} helperText={errors.year?.message}
              />
              <TextField label="Rating" type="number"
                inputProps={{ step: 0.1, min: 0, max: 10 }}
                {...sf} sx={noArrows}
                {...register("rating", movieRatingRules)}
                error={!!errors.rating} helperText={errors.rating?.message}
              />
            </Box>

            <Box display="flex" gap={1} mt={0.5}>
              <TextField label="Add Genre *" {...sf} sx={{ mb: 0 }}
                {...register("genreInput")}
                error={!!genreError} helperText={genreError}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddGenre(); } }}
              />
              <Button variant="outlined" size="small" sx={{ mt: 1, mb: 0.5, flexShrink: 0 }}
                onClick={handleAddGenre}>
                Add
              </Button>
            </Box>

            {genres.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                {genres.map((g) => (
                  <Chip key={g} label={g} size="small" color="primary" variant="outlined"
                    onDelete={() => handleRemoveGenre(g)} />
                ))}
              </Box>
            )}
          </Box>

          {/* Right: poster upload area */}
          <Box sx={{ width: 130, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", mt: 1 }}>
            {posterPreview ? (
              <Box sx={{ position: "relative", width: 120, height: 170 }}>
                <img src={posterPreview} alt="Poster preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                <Tooltip title="Remove poster">
                  <IconButton size="small" onClick={handleRemovePoster} sx={removeposterBtnSx}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Tooltip title="Upload Poster (JPG / PNG)">
                <Box component="label" sx={posterError ? uploadBoxErrorSx : uploadBoxSx}>
                  <AddPhotoAlternateIcon sx={{ fontSize: 36 }} />
                  <Typography variant="caption" textAlign="center" lineHeight={1.2}>
                    Upload Poster
                  </Typography>
                  <input type="file" hidden accept=".jpg,.jpeg,.png" onChange={handlePosterChange} />
                </Box>
              </Tooltip>
            )}
            {posterError && (
              <Typography variant="caption" color="error" mt={0.5} textAlign="center">
                {posterError}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={1} mt={3}>
          <Button variant="outlined" fullWidth onClick={() => navigate("/home")}>Cancel</Button>
          <Button variant="contained" fullWidth disabled={submitting} onClick={handleSubmit(onSubmit)}>
            {submitting ? "Adding..." : "Add Movie"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMoviePage;