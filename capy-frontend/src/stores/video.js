import { defineStore } from "pinia";
export const useVideoStore = defineStore("videoStore", () => {
  const uploadingVideoList = ref([]);
  const append = (id) => {
    uploadingVideoList.value.push(id);
  };
  const remove = (videoAssetId) => {
    uploadingVideoList.value = uploadingVideoList.value.filter(
      (vid) => vid.videoAssetId !== videoAssetId
    );
  };
  return {
    uploadingVideoList,
    append,
    remove,
  };
});
