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
        path: "coursedetail/:courseId",
        name: "coursedetail",
        component: () => import("@/views/teacher/CourseDetail/CourseDetail.vue"),
      },
      {
        path: "createcourse",
        name: "createcourse",
        component: () => import("@/views/teacher/CreateCourse/CreateCourse.vue"),
      },
      {
        path: "coursedata",
        name: "coursedata",
        component: () => import("@/views/teacher/DataStatics/CourseData.vue"),
      },
      {
        path: "notification",
        name: "notification",
        component: () => import("@/views/teacher/Notification/Notification.vue"),
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
