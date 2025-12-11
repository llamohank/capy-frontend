import axios from "@/utils/http";

// 取得所有標籤
export const listAllTags = () => {
    return axios.get("/admin/tags");
};

// 新增標籤
export const createTag = (name) => {
    return axios.post("/admin/tags/create-tag", null, {
        params: { name },
    });
};

// 刪除標籤
export const deleteTag = (tagId) => {
    return axios.delete(`/admin/tags/${tagId}`);
};
