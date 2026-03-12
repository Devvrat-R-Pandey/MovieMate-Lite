import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import { emailRules, passwordRules } from "../utils/validationRules";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const success = await login(data.email, data.password);
    if (success) {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const loggedInUser = JSON.parse(stored);
        if (loggedInUser.role === "admin") navigate("/analytics");
        else navigate("/watchlist");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleLogin = async () => {
    const isValid = await trigger(["email", "password"]);
    if (isValid) handleSubmit(onSubmit)();
  };

  const handleReset = () => {
    reset();
    setError("");
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "100%" }}>
        <Typography variant="h5" gutterBottom align="center">
          Login to MovieMate Lite
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Email" required type="email" fullWidth margin="normal"
          {...register("email", emailRules)}
          error={!!errors.email} helperText={errors.email?.message}
        />

        <TextField
          label="Password" required
          type={showPassword ? "text" : "password"}
          fullWidth margin="normal"
          {...register("password", passwordRules)}
          error={!!errors.password} helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
          LOGIN
        </Button>

        <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleReset}>
          RESET
        </Button>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            New user?{" "}
            <Link href="/register" underline="hover">Sign up here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;