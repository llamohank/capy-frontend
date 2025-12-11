import axios from "@/utils/http";

// Search Users
export const searchUsers = (params) => {
  return axios.get("/admin/users/status/search", { params });
};

// List Users
export const listUsers = (params) => {
  return axios.get("/admin/users/status", { params });
};

// Suspend User
export const suspendUser = (userId, reason) => {
  return axios.post(`/admin/users/status/${userId}/suspend`, reason, {
    headers: { "Content-Type": "application/json" },
  });
};

// Unsuspend User
export const unsuspendUser = (userId, reason) => {
  return axios.post(`/admin/users/status/${userId}/unsuspend`, reason, {
    headers: { "Content-Type": "application/json" },
  });
};
