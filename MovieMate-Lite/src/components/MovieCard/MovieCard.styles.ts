import type { SxProps, Theme } from "@mui/material";

export const cardSx: SxProps<Theme> = {
  backgroundColor: "background.paper",
  display: "flex",
  flexDirection: "column",
};

export const contentSx: SxProps<Theme> = {
  p: 2,
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export const ratingTextSx: SxProps<Theme> = {
  color: "#fff",
};

export const watchlistBadgeSx: SxProps<Theme> = {
  fontSize: 28,
  color: "error.main",
};

export const actionBoxSx: SxProps<Theme> = {
  mt: "auto",
};

export const addButtonSx: SxProps<Theme> = {
  flex: 1,
  fontSize: "0.7rem",
  px: 0.5,
};

export const deleteButtonSx: SxProps<Theme> = {
  color: "error.main",
  borderRadius: 1,
  "&:hover": { backgroundColor: "error.main", color: "#fff" },
};

export const watchedButtonSx = (watched: boolean): SxProps<Theme> => ({
  color: watched ? "success.main" : "text.disabled",
});