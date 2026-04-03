// features/clients/constants/clientConstants.js
export const BUSINESS_TYPE_OPTIONS = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "corporation", label: "Corporation" },
  { value: "non_profit", label: "Non-Profit Organization" },
  { value: "government", label: "Government Agency" },
  { value: "other", label: "Other" },
];

export const DESIGNATION_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "ceo", label: "CEO" },
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
  { value: "other", label: "Other" },
];

// ===== INDUSTRIES =====
export const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
];

export const DAYS_OF_WEEK = [
  { value: "monday", label: "Mon" }, // Changed from "mon"
  { value: "tuesday", label: "Tue" }, // Changed from "tue"
  { value: "wednesday", label: "Wed" }, // Changed from "wed"
  { value: "thursday", label: "Thu" }, // Changed from "thu"
  { value: "friday", label: "Fri" }, // Changed from "fri"
  { value: "saturday", label: "Sat" }, // Changed from "sat"
  { value: "sunday", label: "Sun" }, // Changed from "sun"
];

export const STATE_OPTIONS = [
  { value: "alabama", label: "Alabama" },
  { value: "alaska", label: "Alaska" },
  { value: "arizona", label: "Arizona" },
  { value: "arkansas", label: "Arkansas" },
  { value: "california", label: "California" },
  { value: "colorado", label: "Colorado" },
  { value: "connecticut", label: "Connecticut" },
  { value: "delaware", label: "Delaware" },
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "hawaii", label: "Hawaii" },
  { value: "idaho", label: "Idaho" },
  { value: "illinois", label: "Illinois" },
  { value: "indiana", label: "Indiana" },
  { value: "iowa", label: "Iowa" },
  { value: "kansas", label: "Kansas" },
  { value: "kentucky", label: "Kentucky" },
  { value: "louisiana", label: "Louisiana" },
  { value: "maine", label: "Maine" },
  { value: "maryland", label: "Maryland" },
  { value: "massachusetts", label: "Massachusetts" },
  { value: "michigan", label: "Michigan" },
  { value: "minnesota", label: "Minnesota" },
  { value: "mississippi", label: "Mississippi" },
  { value: "missouri", label: "Missouri" },
  { value: "montana", label: "Montana" },
  { value: "nebraska", label: "Nebraska" },
  { value: "nevada", label: "Nevada" },
  { value: "new_hampshire", label: "New Hampshire" },
  { value: "new_jersey", label: "New Jersey" },
  { value: "new_mexico", label: "New Mexico" },
  { value: "new_york", label: "New York" },
  { value: "north_carolina", label: "North Carolina" },
  { value: "north_dakota", label: "North Dakota" },
  { value: "ohio", label: "Ohio" },
  { value: "oklahoma", label: "Oklahoma" },
  { value: "oregon", label: "Oregon" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "rhode_island", label: "Rhode Island" },
  { value: "south_carolina", label: "South Carolina" },
  { value: "south_dakota", label: "South Dakota" },
  { value: "tennessee", label: "Tennessee" },
  { value: "texas", label: "Texas" },
  { value: "utah", label: "Utah" },
  { value: "vermont", label: "Vermont" },
  { value: "virginia", label: "Virginia" },
  { value: "washington", label: "Washington" },
  { value: "west_virginia", label: "West Virginia" },
  { value: "wisconsin", label: "Wisconsin" },
  { value: "wyoming", label: "Wyoming" },
];

export const COUNTRY_OPTIONS = [
  { value: "usa", label: "USA" },
];

export const PAYMENT_TERM_OPTIONS = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net_7", label: "Net 7 Days" },
  { value: "net_15", label: "Net 15 Days" },
  { value: "net_30", label: "Net 30 Days" },
  { value: "net_45", label: "Net 45 Days" },
  { value: "net_60", label: "Net 60 Days" },
];

export const CURRENCY_OPTIONS = [
  { value: "inr", label: "INR (₹)" }, // Enhanced
  { value: "usd", label: "USD ($)" }, // Enhanced
  { value: "eur", label: "EUR (€)" }, // Added
  { value: "gbp", label: "GBP (£)" }, // Added
  { value: "aed", label: "AED (د.إ)" }, // Added
  { value: "sgd", label: "SGD (S$)" }, // Added
  { value: "cad", label: "CAD (C$)" }, // Added
  { value: "aud", label: "AUD (A$)" }, // Added
];

export const TAX_PERCENTAGE_OPTIONS = [
  { value: "0", label: "0%" }, // Added
  { value: "5", label: "5%" },
  { value: "12", label: "12%" },
  { value: "18", label: "18%" },
  { value: "28", label: "28%" }, // Added
];

export const TAX_APPLICABLE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const RESIDENTIAL_CATEGORY_OPTIONS = [
  { value: "handyman", label: "Handyman Services" },
  { value: "plumbing", label: "Plumbing Services" },
  { value: "electrical", label: "Electrical Services" },
  { value: "hvac", label: "HVAC Services" },
  { value: "home_cleaning", label: "Home Cleaning Services" },
  { value: "roof_repair", label: "Roof Repair Services" },
  { value: "home_renovation", label: "Home Renovation Services" },
  { value: "landscaping", label: "Landscaping Services" },
  { value: "pest_control", label: "Pest Control Services" },
  { value: "appliance_repair", label: "Appliance Repair Services" },
  { value: "flooring", label: "Flooring Installation Services" },
  { value: "painting", label: "Painting Services" },
  { value: "window_glass", label: "Window and Glass Services" },
  { value: "home_security", label: "Home Security Installation" },
  { value: "pool_maintenance", label: "Pool Maintenance Services" },
];

export const COMMERCIAL_CATEGORY_OPTIONS = [
  { value: "commercial_plumbing", label: "Commercial Plumbing Services" },
  { value: "commercial_electrical", label: "Commercial Electrical Services" },
  { value: "commercial_hvac", label: "Commercial HVAC Services" },
  { value: "commercial_cleaning", label: "Commercial Cleaning Services" },
  { value: "commercial_roofing", label: "Commercial Roofing Services" },
  { value: "office_renovation", label: "Office Renovation Services" },
  { value: "commercial_landscaping", label: "Commercial Landscaping Services" },
  { value: "fire_protection", label: "Fire Protection Services" },
  { value: "commercial_security", label: "Commercial Security Systems" },
  { value: "elevator_maintenance", label: "Elevator Maintenance Services" },
  { value: "industrial_equipment", label: "Industrial Equipment Maintenance" },
  { value: "commercial_flooring", label: "Commercial Flooring Services" },
  { value: "signage_installation", label: "Signage Installation Services" },
  { value: "it_network", label: "IT and Network Services" },
  { value: "facility_management", label: "Facility Management Services" },
];

export const getCategoryOptionsByClientType = (clientType) => {
  return clientType === "commercial"
    ? COMMERCIAL_CATEGORY_OPTIONS
    : RESIDENTIAL_CATEGORY_OPTIONS;
};

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];
export const WEEKEND_DAYS = ["saturday", "sunday"];
export const ALL_DAYS = [...WEEKDAYS, ...WEEKEND_DAYS];

// ===== INITIAL FORM VALUES =====
export const INITIAL_CLIENT_VALUES = {
  client_type: "commercial",
  // common contact
  email: "",
  mobile_number: "",
  alternate_mobile_number: "",
  // common address (snake_case)
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",

  // residential
  first_name: "",
  last_name: "",

  // commercial
  business_name: "",
  business_type: "",
  industry: "",
  business_registration_number: "",
  contact_person_name: "",
  designation: "",
  billing_name: "",
  payment_term: "net_30",
  preferred_currency: "usd",
  is_tax_applicable: false,
  tax_percentage: "0",
  website_url: "",
  logo_temp_id: null,
  remove_logo: false,
  service_category: "",
  notes: "",

  // availability - will be transformed in transformer
  availability_schedule: {
    available_days: [],
    preferred_start_time: "09:00",
    preferred_end_time: "17:00",
    has_lunch_break: false,
    lunch_start: "12:00",
    lunch_end: "13:00",
    notes: "",
  },
};
