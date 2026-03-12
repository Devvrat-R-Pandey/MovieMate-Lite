import { Box, Typography, Button, Container } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center"
        justifyContent="center" minHeight="calc(100vh - 64px)" textAlign="center" gap={2}>
        <LockIcon sx={{ fontSize: 72, color: "text.disabled" }} />
        <Typography variant="h1" fontWeight={800} sx={{ fontSize: "6rem", lineHeight: 1, color: "text.disabled" }}>
          403
        </Typography>
        <Typography variant="h5" fontWeight={600}>Access Denied</Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to view this page.
        </Typography>
        <Button variant="contained" size="large" sx={{ mt: 1 }}
          onClick={() => navigate(user?.role === "admin" ? "/analytics" : "/home")}>
          {user?.role === "admin" ? "Go to Analytics" : "Back to Home"}
        </Button>
      </Box>
    </Container>
  );
};

export default AccessDeniedPage;