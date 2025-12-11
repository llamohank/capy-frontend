import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/course";
import { createSection, deleteSection, reorderSection, updateSection } from "@/api/teacher/course";
import { ElMessage } from "element-plus";
export const useSection = () => {
  const courseStore = useCourseStore();
  const { currentCourseId, courseSections } = storeToRefs(courseStore);
  //排序後的
  const sectionList = { ...courseSections.value };
  // console.log(sectionList);
  if (sectionList.length > 0) {
    sectionList?.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  const sortedSectionList = ref(sectionList);
  //id是section entity sectionId是overview的
  const sortedSectionIds = computed(() =>
    sortedSectionList.value?.map((section) => section.sectionId ?? section.id)
  );
  const addCourseSection = async (title) => {
    const data = {
      courseId: currentCourseId.value,
      title,
    };
    // const res = await createSection(data);
    await createSection(data);
    courseStore.fetchCourseOverview();
    // console.log("取得新增課程章節結果", res);
    // if (res) {
    //   courseSections.value.push(res);
    //   ElMessage.success("新增章節成功");
    // }
  };
  const updateCourseSection = async (sectionId, newTitle) => {
    await updateSection(sectionId, newTitle);
    //id是section entity sectionId是overview的
    courseSections.value.find((section) => section.id ?? section.sectionId === sectionId).title =
      newTitle;
    ElMessage.success("更新成功");
  };
  const deleteCourseSection = async (sectionId) => {
    const target = courseSections.value.find((section) => section.sectionId === sectionId);
    console.log(target);
    if (target) {
      if (target.lessons?.length > 0) {
        ElMessage.error("該章節下尚有單元影片");
        return;
      }
      await deleteSection(sectionId);
      //id是section entity sectionId是overview的
      courseSections.value = courseSections.value.filter(
        (section) => section.id ?? section.sectionId !== sectionId
      );
      ElMessage.success("刪除成功");
    }
  };
  const reorderCourseSection = async () => {
    await reorderSection(currentCourseId, sortedSectionIds.value);
    for (let i = 0; i < courseIds.length; i++) {
      //id是section entity sectionId是overview的
      courseSections.value.find(
        (section) => section.id ?? section.sectionId === courseIds[i]
      ).displayOrder = i;
    }
  };
  return {
    addCourseSection,
    updateCourseSection,
    deleteCourseSection,
    sortedSectionList,
    sortedSectionIds,
    reorderCourseSection,
  };
};
