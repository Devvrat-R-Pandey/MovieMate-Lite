import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useThemeMode } from "../../theme/ThemeContext";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BarChartIcon from "@mui/icons-material/BarChart";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import {
  titleSx,
  avatarButtonSx,
  avatarSx,
  menuPaperSx,
  logoutItemSx,
} from "./Header.styles";

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={titleSx} onClick={() => navigate("/home")}>
          MovieMate Lite
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5}>
          {/* Home icon */}
          <Tooltip title="Home">
            <IconButton color="inherit" component={Link} to="/home">
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {/* Watchlist icon — all logged in users */}
          {user && (
            <Tooltip title="Watchlist">
              <IconButton color="inherit" component={Link} to="/watchlist">
                <BookmarkIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Analytics icon — admins only */}
          {user?.role === "admin" && (
            <Tooltip title="Analytics">
              <IconButton color="inherit" component={Link} to="/analytics">
                <BarChartIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Add Movie icon — admins only */}
          {user?.role === "admin" && (
            <Tooltip title="Add Movie">
              <IconButton color="inherit" component={Link} to="/add-movie">
                <VideoCallIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Theme toggle */}
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            <IconButton color="inherit" onClick={toggleTheme} size="small">
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Avatar with dropdown — logged in */}
          {user && (
            <>
              <Tooltip title="Account">
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={avatarButtonSx}
                >
                  <Avatar sx={avatarSx(user.role)}>{initials}</Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    elevation: 4,
                    sx: menuPaperSx,
                  },
                }}
              >
                {/* User info header */}
                <Box px={2} py={1}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {user.fullName ?? user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>

                <MenuItem onClick={handleLogout} sx={logoutItemSx}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Login icon -- not logged in */}
          {!user && (
            <Tooltip title="Login">
              <IconButton color="inherit" onClick={() => navigate("/login")}>
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
