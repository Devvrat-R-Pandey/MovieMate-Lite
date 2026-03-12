import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e88e5" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1e88e5" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
});