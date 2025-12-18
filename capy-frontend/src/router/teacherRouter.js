import { useVideo } from "@/composable/useVideo";
import { switchCourseStatus } from "@/hooks/useCourseSwitch";
import { useCourseStore } from "@/stores/course";
import { useInstructorNotificationStore } from "@/stores/instructorNotification";

// const { switchCourseStatus } = useCourseSwitch();

export default [
  {
    path: "/teacher",
    name: "teacherLayout",
    component: () => import("@/views/teacher/layout/TeacherLayout.vue"),
    redirect: "/teacher/workspace",
    children: [
      {
        path: "workspace",
        name: "teacherWorkspace",
        component: () => import("@/views/teacher/WorkSpace/WorkSpace.vue"),
      },
      {
        path: "mycourse",
        name: "mycourse",
        component: () => import("@/views/teacher/MyCourse/MyCourse.vue"),
      },
      {
        path: "coursedetail/:courseId/edit",
        name: "editcoursedetail",
        component: () => import("@/views/teacher/CourseDetail/EditCourseDetail.vue"),
        beforeEnter: async (to, from, next) => {
          const courseStore = useCourseStore();
          courseStore.setCurrentCourseId(to.params.courseId);
          courseStore.fetchCategoryData();
          courseStore.fetchTagListData();
          //取代查詢參數獲得課程狀態
          // const status =courseStore.courseInfo
          const status = switchCourseStatus(to.query.status);
          if (status !== "draft") {
            await courseStore.fetchCourseOverview();
            next({
              name: "coursedetail",
              params: {
                courseId: to.params.courseId,
              },
              query: {
                status,
              },
            });
          } else {
            const { allUploadingFailed } = useVideo();
            await allUploadingFailed();

            await courseStore.fetchCourseOverview();
            next();
          }
        },
      },
      {
        path: "coursedetail/:courseId/readonly",
        name: "coursedetail",
        component: () => import("@/views/teacher/CourseDetail/CourseDetailReadonly.vue"),
        props: (route) => ({ status: route.query?.status }),
        beforeEnter: async (to, from, next) => {
          const courseStore = useCourseStore();
          if (from.name !== "mycourse") {
            courseStore.setCurrentCourseId(to.params.courseId);
            await courseStore.fetchCategoryData();
            await courseStore.fetchTagListData();
            await courseStore.fetchCourseOverview();
          }
          // console.log(from);
          // console.log(5555555555);
          next();
        },
      },
      {
        path: "createcourse",
        name: "createcourse",
        component: () => import("@/views/teacher/CreateCourse/CreateCourse.vue"),
        beforeEnter: (to, from, next) => {
          const courseStore = useCourseStore();
          courseStore.setCurrentCourseId(null);
          courseStore.fetchCategoryData();
          courseStore.fetchTagListData();
          next();
        },
      },

      {
        path: "notification",
        name: "notification",
        component: () => import("@/views/teacher/Notification/Notification.vue"),
        beforeEnter: async () => {
          const instructorNotificationStore = useInstructorNotificationStore();
          await instructorNotificationStore.fetchUnreadNotifications();
        },
      },
      {
        path: "coursecomment",
        name: "coursecomment",
        component: () => import("@/views/teacher/CourseComment/CourseComment.vue"),
      },
      {
        path: "announcement",
        name: "announcement",
        component: () => import("@/views/teacher/Announcement/Announcement.vue"),
      },
      {
        path: "teacherprofile",
        name: "teacherprofile",
        component: () => import("@/views/teacher/TeacherProfile/TeacherProfile.vue"),
      },
    ],
  },
];
