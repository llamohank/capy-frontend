import axios from "@/utils/http";
export const getVideoUrl = (lessonId) => {
  return axios.get(`/teacher/videos/lessons/${lessonId}/raw-signed-url`);
};
export const markUploadComplete = (videoAssetId) => {
  return axios.post(`/teacher/videos/${videoAssetId}/upload-complete`);
};
export const markUploadFailed = (videoAssetId) => {
  return axios.post(`/teacher/videos/${videoAssetId}/upload-failed`);
};
export const markAllFailed = (courseId) => {
  return axios.post(`/teacher/videos/${courseId}/mark-uploading-failed`);
};
