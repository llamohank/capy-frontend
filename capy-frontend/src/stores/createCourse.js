import { defineStore } from "pinia";
export const usecreateCourseStore = defineStore("createCourse", () => {
  const currentStep = ref(0);
  const currentCourseId = ref(null);
  const detailForm = ref({
    title: "",
    description: "",
    price: "",
    coverImage: "",
    cate: [],
    tags: [],
  });
  return {
    detailForm,
    currentStep,
    currentCourseId,
  };
});
