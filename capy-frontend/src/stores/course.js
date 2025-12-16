import { defineStore } from "pinia";
import {
  createCourse,
  getCategory,
  getCourseOverview,
  getTagList,
  updateCourseDetail,
  deleteCourse,
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
  const totalCourseDuration = computed(() => {
    return courseSections.value.reduce((sum, section) => {
      return (
        sum +
        section.lessons.reduce((sum, lesson) => {
          let lessonSeconds = lesson.lessonDurationSeconds;
          if (
            lesson.videoAssetStatus === "uploading" ||
            lesson.videoAssetStatus === "upload_failed"
          ) {
            lessonSeconds = 0;
          }
          return sum + lessonSeconds;
        }, 0)
      );
    }, 0);
  });
  const currentCourseCategory = computed(() => {
    let list = [];
    let children = [];
    for (let i = 0; i < courseInfo.value?.categories.length; i++) {
      if (i === 0) {
        const target = categoryList.value.find(
          (item) => item.id === courseInfo.value?.categories[i]
        );
        list.push(target);
        children = target.children;
      } else {
        const target = children.find((item) => item.id === courseInfo.value?.categories[i]);
        list.push(target);
        children = target.children;
      }
      // list.push(target);

      // children = target.children;
    }
    return list;
  });
  const currentCourseTag = computed(() => {
    return courseInfo.value?.tagIds.map((item) => ({
      id: item,
      name: tagList.value.find((tag) => tag.id === item)?.name,
    }));
  });
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
  const fetchDeleteCourse = async () => {
    if (!currentCourseId.value) {
      return;
    }
    try {
      await deleteCourse(currentCourseId.value);
    } catch (e) {
      ElMessage.error("刪除課程失敗");
    }
  };
  return {
    currentCourseId,
    currentCourseTag,
    currentCourseCategory,
    categoryList,
    categoryOptions,
    tagList,
    courseInfo,
    courseSections,
    courseAttachments,
    totalCourseDuration,
    fetchCategoryData,
    fetchTagListData,
    fetchCourseOverview,
    fetchDeleteCourse,
    setCourseInfo,
    setCurrentCourseId,
  };
});
