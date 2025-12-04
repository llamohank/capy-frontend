export default [
  {
    path: "/admin",
    name: "adminLayout",
    component: () => import("@/views/admin/layout/AdminLayout.vue"),
    redirect: "/admin/workspace",
    children: [
      {
        path: "workspace",
        name: "adminWorkspace",
        component: () => import("@/views/admin/dashboard/WorkSpace.vue"),
      },
      {
        path: "instructorList",
        name: "instructor_application_list",
        component: () => import("@/views/admin/user/InstructorList.vue"),
      },
      {
        path: "instructorDetail/:instructorId",
        name: "instructor_detail",
        component: () => import("@/views/admin/user/InstructorDetail.vue"),
        props: (route) => ({
          instructorId: route.params.instructorId,
        }),
      },
      {
        path: "userManagement",
        name: "userManagement",
        component: () => import("@/views/admin/user/UserManagement.vue"),
      },
      {
        path: "courseList",
        name: "course_application_list",
        component: () => import("@/views/admin/course/ApplicationList.vue"),
      },
      {
        path: "viewCourseDetail/:courseId",
        name: "viewCourseDetail",
        component: () => import("@/views/admin/course/ViewCourseDetail.vue"),
        props: (route) => ({
          viewtype: route.query.viewtype,
        }),
      },
      {
        path: "courseManagement",
        name: "courseManagement",
        component: () => import("@/views/admin/course/CourseManagement.vue"),
      },
      {
        path: "announcement",
        name: "platform_announcement",
        component: () => import("@/views/admin/platform/Announcement.vue"),
      },
      {
        path: "categoryManagement",
        name: "category_management",
        component: () => import("@/views/admin/platform/PlatformManagement.vue"),
      },
      {
        path: "datastatic",
        name: "datastatic",
        component: () => import("@/views/admin/datastatic/DataStatic.vue"),
      },
      {
        path: "operationrecord",
        name: "operationrecord",
        component: () => import("@/views/admin/record/OperationRecord.vue"),
      },
    ],
  },
];
