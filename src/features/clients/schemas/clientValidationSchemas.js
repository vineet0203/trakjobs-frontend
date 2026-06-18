// features/clients/schemas/clientValidationSchemas.js
import * as Yup from "yup";

const commonContactSchema = {
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile_number: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]+$/, "Mobile number must contain only digits")
    .min(6, "Mobile number must be at least 6 digits")
    .max(15, "Mobile number must not exceed 15 digits"),
  alternate_mobile_number: Yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^[0-9]+$/, {
      message: "Alternate mobile number must contain only digits",
      excludeEmptyString: true
    })
    .min(6, "Alternate mobile number must be at least 6 digits")
    .max(15, "Alternate mobile number must not exceed 15 digits"),
};

const commonAddressSchema = {
  address_line_1: Yup.string().required("Address line 1 is required"),
  address_line_2: Yup.string(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  zip_code: Yup.string().required("Zip code is required"),
};

// Availability Schedule Schema (nested)
const availabilityScheduleSchema = Yup.object().shape({
  available_days: Yup.array()
    .min(1, "Select at least one available day")
    .required("Available days are required"),

  preferred_start_time: Yup.string()
    .required("Preferred start time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),

  preferred_end_time: Yup.string()
    .required("Preferred end time is required")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { preferred_start_time } = this.parent;
        if (!preferred_start_time || !value) return true;
        return value > preferred_start_time;
      },
    ),

  has_lunch_break: Yup.boolean().required(),

  lunch_start: Yup.string().when("has_lunch_break", {
    is: true,
    then: (schema) =>
      schema
        .required("Lunch start time is required")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    otherwise: (schema) => schema.nullable(),
  }),

  lunch_end: Yup.string().when("has_lunch_break", {
    is: true,
    then: (schema) =>
      schema
        .required("Lunch end time is required")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
        .test(
          "is-after-start",
          "Lunch end time must be after start time",
          function (value) {
            const { lunch_start } = this.parent;
            if (!lunch_start || !value) return true;
            return value > lunch_start;
          },
        ),
    otherwise: (schema) => schema.nullable(),
  }),

  notes: Yup.string().nullable(),
});

export const clientValidationSchema = (clientType) => {
  const baseSchema = {
    client_type: Yup.string().required("Client type is required"),

    // Common fields
    ...commonContactSchema,
    ...commonAddressSchema,

    // Availability Schedule - Now required as a nested object
    availability_schedule: availabilityScheduleSchema.required(
      "Availability schedule is required",
    ),
    service_category: Yup.string().required('Service category is required'),
    service_sub_category: Yup.string().required('Service subcategory is required'),

    // Commercial/Residential specific fields will be added below
  };

  if (clientType === "commercial") {
    return Yup.object({
      ...baseSchema,
      business_name: Yup.string().required("Business name is required"),
      business_type: Yup.string()
        .required("Business type is required")
        .test(
          "not-empty",
          "Business type is required",
          (value) => value && value !== "",
        ),
      industry: Yup.string()
        .required("Industry is required")
        .test(
          "not-empty",
          "Industry is required",
          (value) => value && value !== "",
        ),
      business_registration_number: Yup.string().nullable(),
      contact_person_name: Yup.string().required(
        "Contact person name is required",
      ),
      designation: Yup.string()
        .required("Designation is required")
        .test(
          "not-empty",
          "Designation is required",
          (value) => value && value !== "",
        ),
      billing_name: Yup.string().nullable(),
      payment_term: Yup.string()
        .required("Payment term is required")
        .test(
          "not-empty",
          "Payment term is required",
          (value) => value && value !== "",
        ),
      preferred_currency: Yup.string()
        .required("Currency is required")
        .test(
          "not-empty",
          "Currency is required",
          (value) => value && value !== "",
        ),
      is_tax_applicable: Yup.boolean().required(),
      tax_percentage: Yup.number()
        .transform((value, originalValue) => {
          return originalValue === "" ? null : value;
        })
        .when("is_tax_applicable", {
          is: true,
          then: (schema) =>
            schema
              .required("Tax percentage is required")
              .oneOf([0, 5, 12, 18, 28], "Select a valid tax percentage"),
          otherwise: (schema) => schema.oneOf([0], "Tax percentage must be 0 when tax is not applicable"),
        }),
      website_url: Yup.string()
        .url("Invalid URL format")
        .nullable()
        .transform((value) => (value === "" ? null : value)),
      remove_logo: Yup.boolean(),
      notes: Yup.string().nullable(),
    });
  } else {
    // residential
    return Yup.object({
      ...baseSchema,
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().nullable(),
    });
  }
};
