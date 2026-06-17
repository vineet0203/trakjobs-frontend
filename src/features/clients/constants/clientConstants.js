// Dynamic SERVICE_CATEGORIES - will be populated from API
export const SERVICE_CATEGORIES = {
  "home-services": {
    name: "Home Services",
    subcategories: [
      { value: "plumbing", label: "Plumbing" },
      { value: "electrical", label: "Electrical" },
      { value: "cleaning", label: "Cleaning" },
      { value: "painting", label: "Painting" },
      { value: "pest-control", label: "Pest Control" },
      { value: "moving", label: "Moving" }
    ]
  },
  "repair-services": {
    name: "Repair Services",
    subcategories: [
      { value: "ac-repair", label: "AC Repair" },
      { value: "appliance-repair", label: "Appliance Repair" },
      { value: "furniture-repair", label: "Furniture Repair" }
    ]
  },
  "automotive": {
    name: "Automotive",
    subcategories: [
      { value: "car-washing", label: "Car Washing" },
      { value: "car-repair", label: "Car Repair" },
      { value: "tyre-change", label: "Tyre Change" }
    ]
  },
  "other-services": {
    name: "Other Services",
    subcategories: [
      { value: "gardening", label: "Gardening" },
      { value: "security", label: "Security" },
      { value: "photography", label: "Photography" }
    ]
  }
};

export const MAIN_CATEGORY_OPTIONS = [
  { value: "home-services", label: "Home Services" },
  { value: "repair-services", label: "Repair Services" },
  { value: "automotive", label: "Automotive" },
  { value: "other-services", label: "Other Services" }
];

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];
export const WEEKEND_DAYS = ["saturday", "sunday"];
export const ALL_DAYS = [...WEEKDAYS, ...WEEKEND_DAYS];

export const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export const BUSINESS_TYPE_OPTIONS = [
  { value: "sole_proprietor", label: "Sole Proprietor" },
  { value: "partnership", label: "Partnership" },
  { value: "private_limited", label: "Private Limited" },
  { value: "public_limited", label: "Public Limited" },
  { value: "llp", label: "LLP" },
  { value: "cooperative", label: "Cooperative" },
  { value: "ngo", label: "NGO" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

export const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "real_estate", label: "Real Estate" },
  { value: "hospitality", label: "Hospitality" },
  { value: "logistics", label: "Logistics" },
  { value: "other", label: "Other" },
];

export const DESIGNATION_OPTIONS = [
  { value: "director", label: "Director" },
  { value: "manager", label: "Manager" },
  { value: "owner", label: "Owner" },
  { value: "ceo", label: "CEO" },
  { value: "cfo", label: "CFO" },
  { value: "accountant", label: "Accountant" },
  { value: "other", label: "Other" },
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

export const INITIAL_CLIENT_VALUES = {
  client_type: "commercial",
  email: "",
  mobile_number: "",
  alternate_mobile_number: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  first_name: "",
  last_name: "",
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

export const COUNTRY_OPTIONS = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "AE", label: "UAE" },
  { value: "SG", label: "Singapore" },
  { value: "AU", label: "Australia" },
  { value: "CA", label: "Canada" },
  { value: "OTHER", label: "Other" },
];

export const PAYMENT_TERM_OPTIONS = [
  { value: "immediate", label: "Immediate" },
  { value: "net_7", label: "Net 7 Days" },
  { value: "net_15", label: "Net 15 Days" },
  { value: "net_30", label: "Net 30 Days" },
  { value: "net_60", label: "Net 60 Days" },
  { value: "net_90", label: "Net 90 Days" },
];

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "AED", label: "AED - UAE Dirham" },
];

export const TAX_PERCENTAGE_OPTIONS = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "12", label: "12%" },
  { value: "18", label: "18%" },
  { value: "28", label: "28%" },
];


export const TAX_APPLICABLE_OPTIONS = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

