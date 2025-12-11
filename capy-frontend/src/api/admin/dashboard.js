import axios from "@/utils/http";

// Dashboard
export const getDashboard = (todayStartEpochMillis, monthStartEpochMillis) => {
  return axios.get("/admin/dashboard", {
    params: { todayStartEpochMillis, monthStartEpochMillis },
  });
};

// Analysis - Revenue Trend
export const getRevenueTrend = (todayStartEpochMillis, zoneId, range) => {
  return axios.get("/admin/analysis/revenue-trend", {
    params: { todayStartEpochMillis, zoneId, range },
  });
};

// Analysis - Weekly User Trend
export const getWeeklyUserTrend = (monthStartEpochMillis) => {
  return axios.get("/admin/analysis/weekly-user-trend", {
    params: { monthStartEpochMillis },
  });
};

// Analysis - Weekly Course Published
export const getWeeklyCoursePublished = (todayStartEpochMillis, zoneId, range) => {
  return axios.get("/admin/analysis/weekly-course-published", {
    params: { todayStartEpochMillis, zoneId, range },
  });
};

// Analysis - Revenue Pie
export const getRevenuePie = () => {
  return axios.get("/admin/analysis/revenue-pie");
};

// Orders
export const getOrders = (params) => {
  return axios.get("/admin/orders", { params });
};
