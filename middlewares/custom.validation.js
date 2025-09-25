// validations/custom.validation.js

export const password = (value, helpers) => {
  if (!value || value.length < 8) {
    return helpers.message("Password must be at least 8 characters");
  }
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return helpers.message("Password must contain at least 1 letter and 1 number");
  }
  return value;
};

export const mobile = (value, helpers) => {
  const regex = /^\+91\d{10}$/;
  if (!regex.test(value)) {
    return helpers.message("Mobile number must be 10 digits with +91 prefix");
  }
  return value;
};

export const otp = (value, helpers) => {
  const regex = /^\d{6}$/;
  if (!regex.test(value)) {
    return helpers.message("OTP must be 6 digits");
  }
  return value;
};
