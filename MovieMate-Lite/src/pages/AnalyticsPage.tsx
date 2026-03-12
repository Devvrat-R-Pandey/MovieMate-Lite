import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useMemo } from "react";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import StarRateIcon from "@mui/icons-material/StarRate";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useMovies from "../hooks/useMovies";

const GENRE_COLORS = [
  "#1e88e5", "#e53935", "#43a047", "#fb8c00",
  "#8e24aa", "#00acc1", "#f4511e", "#6d4c41",
];
const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const AnalyticsPage = () => {
  const { movies, loading } = useMovies();

  const ratedMovies = useMemo(() => movies.filter((m) => m.rating != null), [movies]);

  const averageRating = useMemo(
    () => ratedMovies.length > 0
      ? (ratedMovies.reduce((sum, m) => sum + (m.rating ?? 0), 0) / ratedMovies.length).toFixed(2)
      : "N/A",
    [ratedMovies]
  );

  const highestRated = useMemo(
    () => ratedMovies.reduce((best, m) => ((m.rating ?? 0) > (best.rating ?? 0) ? m : best), ratedMovies[0]),
    [ratedMovies]
  );

  const genreEntries = useMemo(
    () => Object.entries(
      movies.reduce<Record<string, number>>((acc, m) => {
        m.genre.forEach((g) => { acc[g] = (acc[g] || 0) + 1; });
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]),
    [movies]
  );

  const maxGenreCount = useMemo(() => genreEntries[0]?.[1] ?? 1, [genreEntries]);

  const topRatedMovies = useMemo(
    () => [...ratedMovies].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5),
    [ratedMovies]
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>

      {/* Page Header — compact */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700} lineHeight={1}>
          Catalog Analytics
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Live insights from your movie catalog
        </Typography>
      </Box>

      {/* Stat Cards Row — compact height */}
      <Box display="flex" gap={1.5} mb={2}>
        {[
          {
            icon: <LocalMoviesIcon sx={{ fontSize: 22, opacity: 0.85 }} />,
            value: movies.length,
            label: "Total Movies",
            bg: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
            shadow: "rgba(30,136,229,0.35)",
          },
          {
            icon: <StarRateIcon sx={{ fontSize: 22, opacity: 0.85 }} />,
            value: averageRating,
            label: "Avg Rating",
            bg: "linear-gradient(135deg, #fb8c00 0%, #e65100 100%)",
            shadow: "rgba(251,140,0,0.35)",
          },
          {
            icon: <MovieFilterIcon sx={{ fontSize: 22, opacity: 0.85 }} />,
            value: genreEntries.length,
            label: "Genres",
            bg: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
            shadow: "rgba(67,160,71,0.35)",
          },
          {
            icon: <EmojiEventsIcon sx={{ fontSize: 22, opacity: 0.85 }} />,
            value: highestRated?.title ?? "—",
            label: `⭐ ${highestRated?.rating} · Highest Rated`,
            bg: "linear-gradient(135deg, #8e24aa 0%, #4a148c 100%)",
            shadow: "rgba(142,36,170,0.35)",
            smallValue: true,
          },
        ].map((card, i) => (
          <Box
            key={i}
            flex={1}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              background: card.bg,
              color: "#fff",
              boxShadow: `0 4px 16px ${card.shadow}`,
              display: "flex",
              flexDirection: "column",
              gap: 0.3,
            }}
          >
            {card.icon}
            <Typography
              fontWeight={800}
              sx={{ fontSize: card.smallValue ? "1rem" : "1.6rem", lineHeight: 1.1 }}
            >
              {card.value}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", opacity: 0.85 }}>
              {card.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Bottom Row — fills remaining height, each panel scrolls independently */}
      <Box display="flex" gap={2} flex={1} minHeight={0}>

        {/* Genre Distribution */}
        <Box
          flex={1}
          sx={{
            p: 2, borderRadius: 2.5,
            bgcolor: "background.paper",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            Genre Distribution
          </Typography>
          {/* Scrollable genre list */}
          <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
            <Box display="flex" flexDirection="column" gap={1.2}>
              {genreEntries.map(([genre, count], i) => (
                <Box key={genre}>
                  <Box display="flex" justifyContent="space-between" mb={0.4}>
                    <Typography variant="body2" fontWeight={500}>{genre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {count} / {movies.length}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 4, bgcolor: "action.hover", overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        width: `${(count / maxGenreCount) * 100}%`,
                        borderRadius: 4,
                        bgcolor: GENRE_COLORS[i % GENRE_COLORS.length],
                        transition: "width 0.8s ease",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Top Rated Leaderboard */}
        <Box
          flex={1}
          sx={{
            p: 2, borderRadius: 2.5,
            bgcolor: "background.paper",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
            Top Rated Movies
          </Typography>
          {/* Scrollable leaderboard */}
          <Box sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {topRatedMovies.map((movie, i) => (
                <Box
                  key={movie.id}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    p: 1, borderRadius: 2,
                    bgcolor: i === 0 ? "rgba(255,215,0,0.08)" : "action.hover",
                    border: i === 0 ? "1px solid rgba(255,215,0,0.25)" : "1px solid transparent",
                  }}
                >
                  {/* Rank badge */}
                  <Box
                    sx={{
                      width: 26, height: 26, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.75rem",
                      bgcolor: i < 3 ? medalColors[i] : "action.selected",
                      color: i < 3 ? "#000" : "text.primary",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>

                  {/* Poster thumbnail */}
                  <Box
                    component="img"
                    src={movie.poster}
                    alt={movie.title}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    sx={{ width: 28, height: 40, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
                  />

                  <Box flex={1} minWidth={0}>
                    <Typography variant="body2" fontWeight={600} noWrap title={movie.title}>
                      {movie.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{movie.year}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex", alignItems: "center", gap: 0.3,
                      bgcolor: "rgba(251,140,0,0.15)",
                      px: 0.8, py: 0.2, borderRadius: 1.5, flexShrink: 0,
                    }}
                  >
                    <StarRateIcon sx={{ fontSize: 12, color: "#fb8c00" }} />
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#fb8c00" }}>
                      {movie.rating}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

      </Box>
    </Container>
  );
};

export default AnalyticsPage;