import { useCourseStore } from "@/stores/course";
import { useVideoStore } from "@/stores/video";
import { markAllFailed, markUploadComplete, markUploadFailed } from "@/api/teacher/video";
import axios from "axios";

export const useVideo = (videoAssetId) => {
  const videoStore = useVideoStore();
  const courseStore = useCourseStore();
  const allUploadingFailed = async () => {
    await markAllFailed(courseStore.currentCourseId);
  };
  const markFailed = async () => {
    await markUploadFailed(videoAssetId);
    ElMessage.success("影片上傳失敗");
  };
  const markComplete = async () => {
    await markUploadComplete(videoAssetId);
    ElMessage.success("影片上傳成功");
  };
  const isUploading = (lessonId) => {
    return videoStore.uploadingVideoList.find((item) => item.lessonId === lessonId) ? true : false;
  };
  const uploadVideoToGCP = async (initiateURL, file) => {
    const sessionURI = await getSessionURI(initiateURL);
    await uploadVideoChunks(sessionURI, file);
    videoStore.remove(videoAssetId);
    await courseStore.fetchCourseOverview();
  };
  const getSessionURI = async (initiateURL) => {
    const res = await axios.post(initiateURL, null, {
      headers: {
        "x-goog-resumable": "start",
      },
    });
    return res.headers.location;
  };
  const uploadVideoChunks = async (sessionURI, file) => {
    const CHUNK_SIZE = 5 * 1024 * 1024;
    const totalSize = file.size;
    let offset = 0;
    while (offset < totalSize) {
      const chunkEnd = Math.min(offset + CHUNK_SIZE, totalSize);
      const chunk = file.slice(offset, chunkEnd);
      const contentRange = `bytes ${offset}-${chunkEnd - 1}/${totalSize}`;
      console.log(1);
      const res = await axios.put(sessionURI, chunk, {
        headers: {
          // "Content-Length": chunk.size,
          "Content-Range": contentRange,
        },
        validateStatus: function (status) {
          // 接受 200, 201 (表示上傳完成) 和 308 (表示分塊成功)
          return (status >= 200 && status < 300) || status === 308;
        },
      });
      console.log(res);
      if (res.status === 308) {
        offset = chunkEnd;
        continue;
      }
      if (res.status === 200) {
        console.log("complete");
        await markComplete();
        break;
      }
      await markFailed();
      throw new Error("uploading error");
    }
  };
  return {
    allUploadingFailed,
    markFailed,
    markComplete,
    isUploading,
    uploadVideoToGCP,
  };
};
