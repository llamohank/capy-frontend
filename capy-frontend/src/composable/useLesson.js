import { useSection } from "./useSection";
import { deleteLesson, reorderLesson } from "@/api/teacher/course";
import { useCourseStore } from "@/stores/course";
const { updateCourseSection, deleteCourseSection } = useSection();
export const useLesson = (sectionInfo) => {
  const courseStore = useCourseStore();
  const currentSectionInfo = sectionInfo;

  const updateSection = async (title) => {
    await updateCourseSection(currentSectionInfo.sectionId, title);
  };
  const deleteSection = async () => {
    await deleteCourseSection(currentSectionInfo.sectionId);
  };
  const defaultLessonInfo = {
    lessonTitle: "",
    description: "",
    freePreview: false,
    attachments: [],
  };
  const deleteCourseLesson = async (lessonId) => {
    try {
      await ElMessageBox.confirm("即將刪除此單元影片!", "提醒", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      });
    } catch (e) {
      ElMessage.info("已取消刪除");
    }
    try {
      await deleteLesson(lessonId);
      ElMessage.success("刪除成功");
      await courseStore.fetchCourseOverview();
    } catch (e) {
      ElMessage.error("刪除失敗");
    }
  };
  const reorderCourseLesson = async (ids) => {
    try {
      await reorderLesson(currentSectionInfo.sectionId, { ids });
      ElMessage.success("單元影片順序更新!");
    } catch (e) {
      console.log(e);
      ElMessage.error("影片順序更新失敗!");
    } finally {
      try {
        await courseStore.fetchCourseOverview();
      } catch (e) {
        console.log(e);
      }
    }
  };
  return {
    currentSectionInfo,
    updateSection,
    deleteSection,
    defaultLessonInfo,
    deleteCourseLesson,
    reorderCourseLesson,
  };
};
