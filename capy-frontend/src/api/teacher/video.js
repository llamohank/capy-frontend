import axios from "@/utils/http";
export const getVideoUrl = (lessonId) => {
  return axios.get(`/teacher/videos/lessons/${lessonId}/raw-signed-url`);
};
