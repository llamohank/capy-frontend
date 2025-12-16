import axios from "axios";
import { getAttachment, deleteAttachment } from "@/api/teacher/attachment";
import { useCourseStore } from "@/stores/course";

export const useAttachment = (attachmentId) => {
  const courseStore = useCourseStore();
  const targetId = attachmentId;
  const decodeRFC2047 = (value) => {
    const m = value.match(/=\?([^?]+)\?([BQbq])\?([^?]+)\?=/);
    if (!m) return value;

    const [, charset, enc, text] = m;
    const td = new TextDecoder(charset.toLowerCase());
    if (enc.toUpperCase() === "B") {
      const bytes = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
      return td.decode(bytes);
    }
    // Q-encoding: _ 表空白，=XX 是 hex
    const decoded = text
      .replace(/_/g, " ")
      .replace(/=([0-9A-F]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
    return td.decode(Uint8Array.from(decoded, (c) => c.charCodeAt(0)));
  };

  const getFilename = (cd) => {
    const m = cd?.match(/filename\*?=(.+)$/i);
    if (!m) return "download";
    const raw = m[1].trim().replace(/(^"|"$)/g, "");
    return decodeRFC2047(raw);
  };
  const download = async () => {
    console.log(targetId);
    // return
    try {
      const res = await axios.get(
        `http://localhost:8080/api/teacher/videos/attachments/${targetId}/download`,
        {
          responseType: "blob",
          withCredentials: true,
          timeout: 10 * 1000,
        }
      );
      if (res.status === 200) {
        const contentDisposition = res.headers["content-disposition"];
        let filename = "download_file";
        if (contentDisposition) {
          filename = getFilename(contentDisposition);
        }
        const fileURL = window.URL.createObjectURL(res.data);
        const fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", filename);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
        window.URL.revokeObjectURL(fileURL);
        ElMessage.success("下載成功");
      } else {
        ElMessage.error("下載失敗");
      }
    } catch (e) {
      console.log(e);
      ElMessage.error("下載失敗");
    }
  };
  const getList = async () => {
    await getAttachment(courseStore.currentCourseId);
  };
  const deleteFile = async () => {
    try {
      await deleteAttachment(targetId);
      ElMessage({
        type: "success",
        message: "刪除成功",
      });
      await courseStore.fetchCourseOverview();
    } catch (e) {
      console.log(e);
      ElMessage({
        type: "error",
        message: "刪除附件失敗",
      });
    }
  };
  return {
    download,
    getList,
    deleteFile,
  };
};
