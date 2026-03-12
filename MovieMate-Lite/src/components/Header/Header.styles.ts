import type { SxProps, Theme } from "@mui/material";

export const titleSx: SxProps<Theme> = {
  flexGrow: 1,
  fontWeight: 700,
  cursor: "pointer",
};

export const avatarButtonSx: SxProps<Theme> = {
  ml: 0.5,
  p: 0.5,
};

export const avatarSx = (role: string | undefined): SxProps<Theme> => ({
  width: 34,
  height: 34,
  fontSize: "0.8rem",
  fontWeight: 700,
  bgcolor: role === "admin" ? "secondary.main" : "primary.dark",
});

export const menuPaperSx: SxProps<Theme> = {
  mt: 0.5,
  minWidth: 160,
  borderRadius: 2,
};

export const logoutItemSx: SxProps<Theme> = {
  color: "error.main",
};