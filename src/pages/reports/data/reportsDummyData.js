// Static dummy data for Reports & Analytics module

export const kpiCards = [
  { id: 'totalJobs', label: 'Total Jobs', value: '248', growth: '+12.5%', positive: true, period: 'vs Apr 2024', icon: 'briefcase', color: '#2563eb', bg: '#eff6ff' },
  { id: 'totalRevenue', label: 'Total Revenue', value: '$2,45,680', growth: '+18.6%', positive: true, period: 'vs Apr 2024', icon: 'dollar', color: '#059669', bg: '#ecfdf5' },
  { id: 'pendingInvoices', label: 'Pending Invoices', value: '$68,320', growth: '+5.3%', positive: true, period: 'vs Apr 2024', icon: 'invoice', color: '#d97706', bg: '#fffbeb' },
  { id: 'completedJobs', label: 'Completed Jobs', value: '182', growth: '+14.2%', positive: true, period: 'vs Apr 2024', icon: 'check', color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'activeCustomers', label: 'Active Customers', value: '156', growth: '+8.7%', positive: true, period: 'vs Apr 2024', icon: 'users', color: '#2563eb', bg: '#eff6ff' },
  { id: 'employeeHours', label: 'Employee Hours', value: '1,243h', growth: '+11.4%', positive: true, period: 'vs Apr 2024', icon: 'clock', color: '#059669', bg: '#ecfdf5' },
  { id: 'profitMargin', label: 'Profit Margin', value: '28.6%', growth: '+6.3%', positive: true, period: 'vs Apr 2024', icon: 'trending', color: '#d97706', bg: '#fffbeb' },
  { id: 'monthlyGrowth', label: 'Monthly Growth', value: '18.6%', growth: '+4.8%', positive: true, period: 'vs Apr 2024', icon: 'chart', color: '#7c3aed', bg: '#f5f3ff' },
];

export const revenueData = [
  { month: 'Dec', value: 18500 },
  { month: 'Jan', value: 22400 },
  { month: 'Feb', value: 19800 },
  { month: 'Mar', value: 28600 },
  { month: 'Apr', value: 35200 },
  { month: 'May', value: 45680 },
];

export const jobStatusData = [
  { label: 'Pending', value: 32, color: '#f59e0b', percent: '12.9%' },
  { label: 'In Progress', value: 68, color: '#3b82f6', percent: '27.4%' },
  { label: 'Completed', value: 182, color: '#10b981', percent: '73.4%' },
  { label: 'Cancelled', value: 14, color: '#ef4444', percent: '5.6%' },
];

export const employeePerformanceData = [
  { name: 'Ajinkya', completedJobs: 87, color: '#3b82f6' },
  { name: 'Sagar', completedJobs: 72, color: '#3b82f6' },
  { name: 'Rohit', completedJobs: 56, color: '#3b82f6' },
  { name: 'Pooja', completedJobs: 41, color: '#3b82f6' },
  { name: 'Vikram', completedJobs: 32, color: '#3b82f6' },
];

export const invoiceAnalyticsData = [
  { month: 'Dec', paid: 22000, unpaid: 8000, overdue: 3000 },
  { month: 'Jan', paid: 28000, unpaid: 12000, overdue: 5000 },
  { month: 'Feb', paid: 32000, unpaid: 10000, overdue: 4000 },
  { month: 'Mar', paid: 38000, unpaid: 14000, overdue: 6000 },
  { month: 'Apr', paid: 42000, unpaid: 16000, overdue: 7000 },
  { month: 'May', paid: 52000, unpaid: 18000, overdue: 8000 },
];

export const recentReportsData = [
  { jobId: 'JOB-2024-248', customer: 'ABC Corporation', employee: 'Ajinkya Mhetre', serviceType: 'Installation', amount: '$18,560', status: 'Completed', date: 'May 31, 2024' },
  { jobId: 'JOB-2024-247', customer: 'XYZ Services', employee: 'Sagar Patil', serviceType: 'Maintenance', amount: '$9,750', status: 'In Progress', date: 'May 30, 2024' },
  { jobId: 'JOB-2024-246', customer: 'PQR Solutions', employee: 'Rohit Shinde', serviceType: 'Repair', amount: '$12,300', status: 'Pending', date: 'May 30, 2024' },
  { jobId: 'JOB-2024-245', customer: 'LMN Enterprises', employee: 'Pooja More', serviceType: 'Installation', amount: '$22,450', status: 'Completed', date: 'May 29, 2024' },
  { jobId: 'JOB-2024-244', customer: 'Dream Home Pvt. Ltd.', employee: 'Vikram Gaikwad', serviceType: 'Maintenance', amount: '$9,680', status: 'Cancelled', date: 'May 28, 2024' },
  { jobId: 'JOB-2024-243', customer: 'ABC Corporation', employee: 'Ajinkya Mhetre', serviceType: 'Repair', amount: '$14,200', status: 'Completed', date: 'May 27, 2024' },
  { jobId: 'JOB-2024-242', customer: 'XYZ Services', employee: 'Sagar Patil', serviceType: 'Installation', amount: '$31,500', status: 'Completed', date: 'May 26, 2024' },
  { jobId: 'JOB-2024-241', customer: 'PQR Solutions', employee: 'Rohit Shinde', serviceType: 'Maintenance', amount: '$8,900', status: 'In Progress', date: 'May 25, 2024' },
];

export const topCustomers = [
  { name: 'ABC Corporation', totalJobs: 32, revenue: '$58,540' },
  { name: 'XYZ Services', totalJobs: 28, revenue: '$52,430' },
  { name: 'PQR Solutions', totalJobs: 21, revenue: '$41,230' },
  { name: 'LMN Enterprises', totalJobs: 18, revenue: '$31,580' },
  { name: 'Dream Home Pvt. Ltd.', totalJobs: 15, revenue: '$25,340' },
];

export const topEmployees = [
  { name: 'Ajinkya Mhetre', hours: '245h', completedJobs: 87 },
  { name: 'Sagar Patil', hours: '210h', completedJobs: 72 },
  { name: 'Rohit Shinde', hours: '168h', completedJobs: 56 },
  { name: 'Pooja More', hours: '132h', completedJobs: 41 },
  { name: 'Vikram Gaikwad', hours: '98h', completedJobs: 32 },
];

export const revenueSummary = {
  totalRevenue: '$2,45,680',
  totalExpenses: '$1,32,450',
  netProfit: '$1,13,230',
  revenueGrowth: '+18.6%',
  expenseGrowth: '+8.4%',
  profitGrowth: '+28.4%',
};

export const recentActivities = [
  { text: 'New job JOB-2024-248 created', by: 'Ajinkya Mhetre', time: '2m ago', type: 'job' },
  { text: 'Invoice INV-2024-1024 paid', by: 'ABC Corporation', time: '15m ago', type: 'invoice' },
  { text: 'JOB-2024-247 status updated to In Progress', by: '', time: '31m ago', type: 'status' },
  { text: 'New customer XYZ Services added', by: 'Sagar Patil', time: '1h ago', type: 'customer' },
  { text: 'JOB-2024-245 completed', by: 'Pooja More', time: '2h ago', type: 'completed' },
];

export const tabOptions = [
  { key: 'overview', label: 'Overview' },
  { key: 'customer', label: 'Customer Report' },
  { key: 'employee', label: 'Employee Report' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'invoice', label: 'Invoice Report' },
  { key: 'jobs', label: 'Job Status' },
  { key: 'expense', label: 'Expenses' },
  { key: 'performance', label: 'Performance' },
];

export const quickFilterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];
