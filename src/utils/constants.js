// API Configuration
// In production (Netlify/Vercel), use the actual API URL
// In development, use proxy or env variable
const getApiBaseUrl = () => {
  // If env variable is set and it's a full URL, use it
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }
  // For production builds, always use the production API
  if (import.meta.env.PROD) {
    return "http://127.0.0.1:8000/api/v1";
  }
  // For development, use env variable or fallback
  return envUrl || "http://127.0.0.1:8000/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

// Application Name
export const APP_NAME = "TrakJobs";

// Navigation Items
export const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  {
    path: "/customers",
    label: "Customers",
    icon: "customers",
    children: [
      { path: "/onboarding", label: "Onboarding", icon: "onboarding" },
    ],
  },
  { path: "/quotes", label: "Quotes", icon: "quotes" },
  { path: "/jobs", label: "Jobs", icon: "jobs" },

  { path: "/schedule", label: "Schedule", icon: "schedule" },
  // { path: "/timesheets", label: "Timesheets", icon: "timesheets" },
  { path: "/online-booking", label: "Online Booking", icon: "booking" },
  { path: "/employees", label: "Employee Management", icon: "employees" },
  { path: "/time-tracking-approval", label: "Time Tracking Approval", icon: "timesheets" },
  { path: "/invoices", label: "Invoices", icon: "invoices" },

  { path: "/reports", label: "Reports", icon: "reports" },
  { path: "#notifications", label: "Notifications", icon: "notifications", isComponent: true },
  { path: "/settings", label: "Settings", icon: "settings" },
];

// Job Status Options
export const JOB_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const JOB_STATUS_LABELS = {
  [JOB_STATUS.PENDING]: "Pending",
  [JOB_STATUS.IN_PROGRESS]: "In Progress",
  [JOB_STATUS.COMPLETED]: "Completed",
  [JOB_STATUS.CANCELLED]: "Cancelled",
};

// Quote Status Options
export const QUOTE_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const QUOTE_STATUS_LABELS = {
  [QUOTE_STATUS.DRAFT]: "Draft",
  [QUOTE_STATUS.SENT]: "Sent",
  [QUOTE_STATUS.ACCEPTED]: "Accepted",
  [QUOTE_STATUS.REJECTED]: "Rejected",
};

// Schedule Status
export const SCHEDULE_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  RESCHEDULED: "rescheduled",
};

// Dummy Data for Development
export const DUMMY_CLIENTS = [
  {
    id: 1,
    name: "Amit Verma",
    email: "amit.verma@brighttech.solutions.in",
    phone: "+91 9876543210",
    company: "BrightTech Solutions",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Amit Verma",
    category: "Regular",
  },
  {
    id: 2,
    name: "Priya Malhotra",
    email: "priya.malhotra@sunrise.venture.com",
    phone: "+91 9876543211",
    company: "Sunrise Ventures",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Priya Malhotra",
    category: "Regular",
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@titanent.in",
    phone: "+91 9876543212",
    company: "Titan Enterprises",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Rajesh Kumar",
    category: "Enterprise",
  },
  {
    id: 4,
    name: "Sneha Arora",
    email: "sneha.arora@globalsoft.inecr.com",
    phone: "+91 9876543213",
    company: "GlobalSoft Inc.",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Sneha Arora",
    category: "Premium",
  },
  {
    id: 5,
    name: "Akash Patel",
    email: "akash.patel@elitebuild.in",
    phone: "+91 9876543214",
    company: "EliteBuild Constructions",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Akash Patel",
    category: "Regular",
  },
  {
    id: 6,
    name: "Kiran Shah",
    email: "kiran.shah@nexawebsol.stions.com",
    phone: "+91 9876543215",
    company: "Nexa Web Solutions",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Kiran Shah",
    category: "Regular",
  },
  {
    id: 7,
    name: "Neha Joshi",
    email: "neha.joshi@greenlesfitra.traes.com",
    phone: "+91 9876543216",
    company: "GreenLeaf Traders",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Neha Joshi",
    category: "Premium",
  },
  {
    id: 8,
    name: "Arjun Deshpande",
    email: "arjun.dechpande@metro.metrotech.in",
    phone: "+91 9876543217",
    company: "MetroTech Industries",
    businessType: "Technology Sector",
    status: "active",
    contactPerson: "Arjun Deshpande",
    category: "Regular",
  },
];

export const DUMMY_QUOTES = [
  {
    id: 1,
    clientName: "John Smith",
    title: "Website Redesign",
    amount: 5000,
    status: "sent",
    date: "2026-01-15",
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    title: "Mobile App Development",
    amount: 15000,
    status: "accepted",
    date: "2026-01-20",
  },
  {
    id: 3,
    clientName: "Mike Davis",
    title: "SEO Services",
    amount: 2000,
    status: "draft",
    date: "2026-01-25",
  },
  {
    id: 4,
    clientName: "Emily Brown",
    title: "Brand Identity",
    amount: 3500,
    status: "rejected",
    date: "2026-01-28",
  },
];

export const DUMMY_JOBS = [
  {
    id: 1,
    title: "Website Redesign",
    client: "John Smith",
    status: "in_progress",
    startDate: "2026-01-20",
    dueDate: "2026-02-20",
    priority: "high",
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "Sarah Johnson",
    status: "pending",
    startDate: "2026-02-01",
    dueDate: "2026-04-01",
    priority: "high",
  },
  {
    id: 3,
    title: "Logo Design",
    client: "Emily Brown",
    status: "completed",
    startDate: "2026-01-10",
    dueDate: "2026-01-25",
    priority: "medium",
  },
  {
    id: 4,
    title: "Database Migration",
    client: "David Wilson",
    status: "in_progress",
    startDate: "2026-01-15",
    dueDate: "2026-02-15",
    priority: "low",
  },
];

export const DUMMY_SCHEDULES = [
  {
    id: 1,
    title: "Client Meeting - John Smith",
    date: "2026-01-31",
    time: "10:00 AM",
    duration: "1 hour",
    type: "meeting",
  },
  {
    id: 2,
    title: "Project Kickoff - Mobile App",
    date: "2026-01-31",
    time: "2:00 PM",
    duration: "2 hours",
    type: "kickoff",
  },
  {
    id: 3,
    title: "Design Review",
    date: "2026-01-31",
    time: "4:00 PM",
    duration: "1.5 hours",
    type: "review",
  },
  {
    id: 4,
    title: "Sprint Planning",
    date: "2026-02-01",
    time: "9:00 AM",
    duration: "2 hours",
    type: "planning",
  },
];

// Recent Activity (Dummy)
export const DUMMY_RECENT_ACTIVITY = [
  {
    id: 1,
    action: "New client added",
    description: "John Smith was added as a new client",
    time: "2 hours ago",
    type: "client",
  },
  {
    id: 2,
    action: "Quote accepted",
    description: "Sarah Johnson accepted quote for Mobile App",
    time: "3 hours ago",
    type: "quote",
  },
  {
    id: 3,
    action: "Job completed",
    description: "Logo Design for Emily Brown completed",
    time: "5 hours ago",
    type: "job",
  },
  {
    id: 4,
    action: "Meeting scheduled",
    description: "Client meeting with David Wilson",
    time: "1 day ago",
    type: "schedule",
  },
  {
    id: 5,
    action: "Quote sent",
    description: "Website Redesign quote sent to John Smith",
    time: "1 day ago",
    type: "quote",
  },
];

// Dashboard Stats (Dummy)
export const DASHBOARD_STATS = {
  totalClients: 45,
  activeJobs: 12,
  pendingQuotes: 8,
  pendingJobs: 5,
  scheduledTasks: 15,
  revenue: 125000,
  completedJobs: 87,
};

// ============================================
// ADD CLIENT FORM OPTIONS
// ============================================

// Business Type Options
export const BUSINESS_TYPES = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

// Designation/Role Options
export const DESIGNATION_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "ceo", label: "CEO" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "other", label: "Other" },
];

// State Options (Indian States)
export const STATES = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "delhi", label: "Delhi" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
];

// Country Options
export const COUNTRIES = [
  { value: "india", label: "India" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "japan", label: "Japan" },
  { value: "singapore", label: "Singapore" },
  { value: "uae", label: "UAE" },
  { value: "other", label: "Other" },
];

// Payment Term Options
export const PAYMENT_TERMS = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net_7", label: "Net 7" },
  { value: "net_15", label: "Net 15" },
  { value: "net_30", label: "Net 30" },
  { value: "net_45", label: "Net 45" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
];

// Currency Options
export const CURRENCIES = [
  { value: "inr", label: "INR - Indian Rupee" },
  { value: "usd", label: "USD - US Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "aud", label: "AUD - Australian Dollar" },
  { value: "cad", label: "CAD - Canadian Dollar" },
  { value: "sgd", label: "SGD - Singapore Dollar" },
  { value: "aed", label: "AED - UAE Dirham" },
];

// Tax Percentage Options
export const TAX_PERCENTAGES = [
  { value: "0", label: "0%" },
  { value: "5", label: "5%" },
  { value: "12", label: "12%" },
  { value: "18", label: "18%" },
  { value: "28", label: "28%" },
];

// Client Category Options
export const CLIENT_CATEGORIES = [
  { value: "regular", label: "Regular" },
  { value: "premium", label: "Premium" },
  { value: "vip", label: "VIP" },
  { value: "new", label: "New" },
  { value: "corporate", label: "Corporate" },
  { value: "government", label: "Government" },
];

// Client Status Options
export const CLIENT_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Lead", label: "Lead" },
  { value: "Prospect", label: "Prospect" },
];
