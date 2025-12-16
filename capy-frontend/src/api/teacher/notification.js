import axios from "@/utils/http";
export const getUnreadNotification = () => {
  return axios.get("/notifications/unread");
};
export const getNotificationList = (params) => {
  return axios.get("/notifications", { params });
};
export const markAsRead = (id) => {
  return axios.put(`/notifications/${id}/read`);
};
export const markAllAsRead = () => {
  return axios.put("/notifications/read-all");
};
export const deleteNotification = (id) => {
  return axios.delete(`/notifications/${id}`);
};
