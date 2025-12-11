import axios from "@/utils/http";
export const getAttachment = (courseId) => {
  return axios.get(`/teacher/courses/${courseId}/attachments`);
};
export const deleteAttachment = (attachmentId) => {
  return axios.delete(`teacher/courses/${attachmentId}/delete-attachment`);
};
