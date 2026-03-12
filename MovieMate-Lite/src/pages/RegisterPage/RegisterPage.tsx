import {
  Container, Typography, TextField, Button, Box,
  Select, MenuItem, Paper, Snackbar, Alert,
  FormControl, InputLabel, FormHelperText, IconButton, InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../auth/AuthContext";
import styles from "./RegisterPage.module.css";
import {
  emailRules, passwordRules, confirmPasswordRules,
  fullNameRules, phoneRules, genderRules, stateRules, dobRules,
} from "../../utils/validationRules";

type RegisterFormInputs = {
  email: string; password: string; confirmPassword: string;
  role: "user" | "admin"; fullName: string; phone: string;
  gender: string; location: string; state: string; dob: string;
};

const fp = { size: "small" as const, fullWidth: true, margin: "dense" as const };

// Blocks autofill bleed by mounting as readOnly, removes it on focus
const NoFillTextField = ({ inputRef: externalRef, ...props }: any) => {
  const ref = externalRef || useRef<HTMLInputElement>(null);
  return (
    <TextField
      {...props}
      inputRef={ref}
      inputProps={{
        ...props.inputProps,
        readOnly: true,
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
          e.target.removeAttribute("readonly");
          props.inputProps?.onFocus?.(e);
        },
      }}
    />
  );
};

// Reusable password field with show/hide toggle
const PasswordField = ({ label, show, onToggle, autoComplete = "new-password", ...props }: any) => (
  <TextField
    label={label} type={show ? "text" : "password"}
    autoComplete={autoComplete} {...fp} {...props}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={onToggle} edge="end" size="small">
            {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

// ── Step 1: Account Details ──
const Step1 = ({ register, errors, control, passwordValue, onNext }: any) => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <>
      <input type="text" name="fakeusername" style={{ display: "none" }} readOnly />
      <input type="password" name="fakepassword" style={{ display: "none" }} readOnly />

      <TextField label="Email" required type="email" autoComplete="username" {...fp}
        {...register("email", emailRules)} error={!!errors.email} helperText={errors.email?.message} />

      <PasswordField label="Password" required show={showPwd} onToggle={() => setShowPwd(!showPwd)}
        {...register("password", passwordRules)} error={!!errors.password} helperText={errors.password?.message} />

      <PasswordField label="Confirm Password" required show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
        {...register("confirmPassword", confirmPasswordRules(passwordValue))}
        error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />

      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel required>Role</InputLabel>
        <Controller name="role" control={control} rules={{ required: "Role is required." }}
          render={({ field }) => (
            <Select {...field} label="Role">
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          )}
        />
        {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
      </FormControl>

      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={onNext}>NEXT →</Button>
    </>
  );
};

// ── Step 2: Personal Details ──
const Step2 = ({ register, errors, onBack, onSubmit }: any) => (
  <>
    <input type="text" name="fakename" style={{ display: "none" }} readOnly />
    <input type="tel" name="faketel" style={{ display: "none" }} readOnly />

    <NoFillTextField label="Full Name" required {...fp}
      {...register("fullName", fullNameRules)} error={!!errors.fullName} helperText={errors.fullName?.message} />

    <NoFillTextField label="Phone" required {...fp} inputProps={{ inputMode: "numeric" }}
      {...register("phone", phoneRules)} error={!!errors.phone} helperText={errors.phone?.message} />

    <Box display="flex" gap={1}>
      <NoFillTextField label="Gender" required placeholder="Male / Female / Other" {...fp}
        {...register("gender", genderRules)} error={!!errors.gender} helperText={errors.gender?.message} />
      <NoFillTextField label="State" required placeholder="e.g. Maharashtra" {...fp}
        {...register("state", stateRules)} error={!!errors.state} helperText={errors.state?.message} />
    </Box>

    <NoFillTextField label="Location / City" required {...fp}
      {...register("location", { required: "Location is required." })}
      error={!!errors.location} helperText={errors.location?.message} />

    <TextField label="Date of Birth" required type="date" {...fp}
      InputLabelProps={{ shrink: true }}
      {...register("dob", dobRules)} error={!!errors.dob} helperText={errors.dob?.message} />

    <Box display="flex" gap={1} mt={2}>
      <Button variant="outlined" onClick={onBack} sx={{ flex: 1 }}>← BACK</Button>
      <Button variant="contained" onClick={onSubmit} sx={{ flex: 1 }}>SUBMIT</Button>
    </Box>
  </>
);

// ── Main Component ──
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);

  const { control, register, handleSubmit, watch, trigger, formState: { errors }, setError } =
    useForm<RegisterFormInputs>({
      defaultValues: { email: "", password: "", confirmPassword: "", role: "user", fullName: "", phone: "", gender: "", location: "", state: "", dob: "" },
      mode: "onChange",
    });

  const onSubmit = async (data: RegisterFormInputs) => {
    const success = await registerUser(data);
    if (!success) { setError("email", { message: "User already exists." }); setStep(1); return; }
    setSuccessOpen(true);
  };

  const handleNext = async () => {
    const isValid = await trigger(["email", "password", "confirmPassword"]);
    if (isValid) setStep(2);
  };

  return (
    <Container maxWidth="sm">
      <div className={styles.container}>
        <Paper elevation={3} className={styles.paper}>

          {/* Step indicator */}
          <div className={styles.stepIndicator}>
            {[1, 2].map((s) => (
              <Box key={s} className={styles.stepDot} sx={{
                bgcolor: step === s ? "primary.main" : "action.selected",
                color: step === s ? "#fff" : "text.secondary",
              }}>{s}</Box>
            ))}
          </div>

          <Typography variant="subtitle2" align="center" color="text.secondary" mb={0.5}>
            Step {step} of 2
          </Typography>
          <Typography variant="h6" align="center" fontWeight={700} mb={2}>
            {step === 1 ? "Account Details" : "Personal Details"}
          </Typography>

          {step === 1
            ? <Step1 register={register} errors={errors} control={control} passwordValue={watch("password")} onNext={handleNext} />
            : <Step2 register={register} errors={errors} onBack={() => setStep(1)} onSubmit={handleSubmit(onSubmit)} />
          }
        </Paper>
      </div>

      <Snackbar open={successOpen} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2 }}
          action={
            <Box display="flex" gap={1}>
              <Button color="inherit" size="small" onClick={() => { setSuccessOpen(false); navigate("/login"); }}>Go to Login</Button>
              <Button color="inherit" size="small" onClick={() => setSuccessOpen(false)}>Close</Button>
            </Box>
          }
        >
          Registration successful!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;