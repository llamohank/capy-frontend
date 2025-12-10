import axios from "@/utils/http";

// Get Instructor Applications List
export const getInstructorApplications = (params) => {
  return axios.get("/admin/instructors/applications", { params });
};

// Get Instructor Application Detail
export const getInstructorApplicationDetail = (applicationId) => {
  return axios.get(`/admin/instructors/applications/${applicationId}`);
};

// Get Application History
export const getApplicationHistory = (applicationId) => {
  return axios.get(`/admin/instructors/applications/${applicationId}/history`);
};

// Download Certificate
export const downloadCertificate = (certificateId) => {
  return axios.get(
    `/admin/instructors/applications/certificates/${certificateId}/download`,
    { responseType: "blob" }
  );
};

// Approve Instructor Application
export const approveInstructorApplication = (applicationId) => {
  return axios.post(
    `/admin/instructors/applications/${applicationId}/approve`
  );
};

// Reject Instructor Application
export const rejectInstructorApplication = (applicationId, rejectedReason) => {
  return axios.post(
    `/admin/instructors/applications/${applicationId}/reject`,
    JSON.stringify(rejectedReason),
    { headers: { "Content-Type": "application/json" } }
  );
};
