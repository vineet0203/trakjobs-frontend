import React, { useMemo } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import Sidebar from '../../dashboard/components/layout/Sidebar/Sidebar';
import employeeAuthService from '../services/employeeAuthService';

const timeEntries = [
  {
    id: 1,
    date: '17 Jun 2026',
    employee: 'Olivia Brown',
    jobName: 'Residential Cleaning',
    clockIn: '09:00 AM',
    clockOut: '05:00 PM',
    hours: '8h 00m',
    actionType: 'primary',
  },
  {
    id: 2,
    date: '16 Jun 2026',
    employee: 'Olivia Brown',
    jobName: 'Office Maintenance',
    clockIn: '08:30 AM',
    clockOut: '04:30 PM',
    hours: '8h 00m',
    actionType: 'neutral',
  },
  {
    id: 3,
    date: '15 Jun 2026',
    employee: 'Olivia Brown',
    jobName: 'Warehouse Setup',
    clockIn: '10:00 AM',
    clockOut: '06:00 PM',
    hours: '8h 00m',
    actionType: 'primary',
  },
  {
    id: 4,
    date: '14 Jun 2026',
    employee: 'Olivia Brown',
    jobName: 'Inventory Check',
    clockIn: '09:15 AM',
    clockOut: '05:15 PM',
    hours: '8h 00m',
    actionType: 'neutral',
  },
  {
    id: 5,
    date: '13 Jun 2026',
    employee: 'Olivia Brown',
    jobName: 'Client Site Visit',
    clockIn: '07:45 AM',
    clockOut: '03:45 PM',
    hours: '8h 00m',
    actionType: 'primary',
  },
];

const pageNumbers = [1, 2, 3, 4, 5];

const EmployeeDashboard = () => {
  const employee = useMemo(() => {
    try {
      const raw = localStorage.getItem('employee_auth_employee');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const displayName = useMemo(() => {
    if (employee?.full_name) return employee.full_name;
    if (employee?.first_name && employee?.last_name) {
      return `${employee.first_name} ${employee.last_name}`;
    }
    if (employee?.first_name) return employee.first_name;
    if (employee?.email) return employee.email.split('@')[0];
    return 'Employee';
  }, [employee]);

  const initials = useMemo(() => {
    if (displayName?.trim()) {
      return displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return 'EM';
  }, [displayName]);

  const handleEmployeeLogout = () => {
    employeeAuthService.logout();
    window.location.assign('/employee-login');
  };

  return (
    <div className="flex min-h-screen bg-[#F6F6F7]">
      <Sidebar />

      <div className="ml-60 flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-end border-b border-[#E8E8EC] bg-white px-6">
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="relative rounded-full p-2 transition hover:bg-[#F2F6FC]"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-[#202C4B]" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#0CDCF8]" />
            </button>

            <button
              type="button"
              onClick={handleEmployeeLogout}
              className="flex items-center gap-2 rounded-full border border-[#E4E7ED] px-2 py-1.5 transition hover:bg-[#F6F9FE]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3574BB] text-xs font-semibold text-white">
                {initials}
              </div>
              <span className="max-w-[180px] truncate text-sm font-medium text-[#202C4B]">
                {displayName}
              </span>
              <ChevronDown className="h-4 w-4 text-[#7D8494]" />
            </button>
          </div>
        </header>

        <main className="flex-1 bg-[#F6F6F7] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1280px] space-y-6">
            <section>
              <p className="text-[14px] font-semibold leading-5 text-[#202C4B]">Dashboard</p>
              <h1 className="mt-1 text-[20px] font-medium leading-7 text-[#202C4B]">Time Tracking</h1>
            </section>

            <section className="rounded-[20px] bg-gradient-to-r from-[#3574BB] via-[#3E7DC2] to-[#276AB6] px-5 py-6 shadow-[0_14px_30px_rgba(53,116,187,0.25)] sm:px-7">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr_auto] lg:items-center">
                <div>
                  <h2 className="text-[30px] font-bold leading-[1.1] text-white">Time tracker</h2>
                  <p className="mt-1.5 text-sm text-white/80">
                    Track your work hours accurately and start your shift in one click.
                  </p>
                </div>

                <div className="w-full lg:justify-self-center">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.04em] text-white/85" htmlFor="job-select">
                    Job
                  </label>
                  <div className="relative w-full max-w-[278px]">
                    <select
                      id="job-select"
                      className="h-[42px] w-full appearance-none rounded-lg border border-white/40 bg-white px-4 pr-10 text-sm text-[#4C5872] outline-none transition focus:border-[#0CDCF8] focus:ring-2 focus:ring-[#0CDCF8]/35"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Job
                      </option>
                      <option>Residential Cleaning</option>
                      <option>Office Maintenance</option>
                      <option>Inventory Check</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3574BB]" />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:justify-self-end">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-[6px] border-[#0CDCF8] bg-white/10 text-sm font-semibold text-white">
                      25%
                    </div>
                    <div>
                      <p className="text-[23px] font-semibold leading-7 text-white">00:00</p>
                      <p className="text-xs text-white/75">Current Timer</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="h-11 min-w-[92px] rounded-[10px] bg-[#0CDCF8] px-5 text-sm font-semibold text-[#074253] shadow-[0_10px_20px_rgba(12,220,248,0.35)] transition hover:brightness-95"
                  >
                    Start
                  </button>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[20px] border border-[#E3E5EA] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[920px] w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F2F2F6] text-left">
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Date</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Employee</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Job Name</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Clock In</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Clock Out</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Hours</th>
                      <th className="px-5 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#202C4B]">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {timeEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-[#DEDEE0] last:border-b-0">
                        <td className="px-5 py-[14px] text-sm text-[#3B4256]">{entry.date}</td>
                        <td className="px-5 py-[14px]">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCEAFE] text-[10px] font-semibold text-[#265C9D]">
                              {entry.employee
                                .split(' ')
                                .map((part) => part[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <span className="text-sm text-[#2A3349]">{entry.employee}</span>
                          </div>
                        </td>
                        <td className="px-5 py-[14px] text-sm text-[#3B4256]">{entry.jobName}</td>
                        <td className="px-5 py-[14px] text-sm text-[#3B4256]">{entry.clockIn}</td>
                        <td className="px-5 py-[14px] text-sm text-[#3B4256]">{entry.clockOut}</td>
                        <td className="px-5 py-[14px] text-sm font-medium text-[#2A3349]">{entry.hours}</td>
                        <td className="px-5 py-[14px]">
                          <button
                            type="button"
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                              entry.actionType === 'primary'
                                ? 'bg-[#3574BB] text-white'
                                : 'bg-[#EEF1F6] text-[#4E566A]'
                            }`}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 border-t border-[#ECEEF3] px-4 py-4 sm:flex-row sm:gap-5">
                <p className="text-sm text-[#616A81]">Showing 1-5 out of 50 results</p>
                <div className="flex items-center gap-2">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`h-9 w-9 rounded-[10px] text-sm font-medium transition ${
                        page === 1
                          ? 'bg-[#1F6BC4] text-white shadow-[0_8px_16px_rgba(31,107,196,0.28)]'
                          : 'bg-white text-[#2A3349] shadow-[0_2px_10px_rgba(31,45,61,0.14)]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
