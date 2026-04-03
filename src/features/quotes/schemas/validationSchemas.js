// features/quotes/schemas/validationSchemas.js
import * as Yup from "yup";


export const quoteValidationSchema = Yup.object().shape({
  // Section 1: Quote Details
  title: Yup.string()
    .required("Quote title is required")
    .max(255, "Title must be at most 255 characters")
    .test(
      "not-empty",
      "Quote title cannot be empty",
      (value) => !!value && value.trim().length > 0,
    ),

  client_id: Yup.string()
    .required("Client is required")
    .test(
      "client-selected",
      "Please select a valid client",
      (value) => !!value && value !== "",
    ),

  quote_due_date: Yup.date()
    .nullable()
    .typeError("Invalid date format"),

  currency: Yup.string()
    .required("Currency is required")
    .length(3, "Currency must be 3 characters (e.g., USD, EUR, GBP)")
    .oneOf(["USD", "EUR", "GBP", "JPY", "CAD", "AUD"], "Invalid currency"),

  // Section 2: Line Items - EACH ITEM MUST BE VALID
  line_items: Yup.array()
    .of(
      Yup.object().shape({
        item_name: Yup.string()
          .required("Item name is required for all items")
          .max(255, "Item name must be at most 255 characters")
          .test(
            "not-empty",
            "Item name cannot be empty",
            (value) => !!value && value.trim().length > 0,
          ),

        quantity: Yup.number()
          .required("Qty is required")
          .min(1, "") // don't change it it's intentional
          .integer("") // don't change it it's intentional
          .typeError(""), // don't change it it's intentional

        unit_price: Yup.number()
          .required("Unit price is required")
          .min(1, "") // don't change it it's intentional
          .typeError(""), // don't change it it's intentional

        tax_rate: Yup.number()
          .required("Tax rate is required")
          .min(0, "") // don't change it it's intentional
          .max(100, "Cann't exceed 100")
          .typeError(""), // don't change it it's intentional

        description: Yup.string()
          .nullable()
          .max(255, "description must be at most 255 characters"),
        package_id: Yup.string().nullable(),
      }),
    )
    .min(1, "At least one line item is required")
    .test(
      "all-items-valid",
      "All line items must have item name, quantity, and unit price",
      function (items) {
        if (!items || items.length === 0) return false;

        // Check if EVERY item has all required fields filled
        return items.every(
          (item) =>
            item.item_name &&
            item.item_name.trim().length > 0 &&
            item.quantity > 0 &&
            item.unit_price > 0,
        );
      },
    ),

  // Section 3: Pricing Summary
  discount: Yup.number()
    .nullable()
    .min(0, "Discount cannot be negative")
    .typeError("Discount must be a number"),

  is_tax_applicable: Yup.boolean().default(false),

  tax_percentage: Yup.number().when("is_tax_applicable", {
    is: true,
    then: (schema) =>
      schema
        .required("Tax percentage is required")
        .oneOf([0, 5, 12, 18, 28], "Select a valid tax percentage"),
    otherwise: (schema) => schema.oneOf([0], "Tax percentage must be 0 when tax is not applicable"),
  }),

  deposit_required: Yup.boolean().default(false),

  deposit_type: Yup.string().when("deposit_required", {
    is: true,
    then: (schema) =>
      schema
        .required("Deposit type is required")
        .oneOf(["percentage", "fixed"], "Invalid deposit type"),
    otherwise: (schema) => schema.nullable(),
  }),

  deposit_amount: Yup.number().when("deposit_required", {
    is: true,
    then: (schema) =>
      schema
        .required("Deposit amount is required")
        .min(0, "Deposit amount cannot be negative")
        .typeError("Deposit amount must be a number"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Section 4: Client Approval
  approval_status: Yup.string()
    .oneOf(["pending", "accepted", "rejected"], "Invalid approval status")
    .default("pending"),

  client_signature: Yup.string().nullable(),
  approval_date: Yup.date().nullable().typeError("Invalid date format"),
  approval_action_date: Yup.date().nullable().typeError("Invalid date format"),

  // Section 5: Follow Ups & Reminders
  reminders: Yup.array().of(
    Yup.object().shape({
      follow_up_schedule: Yup.date()
        .nullable()
        .required("Follow up schedule is required")
        .typeError("Invalid date format"),
      reminder_type: Yup.string()
        .required("Reminder type is required")
        .oneOf(["email", "sms", "notification"], "Invalid reminder type"),
      reminder_status: Yup.string()
        .oneOf(["scheduled", "sent", "cancelled"], "Invalid reminder status")
        .default("scheduled"),
    }),
  ),

  // Section 6: Conversion to Job
  can_convert_to_job: Yup.boolean().default(true),

  // Meta
  notes: Yup.string().nullable(),
  expires_at: Yup.date()
    .nullable()
    .min(new Date(), "Expiry date must be in the future")
    .typeError("Invalid date format"),
});
