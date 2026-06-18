import * as Yup from "yup";

export const employeeValidationSchema = Yup.object({
  // Basic Information
  employee_id: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^[A-Z0-9-]+$/,
      {
        message: "Employee ID must contain only uppercase letters, numbers, and hyphens",
        excludeEmptyString: true
      }
    ),

  first_name: Yup.string()
    .required("First name is required")
    .max(191, "First name must be at most 191 characters"),

  last_name: Yup.string()
    .nullable()
    .max(191, "Last name must be at most 191 characters"),

  date_of_birth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(Date.now() - 24 * 60 * 60 * 1000), "Date of birth must be in the past"),

  gender: Yup.string()
    .nullable()
    .oneOf(["male", "female", "other"], "Invalid gender selection"),

  // Contact Details
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(191, "Email must be at most 191 characters"),

  mobile_number: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]+$/, "Mobile number must contain only digits")
    .min(6, "Mobile number must be at least 6 digits")
    .max(15, "Mobile number must not exceed 15 digits"),

  address: Yup.string()
    .nullable()
    .max(500, "Address must be at most 500 characters"),

  // Official Details
  designation: Yup.string()
    .required("Designation is required")
    .max(191, "Designation must be at most 191 characters"),

  department: Yup.string()
    .required("Department is required")
    .max(191, "Department must be at most 191 characters"),

  reporting_manager_id: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .positive("Invalid reporting manager"),

  role: Yup.string()
    .nullable()
    .oneOf(
      ["admin", "manager", "supervisor", "employee"],
      "Invalid role selection",
    ),

  is_active: Yup.boolean(),

  // Profile Photo
  profile_photo_temp_id: Yup.string()
    .nullable()
    .matches(/^tmp_[a-zA-Z0-9]+_[0-9]+$/, "Invalid photo upload ID"),

  remove_profile_photo: Yup.boolean(),
});
