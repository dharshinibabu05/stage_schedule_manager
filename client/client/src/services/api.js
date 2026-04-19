// ─── src/services/api.js ─────────────────────────────────────────────────────
// Drop this file in your React project at: src/services/api.js
// This replaces all localStorage usage with real API calls.

const BASE_URL = "https://stage-schedule-manager-backend.onrender.com/api";

// ─── Get stored token ─────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

// ─── Base fetch helper ────────────────────────────────────────────────────────
const request = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const registerUser = (userData) =>
  request("/auth/register", "POST", userData);

export const loginUser = (credentials) =>
  request("/auth/login", "POST", credentials);

export const getMe = () => request("/auth/me");

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const getEvents    = ()         => request("/events");
export const createEvent  = (data)     => request("/events", "POST", data);
export const updateEvent  = (id, data) => request(`/events/${id}`, "PUT", data);
export const deleteEvent  = (id)       => request(`/events/${id}`, "DELETE");

// ─── STAGES ───────────────────────────────────────────────────────────────────
export const getStages    = (eventId)  => request(`/stages${eventId ? `?eventId=${eventId}` : ""}`);
export const createStage  = (data)     => request("/stages", "POST", data);
export const updateStage  = (id, data) => request(`/stages/${id}`, "PUT", data);
export const deleteStage  = (id)       => request(`/stages/${id}`, "DELETE");

// ─── SCHEDULES ────────────────────────────────────────────────────────────────
export const getSchedules    = (eventId)  => request(`/schedules${eventId ? `?eventId=${eventId}` : ""}`);
export const createSchedule  = (data)     => request("/schedules", "POST", data);
export const updateSchedule  = (id, data) => request(`/schedules/${id}`, "PUT", data);
export const deleteSchedule  = (id)       => request(`/schedules/${id}`, "DELETE");

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const getTasks    = ()         => request("/tasks");
export const createTask  = (data)     => request("/tasks", "POST", data);
export const updateTask  = (id, data) => request(`/tasks/${id}`, "PUT", data);
export const deleteTask  = (id)       => request(`/tasks/${id}`, "DELETE");

// ─── USERS ────────────────────────────────────────────────────────────────────
export const getUsers   = (role) => request(`/users${role ? `?role=${role}` : ""}`);
export const deleteUser = (id)   => request(`/users/${id}`, "DELETE");