import type { SxProps, Theme } from "@mui/material";

export const noArrows: SxProps<Theme> = {
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
  "& input[type=number]": { MozAppearance: "textfield" },
};

export const paperSx: SxProps<Theme> = {
  p: 3,
  borderRadius: 3,
};

export const uploadBoxSx: SxProps<Theme> = {
  width: 120,
  height: 170,
  border: "2px dashed",
  borderColor: "divider",
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  cursor: "pointer",
  color: "text.secondary",
  transition: "all 0.2s",
  "&:hover": { borderColor: "primary.main", color: "primary.main" },
};

export const uploadBoxErrorSx: SxProps<Theme> = {
  ...uploadBoxSx as object,
  borderColor: "error.main",
};

export const removeposterBtnSx: SxProps<Theme> = {
  position: "absolute",
  top: -10,
  right: -10,
  backgroundColor: "error.main",
  color: "#fff",
  width: 22,
  height: 22,
  "&:hover": { backgroundColor: "error.dark" },
};