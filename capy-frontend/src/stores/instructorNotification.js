import { getUnreadNotification, getNotificationList } from "@/api/teacher/notification";
import { defineStore } from "pinia";
export const useInstructorNotificationStore = defineStore("instructorNotification", () => {
  const temporary_list = ref([]);
  const typeToParams = {
    review: ["new_review"],
    platform: [
      "course_submitted_approved",
      "course_submitted_rejected",
      "course_restored",
      "platform_announcement",
      "new_enrollment",
    ],
    comment: ["new_question"],
    payout: ["payout_completed", "payout_failed"],
    other: [
      "instructor_application_approved",
      "instructor_application_rejected",
      "instructor_announcement",
    ],
  };
  const switchNotificationType = (type) => {
    //transcoding_failed,new_enrollment,user_suspended,user_unsuspended
    if (
      [
        "course_submitted_approved",
        "course_submitted_rejected",
        "course_restored",
        "platform_announcement",
        "new_enrollment",
      ].includes(type)
    ) {
      return "platform";
    } else if (["new_question"].includes(type)) {
      return "comment";
    } else if (["new_review"].includes(type)) {
      return "review";
    } else if (["payout_completed", "payout_failed"].includes(type)) {
      return "payout";
    } else if (
      [
        "instructor_application_approved",
        "instructor_application_rejected",
        "instructor_announcement",
      ].includes(type)
    ) {
      return "other";
    } else {
      return "unknown";
    }
  };
  const filterType = (list = [], target_type) => {
    if (list.value.length === 0) {
      return [];
    }

    return list.value.filter((item) => item.notificationType === target_type);
  };
  const filterNotificationType = (list) => {
    // console.log(list);
    return list
      .map((item) => {
        if (switchNotificationType(item.notificationType) !== "unknown") {
          return {
            ...item,
            notificationType: switchNotificationType(item.notificationType),
          };
        } else {
          return null;
        }
      })
      .filter((item) => item);
  };
  const filter_list = computed(() => {
    return filterNotificationType(temporary_list.value);
  });
  const currentParams = ref({ page: 0, types: "review" });
  const resultNotificationList = ref([]);
  const currentNotificationList = computed(() => {
    if (currentParams.value.page === 0) {
      return [
        ...filterType(filter_list, currentParams.value.type),
        ...resultNotificationList.value,
      ];
    }
    return resultNotificationList.value;
  });
  const temporary_commentNotification = computed(() => {
    return filterType(filter_list, "comment");
  });
  const temporary_platformNotification = computed(() => {
    return filterType(filter_list, "platform");
  });
  const temporary_reviewNotification = computed(() => {
    return filterType(filter_list, "review");
  });
  const temporary_payoutNotification = computed(() => {
    return filterType(filter_list, "payout");
  });
  const temporary_otherNotification = computed(() => {
    return filterType(filter_list, "other");
  });
  const DB_unreadList = ref([]);
  const DB_filter_list = computed(() => {
    const list = DB_unreadList.value.map((item) => {
      if (switchNotificationType(item.notificationType) !== "unknown") {
        return {
          ...item,
          notificationType: switchNotificationType(item.notificationType),
        };
      } else {
        return null;
      }
    });
    return list.filter((item) => item);
  });

  const DB_commentNotification = computed(() => {
    return filterType(DB_filter_list, "comment");
  });
  const DB_platformNotification = computed(() => {
    return filterType(DB_filter_list, "platform");
  });
  const DB_reviewNotification = computed(() => {
    return filterType(DB_filter_list, "review");
  });
  const DB_payoutNotification = computed(() => {
    return filterType(DB_filter_list, "payout");
  });
  const DB_otherNotification = computed(() => {
    return filterType(DB_filter_list, "other");
  });
  const comment_unread_count = computed(
    () => temporary_commentNotification.value.length + DB_commentNotification.value.length
  );
  const platform_unread_count = computed(
    () => temporary_platformNotification.value.length + DB_platformNotification.value.length
  );
  const review_unread_count = computed(
    () => temporary_reviewNotification.value.length + DB_reviewNotification.value.length
  );
  const payout_unread_count = computed(
    () => temporary_payoutNotification.value.length + DB_payoutNotification.value.length
  );
  const other_unread_count = computed(
    () => temporary_otherNotification.value.length + DB_otherNotification.value.length
  );
  const fetchUnreadNotifications = async () => {
    DB_unreadList.value = await getUnreadNotification();
    temporary_list.value = [];
  };
  const fetchNotificationList = async (params) => {
    const type = params.types;
    params.types = typeToParams[type] ? typeToParams[type] : [];
    // console.log(params);
    const res = await getNotificationList(params);
    resultNotificationList.value = filterNotificationType(res.content);
    await fetchUnreadNotifications();
    currentParams.value.types = type;
    currentParams.value.page = params.page;
    // console.log(res);
    return res;
  };
  const removeFromTemporary = (id) => {
    if (temporary_list.value.find((item) => item.id === id)) {
      temporary_list.value = temporary_list.value.filter((item) => item.id !== id);
    }
  };
  const removeFromDB = (id) => {
    if (DB_unreadList.value.find((item) => item.id === id)) {
      DB_unreadList.value = DB_unreadList.value.filter((item) => item.id !== id);
    }
  };
  return {
    temporary_list,
    DB_unreadList,
    resultNotificationList,
    currentNotificationList,
    comment_unread_count,
    platform_unread_count,
    review_unread_count,
    payout_unread_count,
    other_unread_count,
    fetchUnreadNotifications,
    fetchNotificationList,
    removeFromDB,
    removeFromTemporary,
  };
});
