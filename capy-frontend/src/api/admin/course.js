import axios from "@/utils/http";

// Get Parent Categories for filter
export const getParentCategories = () => {
  return axios.get("/admin/courses/applications/parent-categories");
};

// Course Applications (待審核上架申請)
export const getCourseApplications = (params) => {
  return axios.get("/admin/courses/applications", { params });
};

// Approve Course
export const approveCourse = (courseId) => {
  return axios.post(`/admin/courses/applications/${courseId}/course-approve`);
};

// Reject Course
export const rejectCourse = (courseId, reason) => {
  return axios.post(`/admin/courses/applications/${courseId}/course-reject`, reason, {
    headers: { "Content-Type": "application/json" },
  });
};

// List Approved Courses (已審核課程列表)
export const getApprovedCourses = (params) => {
  return axios.get("/admin/courses", { params });
};

// Get Course Overview
export const getCourseOverview = (courseId) => {
  return axios.get(`/admin/courses/${courseId}/overview`);
};

// Force Unpublish Course
export const forceUnpublishCourse = (courseId, reason) => {
  return axios.post(`/admin/courses/${courseId}/force-unpublish`, reason, {
    headers: { "Content-Type": "application/json" },
  });
};

// Restore Course
export const restoreCourse = (courseId, reason) => {
  return axios.post(`/admin/courses/${courseId}/restore`, reason, {
    headers: { "Content-Type": "application/json" },
  });
};

// Get Raw Signed URL for lesson video
export const getRawSignedUrl = (lessonId) => {
  return axios.get(`/admin/courses/lessons/${lessonId}/raw-signed-url`);
};

// Download Attachment
export const downloadAttachment = (attachmentId) => {
  return axios.get(`/admin/courses/attachments/${attachmentId}/download`, {
    responseType: "blob",
  });
};

// Get All Categories (with hierarchy)
export const getAllCategories = () => {
  return axios.get("/admin/courses/applications/all-categories");
};
