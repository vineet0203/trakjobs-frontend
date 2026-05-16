import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../../services/api/httpClient';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState(null);

  const rangeParams = useMemo(() => {
    if (!range) return {};
    return { from: formatYmd(range.start), to: formatYmd(range.end) };
  }, [range]);

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await httpClient.get('/api/v1/dashboard', { params: rangeParams });
        if (!mounted) return;
        setData(response?.data?.data || response?.data || {});
      } catch (err) {
        if (!mounted) return;
        const message = err?.response?.data?.message || err?.message || 'Failed to load dashboard.';
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDashboard();
    return () => { mounted = false; };
  }, [rangeParams]);

  const stats = data?.stats || [];
  const todaySchedule = data?.todaySchedule || [];
  const teamStatus = data?.teamStatus || { summary: [], members: [] };
  const totalEarning = data?.totalEarning || { amount: '0.00', change: '0%', changeLabel: '' };
  const earningChart = data?.earningChart || [];
  const recentQuotes = data?.recentQuotes || [];
  const recentInvoices = data?.recentInvoices || [];

  const statCards = useMemo(() => {
    const config = [
      { key: 'active', label: 'Active Job', color: 'green', icon: 'briefcase' },
      { key: 'quote', label: 'Total Quote', color: 'blue', icon: 'file' },
      { key: 'job', label: 'Total Job', color: 'purple', icon: 'chart' },
      { key: 'invoice', label: 'Total Invoice', color: 'orange', icon: 'invoice' },
      { key: 'booking', label: 'Total Booking', color: 'cyan', icon: 'calendar' },
    ];
    return config.map((item) => {
      const match = stats.find((stat) => stat.label === item.label) || null;
      return {
        ...item,
        value: match?.value ?? 0,
        change: match?.change ?? '0%',
        changeLabel: match?.changeLabel ?? '',
      };
    });
  }, [stats]);

  const summary = useMemo(() => buildSummary(teamStatus.summary || []), [teamStatus.summary]);
  const chartData = useMemo(() => buildLineChart(earningChart), [earningChart]);
  const dateRange = useMemo(() => formatDisplayRange(range), [range]);

  return (
    <div className="dashboard servicepro">
      {error && <div className="error-banner">{error}</div>}

      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="header-actions">
          <DateRangePicker value={range} onApply={setRange} label={dateRange} />
          {range && (
            <button className="reset-btn" onClick={() => setRange(null)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Reset
            </button>
          )}
        </div>
      </header>

      <section className="stats-row">
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="stat-card skeleton-card" />
        ))}
        {!loading && statCards.map((stat) => (
          <div key={stat.key} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              {getStatIcon(stat.icon)}
            </div>
            <div className="stat-details">
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-value ${stat.color}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="card schedule-card">
          <div className="card-header">
            <h3>Today Job Schedule</h3>
            <span className="card-date">{formatShortDate(new Date())}</span>
          </div>
          {!loading && todaySchedule.length > 0 && (() => {
            const completedCount = todaySchedule.filter((item) => item.status === 'completed').length;
            const percent = Math.round((completedCount / todaySchedule.length) * 100);
            return (
              <div className="schedule-progress">
                <div className="progress-text">
                  {completedCount} of {todaySchedule.length} jobs completed today
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ '--progress': `${percent}%` }} />
                </div>
              </div>
            );
          })()}

          <div className="schedule-list timeline">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="schedule-row skeleton-line" />
            ))}
            {!loading && todaySchedule.length === 0 && (
              <div className="schedule-empty">
                <div className="empty-illustration">
                  <svg width="80" height="60" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="8" y="12" width="104" height="60" rx="12" />
                    <path d="M32 10v8M88 10v8M8 28h104" />
                    <path d="M36 46h24M36 58h44" />
                  </svg>
                </div>
                <div className="empty-text">No jobs scheduled for today</div>
              </div>
            )}
            {!loading && todaySchedule.map((item, index) => (
              <div
                key={item.id}
                className={`schedule-item status-${item.status}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="timeline-col">
                  <div className={`timeline-dot ${item.status}`} />
                  <div className="timeline-time">
                    <span className="time-main">{formatTime(item.time).time}</span>
                    <span className="time-sub">{formatTime(item.time).suffix}</span>
                    <span className="schedule-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="timeline-card">
                  <div className="timeline-main">
                    <div className="schedule-service">{item.service}</div>
                    <div className="schedule-client">{item.client}</div>
                  </div>
                  <div className="schedule-actions">
                    <span className={`status-pill ${item.status}`}>{formatStatus(item.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <Link className="link" to="/schedule">View all schedules <span className="link-arrow">&gt;</span></Link>
          </div>
        </div>

        <div className="right-stack">
          <div className="card team-card">
            <div className="card-header">
              <h3>Team Status</h3>
              <span className="link">View all</span>
            </div>
            <div className="team-summary">
              {summary.map((item) => (
                <div key={item.key} className={`summary-chip ${item.key}`}>
                  <div className="chip-icon">{getTeamIcon(item.key)}</div>
                  <div className="chip-text">
                    <div className="chip-count">{item.count}</div>
                    <div className="chip-label">{item.label}</div>
                    <div className="chip-percent">{item.percent}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="team-list">
              {loading && Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="team-row skeleton-line" />
              ))}
              {!loading && teamStatus.members.length === 0 && (
                <div className="empty-state">No team members</div>
              )}
              {!loading && teamStatus.members.map((member) => (
                <div key={member.id} className="team-row">
                  <div className="avatar" style={{ background: avatarColor(member.name) }}>
                    {getInitials(member.name)}
                  </div>
                  <div className="team-info">
                    <div className="team-name">{member.name}</div>
                    <div className="team-role">{member.role}</div>
                  </div>
                  <div className="team-status">
                    <span className={`status-dot ${member.status}`} />
                    {formatTeamStatus(member.status)}
                  </div>
                  <div className="team-task">
                    <div>{member.currentTask || '-'}</div>
                    <div className="team-time">{member.jobTime || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card earning-card">
            <div className="card-header">
              <h3>Total Earning</h3>
              <button className="dropdown-pill">This Month v</button>
            </div>
            <div className="earning-amount">{formatCurrency(totalEarning.amount)}</div>
            <div className="earning-change">
              <span className="trend-arrow">^</span>
              <span>{totalEarning.change}</span>
              <span className="trend-label">{totalEarning.changeLabel}</span>
            </div>
            <div className="chart-wrapper">
              {loading && <div className="skeleton-chart" />}
              {!loading && (
                <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} width="100%" height="180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chartData.yTicks.map((tick) => (
                    <g key={tick.value}>
                      <line x1="36" x2={chartData.width - 20} y1={tick.y} y2={tick.y} stroke="#E2E8F0" strokeDasharray="4 4" />
                      <text x="0" y={tick.y + 4} className="axis-label">{tick.label}</text>
                    </g>
                  ))}
                  <path d={chartData.areaPath} fill="url(#earningGradient)" />
                  <path d={chartData.linePath} fill="none" stroke="#22C55E" strokeWidth="2" />
                  {chartData.points.map((point, i) => (
                    <circle key={i} cx={point.x} cy={point.y} r="3" fill="#22C55E" />
                  ))}
                  {chartData.xLabels.map((label) => (
                    <text key={label.value} x={label.x} y={chartData.height - 6} className="axis-label">{label.value}</text>
                  ))}
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="card list-card">
          <div className="card-header">
            <h3>Quote to Review</h3>
          </div>
          <div className="list-body">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="list-row skeleton-line" />
            ))}
            {!loading && recentQuotes.length === 0 && (
              <div className="empty-state">No quotes to review</div>
            )}
            {!loading && recentQuotes.map((quote) => (
              <div key={quote.id} className="list-row">
                <div>
                  <div className="list-title">{quote.client}</div>
                  <div className="list-sub">{quote.date}</div>
                </div>
                <div className="list-meta">
                  <div className="list-amount">{quote.amount}</div>
                  <span className={`badge ${quote.status}`}>{formatQuoteStatus(quote.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card list-card">
          <div className="card-header">
            <h3>Create Invoice</h3>
          </div>
          <div className="list-body">
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="list-row skeleton-line" />
            ))}
            {!loading && recentInvoices.length === 0 && (
              <div className="empty-state">No invoices available</div>
            )}
            {!loading && recentInvoices.map((invoice) => (
              <div key={invoice.id} className="list-row">
                <div>
                  <div className="list-title">{invoice.number}</div>
                  <div className="list-sub">{invoice.client}</div>
                </div>
                <div className="list-meta">
                  <div className="list-amount">{invoice.amount}</div>
                  <span className={`badge ${invoice.status}`}>{formatInvoiceStatus(invoice.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const DateRangePicker = ({ value, onApply, label }) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [tempRange, setTempRange] = useState(value || { start: today, end: today });
  const [hoverDate, setHoverDate] = useState(null);
  const [focusedDate, setFocusedDate] = useState(null);
  const [viewMonth, setViewMonth] = useState(startOfMonth(value?.start || today));
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = new Date();
      setTempRange(value || { start: t, end: t });
      setHoverDate(null);
      setViewMonth(startOfMonth(value?.start || t));
      setFocusedDate(value?.end || value?.start || t);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open || !focusedDate) return;
    const key = formatYmd(focusedDate);
    const target = wrapperRef.current?.querySelector(`[data-date="${key}"]`);
    if (target) {
      target.focus();
    }
  }, [open, focusedDate]);

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const nextMonth = useMemo(() => addMonths(viewMonth, 1), [viewMonth]);
  const days = useMemo(() => buildCalendarDays(viewMonth), [viewMonth]);
  const nextDays = useMemo(() => buildCalendarDays(nextMonth), [nextMonth]);

  const getPreviewRange = () => {
    if (tempRange.start && !tempRange.end && hoverDate) {
      const start = tempRange.start.getTime() <= hoverDate.getTime() ? tempRange.start : hoverDate;
      const end = tempRange.start.getTime() <= hoverDate.getTime() ? hoverDate : tempRange.start;
      return { start, end };
    }
    return tempRange;
  };

  const selectDay = (date) => {
    const selected = normalizeDate(date);
    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: selected, end: null });
      setHoverDate(null);
      setFocusedDate(selected);
      return;
    }
    if (selected.getTime() < tempRange.start.getTime()) {
      setTempRange({ start: selected, end: null });
      setHoverDate(null);
      setFocusedDate(selected);
      return;
    }
    setTempRange({ start: tempRange.start, end: selected });
    setHoverDate(null);
    setFocusedDate(selected);
  };

  const applyRange = () => {
    if (!tempRange.start || !tempRange.end) return;
    onApply({ start: tempRange.start, end: tempRange.end });
    setOpen(false);
  };

  const cancelRange = () => {
    setTempRange(value);
    setHoverDate(null);
    setFocusedDate(value.end || value.start);
    setOpen(false);
  };

  const applyPreset = (preset) => {
    const presetRange = getPresetRange(preset);
    setTempRange(presetRange);
    setHoverDate(null);
    setViewMonth(startOfMonth(presetRange.start));
    setFocusedDate(presetRange.end || presetRange.start);
  };

  const moveFocus = (daysOffset) => {
    const base = focusedDate || tempRange.end || tempRange.start || normalizeDate(new Date());
    const next = new Date(base.getFullYear(), base.getMonth(), base.getDate() + daysOffset);
    setFocusedDate(normalizeDate(next));

    const viewStart = startOfMonth(viewMonth);
    const nextStart = startOfMonth(nextMonth);
    const nextEnd = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0);
    if (next < viewStart || next > nextEnd) {
      setViewMonth(startOfMonth(next));
    }
  };

  const handleKeyDown = (event) => {
    if (!open) return;
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(-7);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(7);
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedDate) {
          selectDay(focusedDate);
        }
        break;
      default:
        break;
    }
  };

  const previewRange = getPreviewRange();
  const previewLabel = formatTempRange(previewRange);

  const renderCalendar = (calendarDays, monthLabel) => (
    <div className="picker-calendar">
      <div className="weekday-row">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={`${monthLabel}-${day}`} className="weekday-cell">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day) => {
          const isStart = previewRange.start && isSameDay(day.date, previewRange.start);
          const isEnd = previewRange.end && isSameDay(day.date, previewRange.end);
          const inRange = previewRange.start && previewRange.end && isWithinRange(day.date, previewRange.start, previewRange.end);
          const isFocused = focusedDate && isSameDay(day.date, focusedDate);
          return (
            <button
              key={day.key}
              type="button"
              className={`day-cell${day.isCurrentMonth ? '' : ' muted'}${inRange ? ' in-range' : ''}${isStart ? ' range-start' : ''}${isEnd ? ' range-end' : ''}`}
              data-date={formatYmd(day.date)}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => selectDay(day.date)}
              onFocus={() => setFocusedDate(normalizeDate(day.date))}
              onMouseEnter={() => {
                if (tempRange.start && !tempRange.end) {
                  setHoverDate(normalizeDate(day.date));
                }
              }}
              onMouseLeave={() => {
                if (tempRange.start && !tempRange.end) {
                  setHoverDate(null);
                }
              }}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="date-picker-wrapper" ref={wrapperRef}>
      <button className="date-pill" type="button" onClick={() => setOpen((prev) => !prev)}>
        <span className="date-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        <span>{label}</span>
      </button>

      {open && (
        <div className="date-picker" onKeyDown={handleKeyDown} tabIndex={-1}>
          <div className="picker-layout">
            <div className="picker-presets">
              {['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth'].map((preset) => (
                <button key={preset} type="button" className="preset-button" onClick={() => applyPreset(preset)}>
                  {formatPresetLabel(preset)}
                </button>
              ))}
            </div>
            <div className="picker-calendars">
              <div className="calendars-header">
                <div className="calendar-nav">
                  <button type="button" className="nav-button" onClick={() => setViewMonth(addMonths(viewMonth, -1))}>&lt;</button>
                  <div className="month-label">{formatMonthYear(viewMonth)}</div>
                </div>
                <div className="calendar-nav">
                  <div className="month-label">{formatMonthYear(nextMonth)}</div>
                  <button type="button" className="nav-button" onClick={() => setViewMonth(addMonths(viewMonth, 1))}>&gt;</button>
                </div>
              </div>
              <div className="calendars-grid">
                {renderCalendar(days, formatMonthYear(viewMonth))}
                {renderCalendar(nextDays, formatMonthYear(nextMonth))}
              </div>
            </div>
          </div>

          <div className="picker-actions">
            <div className="range-preview">{previewLabel}</div>
            <div className="action-buttons">
              <button type="button" className="secondary-button" onClick={cancelRange}>Cancel</button>
              <button type="button" className="primary-button" onClick={applyRange} disabled={!tempRange.start || !tempRange.end}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatIcon = (icon) => {
  switch (icon) {
    case 'briefcase':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 6h4a2 2 0 012 2v2H8V8a2 2 0 012-2z" />
          <path d="M4 10h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" />
        </svg>
      );
    case 'file':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );
    case 'invoice':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case 'chart':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19h16" />
          <path d="M8 17V9" />
          <path d="M12 17V5" />
          <path d="M16 17v-7" />
        </svg>
      );
  }
};

const formatCurrency = (value) => {
  const number = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(number)) return `$${value}`;
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatStatus = (status) => {
  if (!status) return '';
  return String(status).replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
};

const formatTeamStatus = (status) => {
  if (status === 'ideal') return 'Ideal Sitting';
  if (status === 'busy') return 'Busy';
  return 'Offline';
};

const formatQuoteStatus = (status) => {
  if (!status) return 'Pending';
  return String(status).replace(/_/g, ' ');
};

const formatInvoiceStatus = (status) => {
  if (!status) return 'Unpaid';
  return String(status).replace(/_/g, ' ');
};

const buildSummary = (summary) => {
  const base = [
    { key: 'ideal', label: 'Ideal Sitting', count: 0, percent: '0%' },
    { key: 'busy', label: 'Busy', count: 0, percent: '0%' },
    { key: 'offline', label: 'Offline', count: 0, percent: '0%' },
  ];
  return base.map((item) => {
    const match = summary.find((entry) => entry.key === item.key);
    return match ? { ...item, ...match } : item;
  });
};

const getTeamIcon = (key) => {
  const color = key === 'ideal' ? '#16A34A' : key === 'busy' ? '#F97316' : '#94A3B8';
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>;
};

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0].toUpperCase())
  .join('');

const avatarColor = (name = '') => {
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDisplayRange = (r) => {
  if (!r || !r.start || !r.end) return 'All Time';
  return formatShortDate(r.start) + ' – ' + formatShortDate(r.end);
};

const formatTempRange = (range) => {
  if (!range.start) return 'Select a start date';
  if (!range.end) return `${formatFullDate(range.start)} - ...`;
  return `${formatFullDate(range.start)} - ${formatFullDate(range.end)}`;
};

const formatFullDate = (date) => date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const formatMonthYear = (date) => date.toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
});

const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatYmd = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayRange = () => {
  const today = normalizeDate(new Date());
  return { start: today, end: today };
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date, count) => new Date(date.getFullYear(), date.getMonth() + count, 1);

const isSameDay = (a, b) => a && b && a.getTime() === b.getTime();

const isWithinRange = (date, start, end) => {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

const buildCalendarDays = (monthDate) => {
  const start = startOfMonth(monthDate);
  const startDay = start.getDay();
  const gridStart = new Date(start.getFullYear(), start.getMonth(), 1 - startDay);
  const days = [];

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    days.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      label: date.getDate(),
      isCurrentMonth: date.getMonth() === monthDate.getMonth(),
    });
  }

  return days;
};

const getPresetRange = (preset) => {
  const today = normalizeDate(new Date());

  switch (preset) {
    case 'yesterday': {
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      return { start: yesterday, end: yesterday };
    }
    case 'last7': {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
      return { start, end: today };
    }
    case 'last30': {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
      return { start, end: today };
    }
    case 'thisMonth': {
      const start = startOfMonth(today);
      return { start, end: today };
    }
    case 'lastMonth': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { start: normalizeDate(start), end: normalizeDate(end) };
    }
    case 'today':
    default:
      return { start: today, end: today };
  }
};

const formatPresetLabel = (preset) => {
  switch (preset) {
    case 'today':
      return 'Today';
    case 'yesterday':
      return 'Yesterday';
    case 'last7':
      return 'Last 7 Days';
    case 'last30':
      return 'Last 30 Days';
    case 'thisMonth':
      return 'This Month';
    case 'lastMonth':
      return 'Last Month';
    default:
      return preset;
  }
};

const formatShortDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (time) => {
  const parts = String(time).split(' ');
  if (parts.length >= 2) {
    return { time: parts[0], suffix: parts.slice(1).join(' ') };
  }
  return { time, suffix: '' };
};

const buildLineChart = (series) => {
  if (!series || series.length === 0) {
    return { width: 560, height: 190, points: [], linePath: '', areaPath: '', yTicks: [], xLabels: [] };
  }
  const W = 560, H = 190, PL = 40, PR = 20, PT = 10, PB = 24;
  const values = series.map(d => Number(d.value) || 0);
  const maxV = Math.max(...values);
  const effectiveMax = maxV > 0 ? maxV * 1.1 : 1000;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;
  const step = series.length > 1 ? chartW / (series.length - 1) : chartW;
  const points = series.map((d, i) => ({
    x: PL + i * step,
    y: PT + chartH - (Number(d.value) / effectiveMax) * chartH,
    label: d.date,
  }));
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = points.length > 0
    ? linePath + ` L ${points[points.length-1].x} ${PT+chartH} L ${points[0].x} ${PT+chartH} Z`
    : '';
  const tickValues = maxV > 0
    ? [0, Math.round(effectiveMax*0.25), Math.round(effectiveMax*0.5), Math.round(effectiveMax*0.75), Math.round(effectiveMax)]
    : [0, 250, 500, 750, 1000];
  const yTicks = tickValues.map(tick => ({
    value: tick,
    label: tick >= 1000 ? (tick/1000).toFixed(0)+'K' : String(tick),
    y: PT + chartH - (tick / effectiveMax) * chartH,
  }));
  const xLabels = points.filter((_, i) => i % Math.max(1, Math.floor(points.length / 8)) === 0).map(p => ({ value: p.label, x: p.x - 6 }));
  return { width: W, height: H, points, linePath, areaPath, yTicks, xLabels };
};

export default Dashboard;
