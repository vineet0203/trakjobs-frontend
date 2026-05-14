import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import reportsService from '../services/reportsService';

const ReportsDataContext = createContext(null);

export const tabOptions = [
  { key: 'overview',     label: 'Overview' },
  { key: 'customer',     label: 'Customer Report' },
  { key: 'employee',     label: 'Employee Report' },
  { key: 'revenue',      label: 'Revenue' },
  { key: 'invoice',      label: 'Invoice Report' },
  { key: 'jobs',         label: 'Job Status' },
  { key: 'expense',      label: 'Expenses' },
  { key: 'performance',  label: 'Performance' },
];

export const quickFilterOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

export const ReportsDataProvider = ({ children }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const filtersRef = useRef({});

  const fetchData = useCallback(async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const activeFilters = { ...filtersRef.current, ...newFilters };
      filtersRef.current = activeFilters;

      const apiParams = {};

      if (activeFilters.period && activeFilters.period !== 'Custom')
        apiParams.period = activeFilters.period.toLowerCase();
      if (activeFilters.startDate)  apiParams.start_date = activeFilters.startDate;
      if (activeFilters.endDate)    apiParams.end_date   = activeFilters.endDate;

      if (activeFilters.customer && activeFilters.customer !== 'All Customers')
        apiParams.customer = activeFilters.customer;

      if (activeFilters.employee && activeFilters.employee !== 'All Employees')
        apiParams.employee = activeFilters.employee;

      if (activeFilters.jobStatus && activeFilters.jobStatus !== 'All Status')
        apiParams.job_status = activeFilters.jobStatus;

      if (activeFilters.paymentStatus && activeFilters.paymentStatus !== 'All Status')
        apiParams.payment_status = activeFilters.paymentStatus;

      if (activeFilters.serviceType && activeFilters.serviceType !== 'All Services')
        apiParams.work_type = activeFilters.serviceType;

      const result = await reportsService.getOverview(apiParams);
      setData(result);
    } catch (err) {
      console.error('Reports API Error:', err);
      setError(err?.response?.data?.message || err?.message || 'Unknown API Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReportsDataContext.Provider value={{ data, loading, error, filters: filtersRef.current, refetch: fetchData }}>
      {children}
    </ReportsDataContext.Provider>
  );
};

export const useReportsData = () => {
  const ctx = useContext(ReportsDataContext);
  if (!ctx) throw new Error('useReportsData must be used within <ReportsDataProvider>');
  return ctx;
};

export const useKpiCards         = () => { const { data, loading, error } = useReportsData(); return { kpiCards:               data?.kpi_stats          || [], loading, error }; };
export const useRevenueData      = () => { const { data, loading, error } = useReportsData(); return { revenueData:            data?.revenue_chart      || [], loading, error }; };
export const useJobStatusData    = () => { const { data, loading, error } = useReportsData(); return { jobStatusData:          data?.job_status         || [], loading, error }; };
export const useEmployeePerf     = () => { const { data, loading, error } = useReportsData(); return { employeePerformanceData: data?.employee_performance || [], loading, error }; };
export const useInvoiceAnalytics = () => { const { data, loading, error } = useReportsData(); return { invoiceAnalyticsData:   data?.invoice_analytics  || [], loading, error }; };
export const useRecentReports    = () => { const { data, loading, error } = useReportsData(); return { recentReportsData:      data?.recent_jobs        || [], loading, error }; };
export const useTopCustomers     = () => { const { data, loading, error } = useReportsData(); return { topCustomers:           data?.top_customers      || [], loading, error }; };
export const useTopEmployees     = () => { const { data, loading, error } = useReportsData(); return { topEmployees:           data?.top_employees      || [], loading, error }; };
export const useRevenueSummary   = () => { const { data, loading, error } = useReportsData(); return { revenueSummary:         data?.revenue_summary    || {}, loading, error }; };
export const useRecentActivities = () => { const { data, loading, error } = useReportsData(); return { recentActivities:       data?.recent_activities  || [], loading, error }; };
