import axios from "@/utils/http";
export const getAnnouncementList = (params) => {
  return axios.get("/teacher/announcements", { params });
};
export const createAnnouncement = (data) => {
  return axios.post("/teacher/announcements", data);
};
