import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Skeleton,
} from "@mui/material";
import { MapPin, Clock } from "lucide-react";
import scheduleService from "../services/scheduleService";
import employeeService from "../../employees/services/employeeService";
import httpClient from "../../../services/api/httpClient";

// ── Constants ─────────────────────────────────────────────────────────────────

const AVAILABILITY_LEGEND = [
  { label: "Available", color: "#4caf50" },
  { label: "Busy", color: "#f44336" },
  { label: "Time Off", color: "#ff9800" },
  { label: "Unassigned", color: "#9e9e9e" },
];

const VIEW_OPTIONS = [
  { label: "Daily", value: "timeGridDay" },
  { label: "Weekly", value: "timeGridWeek" },
  { label: "Monthly", value: "dayGridMonth" },
];

const STATUS_COLORS = {
  scheduled: { bg: "#E3F2FD", text: "#1565C0" },
  draft: { bg: "#F5F5F5", text: "#757575" },
  completed: { bg: "#E8F5E9", text: "#2E7D32" },
  cancelled: { bg: "#FFEBEE", text: "#C62828" },
  pending: { bg: "#FFF8E1", text: "#F57F17" },
  assigned: { bg: "#E8F5E9", text: "#2E7D32" },
  in_progress: { bg: "#E3F2FD", text: "#1565C0" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AVATAR_PALETTE = ["#1565C0", "#2E7D32", "#C62828", "#E65100", "#6A1B9A", "#00695C", "#4527A0", "#283593"];
const getAvatarColor = (name) => AVATAR_PALETTE[(name || "").charCodeAt(0) % AVATAR_PALETTE.length];

const formatTime = (isoStr) => {
  if (!isoStr) return "—";
  try {
    return new Date(isoStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "—";
  }
};

const toDateKey = (dateLike) => {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const normalizeEmployee = (employee) => {
  if (!employee) return null;
  const fullName = employee.full_name || "";
  const [firstFromFull, ...restFromFull] = fullName.split(" ").filter(Boolean);
  const lastFromFull = restFromFull.join(" ");

  return {
    id: employee.id,
    first_name: employee.first_name || firstFromFull || "",
    last_name: employee.last_name || lastFromFull || "",
    designation: employee.designation || "",
    role: employee.role || "",
  };
};

// ── Sub-components ────────────────────────────────────────────────────────────

const CrewMemberRow = ({ member, index, selected, onClick }) => {
  const name = `${member.first_name || ""} ${member.last_name || ""}`.trim() || `Member ${index + 1}`;
  const role = member.designation || member.role;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 1.5,
        p: 1,
        borderRadius: 1.5,
        cursor: "pointer",
        backgroundColor: selected ? "#eef2ff" : "transparent",
        border: selected ? "1px solid #c7d2fe" : "1px solid transparent",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: selected ? "#e0e7ff" : "#f8fafc",
        },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: "0.8rem",
          fontWeight: 600,
          backgroundColor: getAvatarColor(name),
          flexShrink: 0,
        }}
      >
        {getInitials(name)}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} noWrap>
          {name}
        </Typography>
        {role && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ textTransform: "capitalize", display: "block" }}
          >
            {role}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const UpcomingJobRow = ({ job, isLast }) => {
  const sc = STATUS_COLORS[job.status] || STATUS_COLORS.scheduled;
  return (
    <Box
      sx={{
        mb: 2,
        pb: 2,
        borderBottom: isLast ? "none" : "1px solid #f3f4f6",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Clock size={12} color="#9ca3af" />
          <Typography variant="caption" color="text.secondary">
            {formatTime(job.start)}
          </Typography>
        </Box>
        <Chip
          label={job.status || "scheduled"}
          size="small"
          sx={{
            backgroundColor: sc.bg,
            color: sc.text,
            fontWeight: 500,
            textTransform: "capitalize",
            fontSize: "0.68rem",
            height: 20,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>
      <Typography variant="body2" fontWeight={500} noWrap>
        {job.title || "—"}
      </Typography>
      {job.address && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <MapPin size={11} color="#9ca3af" />
          <Typography variant="caption" color="text.secondary" noWrap>
            {job.address}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const DispatchCalendarView = ({ onOpenModal }) => {
  const calendarRef = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [crews, setCrews] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingJobs, setUpcomingJobs] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingCrews, setLoadingCrews] = useState(true); // eslint-disable-line no-unused-vars
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedCrewId, setSelectedCrewId] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("all");
  const [calendarView, setCalendarView] = useState("timeGridWeek");

  useEffect(() => {
    fetchEmployees();
    fetchCrews();
    fetchEvents();
    fetchUpcomingJobs();
  }, []);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      // Use direct API call here to avoid service-level shape differences and ensure names always render.
      const response = await httpClient.get("/api/v1/vendors/employees", {
        params: { per_page: 100 },
      });
      const payload = response?.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

      setEmployees(list.map(normalizeEmployee).filter(Boolean));
    } catch {
      // Fallback to existing service if direct shape is unavailable.
      try {
        const serviceResponse = await employeeService.getAll({ per_page: 100 });
        const list = Array.isArray(serviceResponse?.data) ? serviceResponse.data : [];
        setEmployees(list.map(normalizeEmployee).filter(Boolean));
      } catch {
        // Last retry without per_page guard in case backend validator changes.
        try {
          const retryResponse = await httpClient.get("/api/v1/vendors/employees");
          const retryPayload = retryResponse?.data;
          const retryList = Array.isArray(retryPayload)
            ? retryPayload
            : Array.isArray(retryPayload?.data)
              ? retryPayload.data
              : Array.isArray(retryPayload?.data?.data)
                ? retryPayload.data.data
                : [];

          setEmployees(retryList.map(normalizeEmployee).filter(Boolean));
        } catch {
          setEmployees([]);
        }
      }
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchCrews = async () => {
    setLoadingCrews(true);
    try {
      const data = await scheduleService.getCrews();
      setCrews(Array.isArray(data) ? data : []);
    } catch {
      // Non-critical — crew panel shows empty state
    } finally {
      setLoadingCrews(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await scheduleService.getDispatchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchUpcomingJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await scheduleService.getUpcomingJobs();
      setUpcomingJobs(Array.isArray(data) ? data : []);
    } catch {
      setUpcomingJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────────────────

  const filteredEvents =
    events.filter((e) => {
      const byCrew = selectedCrewId === "all" || String(e.crew_id) === String(selectedCrewId);
      const assignedEmployeeId =
        e.employee_id ?? e.assigned_employee_id ?? e.crew_member_id ?? e.crew_id;
      const byEmployee =
        selectedEmployeeId === "all" || String(assignedEmployeeId) === String(selectedEmployeeId);
      return byCrew && byEmployee;
    });

  const markedDateKeys = new Set(
    filteredEvents
      .map((eventItem) => toDateKey(eventItem.start))
      .filter(Boolean)
  );

  const displayedMembers =
    selectedEmployeeId === "all"
      ? employees
      : employees.filter((e) => String(e.id) === String(selectedEmployeeId));

  const filteredUpcomingJobs = upcomingJobs.filter((job) =>
    selectedEmployeeId === "all" || String(job.employee_id) === String(selectedEmployeeId)
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCalendarViewChange = (viewValue) => {
    setCalendarView(viewValue);
    calendarRef.current?.getApi().changeView(viewValue);
  };

  const handleEventDrop = async (info) => {
    try {
      await scheduleService.updateDispatchEvent(info.event.id, {
        schedule_date: info.event.startStr.split("T")[0],
        start_time: info.event.startStr.split("T")[1]?.slice(0, 5),
        end_time: info.event.endStr?.split("T")[1]?.slice(0, 5),
      });
      fetchEvents();
    } catch {
      info.revert();
    }
  };

  const handleEventResize = async (info) => {
    try {
      await scheduleService.updateDispatchEvent(info.event.id, {
        end_time: info.event.endStr?.split("T")[1]?.slice(0, 5),
      });
      fetchEvents();
    } catch {
      info.revert();
    }
  };


  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId((prev) => (String(prev) === String(employeeId) ? "all" : employeeId));
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      {/* ── Filters & Legend Row ───────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        {/* Employee dropdown */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Employees</InputLabel>
          <Select
            value={selectedEmployeeId}
            label="Employees"
            onChange={(e) => handleEmployeeSelect(e.target.value)}
          >
            <MenuItem value="all">All Employees</MenuItem>
            {employees.map((employee) => {
              const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim() || "Unnamed";
              return (
                <MenuItem key={employee.id} value={String(employee.id)}>
                  {fullName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Teams dropdown */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Teams</InputLabel>
          <Select
            value={selectedCrewId}
            label="Teams"
            onChange={(e) => setSelectedCrewId(e.target.value)}
          >
            <MenuItem value="all">All Teams</MenuItem>
            {crews.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* View dropdown */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>View</InputLabel>
          <Select
            value={calendarView}
            label="View"
            onChange={(e) => handleCalendarViewChange(e.target.value)}
          >
            {VIEW_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Availability legend */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          {AVAILABILITY_LEGEND.map((item) => (
            <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* ── Three-column content grid ──────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "220px 1fr 270px",
          gap: 2,
          alignItems: "start",
          "@media (max-width: 1100px)": { gridTemplateColumns: "1fr 1fr" },
          "@media (max-width: 720px)": { gridTemplateColumns: "1fr" },
        }}
      >
        {/* ── Left: Crew Members Panel ─────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Crew Members
          </Typography>

          {loadingEmployees ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={18} />
                  <Skeleton variant="text" width="50%" height={14} />
                </Box>
              </Box>
            ))
          ) : displayedMembers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No employees found
            </Typography>
          ) : (
            displayedMembers.map((member, idx) => (
              <CrewMemberRow
                key={member.id ?? idx}
                member={member}
                index={idx}
                selected={String(selectedEmployeeId) === String(member.id)}
                onClick={() => handleEmployeeSelect(String(member.id))}
              />
            ))
          )}
        </Paper>

        {/* ── Center: FullCalendar ─────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            "& .fc": { fontFamily: "Poppins, sans-serif" },
            "& .fc-toolbar-title": { fontSize: "1rem", fontWeight: 600 },
            "& .fc-button": {
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.8rem",
            },
            "& .fc-event": { cursor: "pointer", borderRadius: "4px" },
            "& .fc-timegrid-slot": { height: "40px" },
            "& .fc-col-header-cell-cushion": { fontWeight: 500, fontSize: "0.8rem" },
            "& .fc-daygrid-day.has-schedule-mark .fc-daygrid-day-top": {
              position: "relative",
            },
            "& .fc-daygrid-day.has-schedule-mark .fc-daygrid-day-top::after": {
              content: '""',
              position: "absolute",
              left: 6,
              right: 6,
              bottom: -2,
              height: 3,
              borderRadius: 99,
              backgroundColor: "#0ea5e9",
              opacity: 0.9,
            },
          }}
        >
          {loadingEvents ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 600 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <Box sx={{ p: 1 }}>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
                events={filteredEvents}
                editable
                selectable
                eventResizableFromStart
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                dayCellClassNames={(arg) => {
                  const dateKey = arg.date.toISOString().slice(0, 10);
                  return markedDateKeys.has(dateKey) ? ["has-schedule-mark"] : [];
                }}
                select={() => {
                  if (onOpenModal) onOpenModal();
                }}
                height={600}
                allDaySlot={false}
                slotMinTime="06:00:00"
                slotMaxTime="21:00:00"
                nowIndicator
                weekends
              />
            </Box>
          )}
        </Paper>

        {/* ── Right: Upcoming Jobs ─────────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Upcoming Jobs
          </Typography>

          {loadingJobs ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f3f4f6" }}>
                <Skeleton variant="text" width="40%" height={14} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={14} />
              </Box>
            ))
          ) : filteredUpcomingJobs.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No upcoming jobs
            </Typography>
          ) : (
            filteredUpcomingJobs.map((job, idx) => (
              <UpcomingJobRow
                key={job.id ?? idx}
                job={job}
                isLast={idx === filteredUpcomingJobs.length - 1}
              />
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DispatchCalendarView;
