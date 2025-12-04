import axios from "@/utils/http";
export const getCourseList = () => {
  return axios.get("/teacher/courses/courseList");
};
