import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/course";

export const useCourse = () => {
  const courseStore = useCourseStore();
  const {
    currentCourseId,
    categoryOptions,
    tagList,
    courseInfo,
    courseAttachments,
    courseSections,
  } = storeToRefs(courseStore);

  return {
    currentCourseId,
    categoryOptions,
    tagList,
    courseInfo,
    courseAttachments,
    courseSections,
    getCategoryList: courseStore.fetchCategoryData,
    getTagList: courseStore.fetchTagList,
    getCourseOverview: courseStore.fetchCourseOverview,
    setCourseInfo: courseStore.setCourseInfo,
    setCourseId: courseStore.setCurrentCourseId,
  };
};
