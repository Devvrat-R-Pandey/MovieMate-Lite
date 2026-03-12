import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center"
        justifyContent="center" minHeight="calc(100vh - 64px)" textAlign="center" gap={2}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 72, color: "text.disabled" }} />
        <Typography variant="h1" fontWeight={800} sx={{ fontSize: "6rem", lineHeight: 1, color: "text.disabled" }}>
          404
        </Typography>
        <Typography variant="h5" fontWeight={600}>Page Not Found</Typography>
        <Typography variant="body1" color="text.secondary">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 1 }} onClick={() => navigate("/home")}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;