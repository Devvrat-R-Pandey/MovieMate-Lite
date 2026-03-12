export const emailRules = {
  required: "Email is required.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format.",
  },
};

export const passwordRules = {
  required: "Password is required.",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters.",
  },
};

export const confirmPasswordRules = (passwordValue: string) => ({
  required: "Confirm your password.",
  validate: (val: string) => val === passwordValue || "Passwords do not match.",
});

export const fullNameRules = {
  required: "Full name is required.",
  pattern: {
    value: /^[a-zA-Z\s]+$/,
    message: "Full name should contain only letters.",
  },
};

export const phoneRules = {
  required: "Phone is required.",
  pattern: {
    value: /^[0-9]{10}$/,
    message: "Phone must be 10 digits.",
  },
};

export const genderRules = {
  required: "Gender is required.",
  pattern: {
    value: /^[a-zA-Z\s]+$/,
    message: "Enter a valid gender.",
  },
};

export const stateRules = {
  required: "State is required.",
  minLength: {
    value: 2,
    message: "Enter a valid state name.",
  },
};

export const dobRules = {
  required: "Please enter your date of birth.",
};

export const movieTitleRules = {
  required: "Title is required.",
  minLength: { value: 1, message: "Title cannot be empty." },
};

export const movieYearRules = {
  required: "Year is required.",
  min: { value: 1888, message: "Enter a valid year." },
  max: { value: new Date().getFullYear() + 1, message: "Year cannot be in the future." },
};

export const movieRatingRules = {
  min: { value: 0, message: "Rating must be between 0 and 10." },
  max: { value: 10, message: "Rating must be between 0 and 10." },
};