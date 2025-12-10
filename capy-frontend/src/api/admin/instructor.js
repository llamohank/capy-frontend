import axios from "@/utils/http";

// Get Instructor Applications List
export const getInstructorApplications = (params) => {
  return axios.get("/admin/instructors/applications", { params });
};
