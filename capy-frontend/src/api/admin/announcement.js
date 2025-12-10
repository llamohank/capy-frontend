import axios from "@/utils/http";

// 取得公告列表
export const listAnnouncements = (params) => {
    return axios.get("/admin/announcements", { params });
};

// 發布公告
export const createAnnouncement = (data) => {
    return axios.post("/admin/announcements", data);
};
