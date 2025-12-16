import axios from "@/utils/http";
export const getCourseOptions = () => {
  return axios.get("/teacher/questions/course-list");
};
export const getQuestionList = (params) => {
  return axios.get("/teacher/questions", { params });
};
export const answerQuestion = (id, data) => {
  return axios.post(`/teacher/questions/${id}/answer`, data);
};
