import { useReducer } from "react";
import {
  Container, Box, Typography, Paper, Chip, Divider,
  TextField, Button, Alert, IconButton, InputAdornment, Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import type { UpdateProfileData } from "../auth/AuthContext";
import profileReducer, { profileInitialState } from "../reducers/profileReducer";

type DetailsForm = Omit<UpdateProfileData, "oldPassword" | "newPassword">;
type PasswordForm = { oldPassword: string; newPassword: string };

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
  <>
    <Box display="flex" justifyContent="space-between" py={0.6}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || "—"}</Typography>
    </Box>
    <Divider />
  </>
);

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [state, dispatch] = useReducer(profileReducer, profileInitialState);

  const detailsForm = useForm<DetailsForm>({
    defaultValues: {
      fullName: user?.fullName ?? "", phone: user?.phone ?? "",
      gender: user?.gender ?? "", location: user?.location ?? "",
      state: user?.state ?? "", dob: user?.dob ?? "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  if (!user) return null;

  const initials = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const age = user.dob
    ? Math.floor((Date.now() - new Date(user.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  const formattedDob = user.dob
    ? `${new Date(user.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}${age ? ` · ${age} yrs` : ""}`
    : null;

const onSaveDetails = async (data: DetailsForm) => {
  const result = await updateProfile({ ...data, oldPassword: "", newPassword: "" });

  if (result === "success") {
    dispatch({ type: "DETAILS_SUCCESS" });
    detailsForm.reset();
  } else {
    dispatch({ type: "DETAILS_ERROR" });
  }
};

  const onSavePassword = async (data: PasswordForm) => {
    const result = await updateProfile({
      fullName: user.fullName ?? "", phone: user.phone ?? "",
      gender: user.gender ?? "", location: user.location ?? "",
      state: user.state ?? "", dob: user.dob ?? "",
      oldPassword: data.oldPassword, newPassword: data.newPassword,
    });
    if (result === "success") {
      dispatch({ type: "PASSWORD_SUCCESS" });
      passwordForm.reset();
    } else if (result === "wrong_password") {
      dispatch({ type: "PASSWORD_WRONG" });
    } else {
      dispatch({ type: "PASSWORD_ERROR" });
    }
  };

  const handleCancelPassword = () => {
    dispatch({ type: "EDIT_PASSWORD_CANCEL" });
    passwordForm.reset();
  };

  const sf = { size: "small" as const, fullWidth: true, margin: "dense" as const };

  return (
    <Box sx={{ height: "calc(100vh - 64px)", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", py: 3 }}>
      <Container maxWidth="sm" disableGutters sx={{ px: 2 }}>

        {/* ── Personal Info Card ── */}
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #1e88e5 0%, #8e24aa 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Typography fontWeight={800} color="#fff" sx={{ fontSize: "1.5rem" }}>{initials}</Typography>
            </Box>
            <Box flex={1} minWidth={0}>
              <Typography variant="h6" fontWeight={700} noWrap>{user.fullName ?? user.email}</Typography>
              <Chip label={user.role === "admin" ? "Admin" : "User"} size="small" color={user.role === "admin" ? "secondary" : "primary"} sx={{ mt: 0.25, fontWeight: 600 }} />
            </Box>
            <Box display="flex" gap={1} flexShrink={0}>
              {!state.editingDetails ? (
                <Button size="small" startIcon={<EditIcon fontSize="small" />}
                  onClick={() => dispatch({ type: "EDIT_DETAILS_START" })}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button size="small" color="inherit" startIcon={<CloseIcon fontSize="small" />}
                    onClick={() => { dispatch({ type: "EDIT_DETAILS_CANCEL" }); detailsForm.reset(); }}>
                    Cancel
                  </Button>
                  <Button size="small" variant="contained" startIcon={<SaveIcon fontSize="small" />}
                    onClick={detailsForm.handleSubmit(onSaveDetails)}>
                    Save
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Typography variant="subtitle2" fontWeight={700} color="text.secondary" mb={1}>PERSONAL INFO</Typography>

          {state.detailsStatus === "success" && (
            <Alert severity="success" sx={{ mb: 1 }} onClose={() => dispatch({ type: "CLEAR_DETAILS_STATUS" })}>
              Details updated successfully!
            </Alert>
          )}
          {state.detailsStatus === "error" && (
            <Alert severity="error" sx={{ mb: 1 }} onClose={() => dispatch({ type: "CLEAR_DETAILS_STATUS" })}>
              Something went wrong. Try again.
            </Alert>
          )}

          {!state.editingDetails ? (
            <Box>
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Full Name" value={user.fullName} />
              <DetailRow label="Phone" value={user.phone} />
              <DetailRow label="Gender" value={user.gender} />
              <DetailRow label="Date of Birth" value={formattedDob} />
              <DetailRow label="Location" value={[user.location, user.state].filter(Boolean).join(", ") || null} />
            </Box>
          ) : (
            <Box>
              <TextField label="Full Name" required {...sf}
                {...detailsForm.register("fullName", { required: "Required", pattern: { value: /^[a-zA-Z\s]+$/, message: "Letters only" } })}
                error={!!detailsForm.formState.errors.fullName} helperText={detailsForm.formState.errors.fullName?.message} />
              <Box display="flex" gap={1}>
                <TextField label="Phone" required {...sf}
                  {...detailsForm.register("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits" } })}
                  error={!!detailsForm.formState.errors.phone} helperText={detailsForm.formState.errors.phone?.message} />
                <TextField label="Date of Birth" type="date" {...sf}
                  InputLabelProps={{ shrink: true }} {...detailsForm.register("dob")} />
              </Box>
              <Box display="flex" gap={1}>
                <TextField label="Gender" {...sf} {...detailsForm.register("gender")} />
                <TextField label="State" {...sf} {...detailsForm.register("state")} />
              </Box>
              <TextField label="Location / City" {...sf} {...detailsForm.register("location")} />
            </Box>
          )}
        </Paper>

        {/* ── Change Password Card ── */}
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <LockIcon fontSize="small" sx={{ color: "text.secondary" }} />
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">CHANGE PASSWORD</Typography>
            </Box>
            {!state.editingPassword ? (
              <Button size="small" startIcon={<EditIcon fontSize="small" />}
                onClick={() => dispatch({ type: "EDIT_PASSWORD_START" })}>
                Edit
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button size="small" color="inherit" startIcon={<CloseIcon fontSize="small" />}
                  onClick={handleCancelPassword}>
                  Cancel
                </Button>
                <Button size="small" variant="contained" startIcon={<SaveIcon fontSize="small" />}
                  onClick={passwordForm.handleSubmit(onSavePassword)}>
                  Save
                </Button>
              </Box>
            )}
          </Box>

          <Collapse in={state.editingPassword}>
            <Box mt={1.5}>
              {state.passwordStatus === "success" && (
                <Alert severity="success" sx={{ mb: 1 }} onClose={() => dispatch({ type: "CLEAR_PASSWORD_STATUS" })}>
                  Password changed!
                </Alert>
              )}
              {state.passwordStatus === "wrong_password" && (
                <Alert severity="error" sx={{ mb: 1 }} onClose={() => dispatch({ type: "CLEAR_PASSWORD_STATUS" })}>
                  Old password is incorrect.
                </Alert>
              )}
              {state.passwordStatus === "error" && (
                <Alert severity="error" sx={{ mb: 1 }} onClose={() => dispatch({ type: "CLEAR_PASSWORD_STATUS" })}>
                  Something went wrong.
                </Alert>
              )}

              <Box display="flex" gap={1}>
                {[
                  { label: "Old Password", key: "oldPassword" as const, show: state.showOld, toggle: () => dispatch({ type: "TOGGLE_SHOW_OLD" }) },
                  { label: "New Password", key: "newPassword" as const, show: state.showNew, toggle: () => dispatch({ type: "TOGGLE_SHOW_NEW" }) },
                ].map(({ label, key, show, toggle }) => (
                  <TextField key={key} label={label} type={show ? "text" : "password"} {...sf}
                    {...passwordForm.register(key, { required: "Required", ...(key === "newPassword" ? { minLength: { value: 6, message: "Min 6 chars" } } : {}) })}
                    error={!!passwordForm.formState.errors[key]} helperText={passwordForm.formState.errors[key]?.message}
                    InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={toggle} edge="end">{show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }}
                  />
                ))}
              </Box>
            </Box>
          </Collapse>
        </Paper>

      </Container>
    </Box>
  );
};

export default ProfilePage;