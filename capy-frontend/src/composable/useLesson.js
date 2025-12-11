import { useSection } from "./useSection";
import { deleteLesson } from "@/api/teacher/course";
const { updateCourseSection, deleteCourseSection } = useSection();
export const useLesson = (sectionInfo) => {
  const currentSectionInfo = sectionInfo;
  //pinia
  // const currentUploadingLesson = [];
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
    } catch (e) {
      ElMessage.error("刪除失敗");
    }
  };

  return {
    currentSectionInfo,
    updateSection,
    deleteSection,
    defaultLessonInfo,
  };
};
