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

export const SERVICE_CATEGORIES = {
  home_repair: {
    label: "Home Repair Services",
    subcategories: [
      { value: "door_repair", label: "Door Repair & Installation" },
      { value: "window_repair", label: "Window Repair" },
      { value: "drywall_repair", label: "Drywall Repair" },
      { value: "wall_patching", label: "Wall Patching" },
      { value: "ceiling_repair", label: "Ceiling Repair" },
      { value: "furniture_assembly", label: "Furniture Assembly" },
      { value: "curtain_blind", label: "Curtain & Blind Installation" },
      { value: "lock_replacement", label: "Lock Replacement" },
      { value: "shelf_installation", label: "Shelf Installation" },
      { value: "tv_mounting", label: "TV Wall Mounting" },
    ]
  },
  electrical: {
    label: "Electrical Services",
    subcategories: [
      { value: "light_installation", label: "Light Installation" },
      { value: "fan_installation", label: "Fan Installation" },
      { value: "switch_socket", label: "Switch & Socket Repair" },
      { value: "wiring_repair", label: "Wiring Repair" },
      { value: "doorbell", label: "Doorbell Installation" },
      { value: "cctv", label: "CCTV Installation" },
      { value: "power_backup", label: "Power Backup Setup" },
    ]
  },
  plumbing: {
    label: "Plumbing Services",
    subcategories: [
      { value: "tap_repair", label: "Tap Repair" },
      { value: "pipe_leakage", label: "Pipe Leakage Repair" },
      { value: "toilet_repair", label: "Toilet Repair" },
      { value: "sink_installation", label: "Sink Installation" },
      { value: "water_tank_cleaning", label: "Water Tank Cleaning" },
      { value: "bathroom_fitting", label: "Bathroom Fitting Installation" },
      { value: "shower_repair", label: "Shower Repair" },
    ]
  },
  painting_wall: {
    label: "Painting & Wall Services",
    subcategories: [
      { value: "interior_painting", label: "Interior Painting" },
      { value: "exterior_painting", label: "Exterior Painting" },
      { value: "texture_painting", label: "Texture Painting" },
      { value: "wallpaper", label: "Wallpaper Installation" },
      { value: "wall_cleaning", label: "Wall Cleaning" },
      { value: "waterproofing", label: "Waterproofing" },
    ]
  },
  carpentry: {
    label: "Carpentry Services",
    subcategories: [
      { value: "modular_furniture", label: "Modular Furniture Work" },
      { value: "cabinet_repair", label: "Cabinet Repair" },
      { value: "wooden_door", label: "Wooden Door Repair" },
      { value: "bed_repair", label: "Bed Repair" },
      { value: "custom_shelves", label: "Custom Shelves" },
      { value: "kitchen_cabinet", label: "Kitchen Cabinet Installation" },
    ]
  },
  cleaning: {
    label: "Cleaning Services",
    subcategories: [
      { value: "deep_home", label: "Deep Home Cleaning" },
      { value: "sofa_cleaning", label: "Sofa Cleaning" },
      { value: "carpet_cleaning", label: "Carpet Cleaning" },
      { value: "kitchen_cleaning", label: "Kitchen Cleaning" },
      { value: "bathroom_cleaning", label: "Bathroom Cleaning" },
      { value: "water_tank", label: "Water Tank Cleaning" },
    ]
  },
  appliance: {
    label: "Appliance Services",
    subcategories: [
      { value: "ac_service", label: "AC Service & Repair" },
      { value: "refrigerator", label: "Refrigerator Repair" },
      { value: "washing_machine", label: "Washing Machine Repair" },
      { value: "microwave", label: "Microwave Repair" },
      { value: "geyser", label: "Geyser Installation" },
      { value: "chimney", label: "Chimney Cleaning" },
    ]
  },
  outdoor: {
    label: "Outdoor Services",
    subcategories: [
      { value: "garden_maintenance", label: "Garden Maintenance" },
      { value: "grass_cutting", label: "Grass Cutting" },
      { value: "fence_repair", label: "Fence Repair" },
      { value: "pressure_washing", label: "Pressure Washing" },
      { value: "outdoor_lighting", label: "Outdoor Lighting" },
    ]
  },
  smart_home: {
    label: "Smart Home & Installation",
    subcategories: [
      { value: "wifi_setup", label: "WiFi Setup" },
      { value: "smart_lock", label: "Smart Lock Installation" },
      { value: "smart_camera", label: "Smart Camera Setup" },
      { value: "home_automation", label: "Home Automation Setup" },
    ]
  },
  moving_support: {
    label: "Moving & Support Services",
    subcategories: [
      { value: "packing_unpacking", label: "Packing & Unpacking" },
      { value: "local_shifting", label: "Local Shifting Help" },
      { value: "heavy_item", label: "Heavy Item Moving" },
      { value: "office_setup", label: "Office Setup Assistance" },
    ]
  }
};

export const MAIN_CATEGORY_OPTIONS = Object.keys(SERVICE_CATEGORIES).map(key => ({
  value: key,
  label: SERVICE_CATEGORIES[key].label
}));

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
  service_sub_category: "",
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
