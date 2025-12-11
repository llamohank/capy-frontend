import axios from "@/utils/http";
//course
export const getCourseList = () => {
  return axios.get("/teacher/courses/course-list");
};
export const getCategory = () => {
  return axios.get("/teacher/courses/categories");
};
export const getTagList = () => {
  return axios.get("/teacher/courses/tags");
};
export const createCourse = (data) => {
  return axios.post("/teacher/courses/create-update-course", data);
};
export const updateCourseDetail = (data) => {
  return axios.post("/teacher/courses/create-update-course", data);
};
export const getCourseOverview = (id) => {
  return axios.get(`teacher/courses/${id}/overview`);
};
//section
export const createSection = (data) => {
  return axios.post("/teacher/courses/add-section", data);
};
export const updateSection = (id, newTitle) => {
  return axios.post(`/teacher/courses/${id}/update-section`, null, { params: { newTitle } });
};
export const deleteSection = (id) => {
  return axios.delete(`/teacher/courses/${id}/delete-section`);
};
export const reorderSection = (id, data) => {
  return axios.post(`/teacher/courses/${id}/sections/reorder`, data);
};
//lesson
export const createLesson = (data) => {
  return axios.post("teacher/videos/create-update-lesson", data);
};
export const updateLesson = (data) => {
  return axios.post("teacher/videos/create-update-lesson", data);
};
export const deleteLesson = (lessonId) => {
  return axios.delete(`/teacher/courses/${lessonId}/delete-lesson`);
};
