import axios from "@/utils/http";
export const getTeacherProfile = () => {
  return axios.get("/teacher/profile");
};
export const updateProfile = (fd) => {
  return axios.put("/teacher/profile", fd);
};
export const getDashboardData = (time) => {
  return axios.get("/teacher/dashboard", {
    params: {
      todayStartEpochMillis: time,
    },
  });
};
