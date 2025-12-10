import { useCourseStore } from "@/stores/course";
const defaultCourseInfo = {
  courseId: "",
  title: "",
  coverImageUrl: "",
  price: "",
  description: "",
  categories: [],
  tagIds: [],
};
const validateCategory = (rule, value, callback) => {
  if (value?.length < 1) {
    callback(new Error("課程分類為必填項"));
  } else if (value.length < 2) {
    callback(new Error("課程目錄需選擇所有級別"));
  } else {
    callback();
  }
};
const courseInfoRules = {
  title: [
    { required: true, message: "課程名稱為必填項", trigger: "blur" },
    { max: 15, message: "課程名稱最多為15個字", trigger: "blur" },
  ],
  coverImageUrl: [{ required: true, message: "課程封面為必需項", trigger: "change" }],
  price: [{ required: true, message: "課程價格為必填項", trigger: "blur" }],
  description: [
    { required: true, message: "課程介紹為必填項", trigger: "blur" },
    { min: 100, max: 250, message: "課程介紹需在100到250字之間", trigger: "blur" },
  ],
  categories: [{ validator: validateCategory, trigger: "change" }],
};
export const useCreateCourse = () => {
  const courseStore = useCourseStore();
  const setDefaultCourseInfo = () => {
    courseStore.setCourseInfo(defaultCourseInfo, true);
  };
  const formRef = ref(null);
  const validate = async () => {
    if (!formRef.value) return;
    await formRef.value.validate();
  };
  const reset = () => {
    if (!formRef.value) return;
    formRef.value.resetFields();
  };
  return {
    setDefaultCourseInfo,
    courseInfoRules,
    validate,
    reset,
    formRef,
  };
};
