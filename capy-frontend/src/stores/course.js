import { defineStore } from "pinia";
import {
  createCourse,
  getCategory,
  getCourseOverview,
  getTagList,
  updateCourseDetail,
} from "@/api/teacher/course";
export const useCourseStore = defineStore("course", () => {
  const currentCourseId = ref(null);
  const categoryList = ref([]);
  const categoryOptions = computed(() => {
    return categoryList.value?.map((item) => ({
      value: item.id,
      label: item.name,
      children: item.children?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    }));
  });
  const tagList = ref([]);
  const courseInfo = ref(null);
  const courseSections = ref([]);
  const courseAttachments = ref([]);
  const fetchCategoryData = async () => {
    const res = await getCategory();
    categoryList.value = res;
    // console.log(res);
  };
  const fetchTagListData = async () => {
    const res = await getTagList();
    tagList.value = res;
    // console.log(res);
  };
  const fetchCourseOverview = async () => {
    if (!currentCourseId.value) return;
    const res = await getCourseOverview(currentCourseId.value);
    courseInfo.value = res.course;
    courseSections.value = res.sections;
    courseAttachments.value = res.attachments;
    console.log(res);
  };
  const setCourseInfo = async (data, clear) => {
    if (clear) {
      courseInfo.value = data;
      return;
    }
    const res = currentCourseId.value ? await updateCourseDetail(data) : await createCourse(data);
    currentCourseId.value = res;
    await fetchCourseOverview();
    console.log("setcourseinfo");
  };
  const setCurrentCourseId = (id) => {
    if (!id) {
      courseSections.value = [];
      courseAttachments.value = [];
    }
    currentCourseId.value = id;
  };
  return {
    currentCourseId,
    categoryList,
    categoryOptions,
    tagList,
    courseInfo,
    courseSections,
    courseAttachments,
    fetchCategoryData,
    fetchTagListData,
    fetchCourseOverview,
    setCourseInfo,
    setCurrentCourseId,
  };
});
