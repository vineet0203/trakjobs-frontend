import * as Yup from "yup";

// Password validation with special character requirement
export const passwordValidation = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must contain at least one special character",
  );

// Mobile number validation - only digits allowed
export const mobileValidation = Yup.string()
  .required("Mobile number is required")
  .matches(/^[0-9]+$/, "Mobile number must contain only digits")
  .min(10, "Mobile number must be at least 10 digits")
  .max(15, "Mobile number must not exceed 15 digits");

// Strict URL validation - requires http:// or https://
export const websiteValidation = Yup.string()
  .required("Website name is required")
  .test(
    "is-valid-url",
    "Please enter a valid website URL starting with http:// or https://",
    function (value) {
      if (!value) return false;

      // Strict regex that requires http:// or https://
      const urlRegex =
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

      return urlRegex.test(value);
    },
  )
  .max(255, "Website URL must not exceed 255 characters");

// Alternative: Use Yup's built-in URL validation (also requires http:// or https://)
export const websiteValidationYup = Yup.string()
  .required("Website name is required")
  .url("Enter a valid web URL starting with http:// or https://")
  .max(255, "Website URL must not exceed 255 characters");

export const registerSchema = Yup.object({
  business_name: Yup.string()
    .required("Business name is required")
    .max(100, "Business name must not exceed 100 characters"),

  website_name: websiteValidationYup, // Using Yup's built-in URL validation

  business_type: Yup.string()
    .required("Business type is required")
    .oneOf(["commercial", "residential"], "Select a valid business type"),

  full_name: Yup.string()
    .required("Full name is required")
    .max(100, "Full name must not exceed 100 characters"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .max(255, "Email must not exceed 255 characters"),

  mobile_number: mobileValidation,

  service_category: Yup.string().required("Main service category is required"),

  service_category_custom: Yup.string().when("service_category", {
    is: "custom",
    then: (schema) => schema.required("New main service is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  service_sub_category: Yup.string().required("Service subcategory is required"),

  service_sub_category_custom: Yup.string().when("service_sub_category", {
    is: "custom",
    then: (schema) => schema.required("New sub-service is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  availability_type: Yup.string()
    .required("Availability is required")
    .oneOf(["mon_fri", "full_week", "custom"], "Select a valid availability"),

  availability_days: Yup.array().when("availability_type", {
    is: "custom",
    then: (schema) => schema.min(1, "Select at least one day").required("Availability days are required"),
    otherwise: (schema) => schema.nullable(),
  }),

  office_start_time: Yup.string()
    .required("Office start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),

  office_end_time: Yup.string()
    .required("Office end time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { office_start_time } = this.parent;
      if (!office_start_time || !value) return true;
      return value > office_start_time;
    }),

  password: passwordValidation,

  password_confirmation: Yup.string()
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  terms_accepted: Yup.boolean()
    .required("You must accept the terms and conditions")
    .oneOf([true], "You must accept the terms and conditions to register"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string().required("Password is required"),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  password: passwordValidation,

  password_confirmation: Yup.string()
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
