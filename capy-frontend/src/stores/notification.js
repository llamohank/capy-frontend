import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ElNotification, ElMessage } from "element-plus";
import { useUserStore } from "./user";
import notificationSSEService from "@/utils/notificationSSE";
import * as notificationApi from "@/api/student/studentNotification";
import { useInstructorNotificationStore } from "./instructorNotification";

/**
 * 通知狀態管理 Store
 * 使用 Composition API 風格
 */
export const useNotificationStore = defineStore("notification", () => {
  // ===== State =====

  /**
   * 通知列表
   * 包含所有通知項目
   */
  /**
   * 通知列表
   */
  const notifications = ref([]);

  /**
   * 分頁資訊
   */
  const pagination = ref({
    totalElements: 0,
    totalPages: 0,
    size: 20,
    number: 0,
  });

  /**
   * 載入狀態
   */
  const loading = ref(false);

  /**
   * SSE 連線狀態
   */
  const isSSEConnected = ref(false);

  /**
   * SSE 連線狀態詳細資訊
   * 'disconnected' | 'connecting' | 'connected' | 'error'
   */
  const connectionState = ref("disconnected");

  // ===== Getters =====

  /**
   * 未讀通知數量（從後端 API 獲取）
   */
  const unreadCount = ref(0);

  /**
   * 未讀通知列表
   * 只包含未讀的通知
   */
  const unreadNotifications = computed(() => {
    return notifications.value.filter((n) => !n.isRead);
  });

  /**
   * 最近的未讀通知（用於 popover 顯示）
   * 限制顯示最新的 5 條未讀通知
   */
  const recentNotifications = computed(() => {
    return unreadNotifications.value.slice(0, 5);
  });
  const instructorNotificationStore = useInstructorNotificationStore();

  // ===== Actions =====

  /**
   * 標記所有通知為已讀
   */
  const markAllAsRead = async () => {
    // 記錄原始狀態以便回滾
    const originalStates = notifications.value.map((n) => ({
      id: n.id,
      isRead: n.isRead,
    }));

    // 先更新本地狀態（樂觀更新）
    notifications.value.forEach((notification) => {
      notification.isRead = true;
    });

    const originalUnreadCount = unreadCount.value;
    unreadCount.value = 0;

    try {
      await notificationApi.markAllStudentNotificationsAsRead();
      ElMessage.success("所有通知已標記為已讀");
    } catch (error) {
      console.error("標記所有通知為已讀失敗:", error);

      // 回滾本地狀態
      originalStates.forEach(({ id, isRead }) => {
        const notification = notifications.value.find((n) => n.id === id);
        if (notification) {
          notification.isRead = isRead;
        }
      });
      unreadCount.value = originalUnreadCount;

      ElMessage.error("標記已讀失敗");
    }
  };

  /**
   * 標記單個通知為已讀
   * @param {number} id - 通知 ID
   */
  const markAsRead = async (id) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (!notification) return;

    // 如果已經是已讀狀態，直接返回
    if (notification.isRead) return;

    // 先更新本地狀態（樂觀更新）
    const wasRead = notification.isRead;
    notification.isRead = true;

    // 更新未讀數量
    if (unreadCount.value > 0) {
      unreadCount.value--;
    }

    try {
      await notificationApi.markNotificationAsRead(id);
    } catch (error) {
      console.error(`標記通知 ${id} 為已讀失敗:`, error);
      // 如果 API 失敗，回滾本地狀態
      notification.isRead = wasRead;
      if (!wasRead) {
        unreadCount.value++;
      }
      ElMessage.error("標記已讀失敗");
    }
  };

  /**
   * 獲取通知列表（通用）
   * @param {Object} params - 查詢參數
   * @param {Array<string>} params.types - 通知類型篩選
   * @param {number} params.page - 頁碼
   * @param {number} params.size - 每頁數量
   * @param {boolean} params.append - 是否追加到現有列表（用於無限滾動）
   */
  const fetchNotifications = async (params = {}) => {
    const { append = false } = params;

    loading.value = true;

    try {
      const response = await notificationApi.getNotifications(params);

      if (append) {
        // 追加模式：用於無限滾動
        notifications.value = [...notifications.value, ...response.content];
      } else {
        // 替換模式：用於初始載入或重新整理
        notifications.value = response.content;
      }

      // 更新分頁資訊
      pagination.value = {
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
      };

      console.log(`✅ 已載入 ${response.content.length} 個通知`);
    } catch (error) {
      console.error("獲取通知列表失敗:", error);
      ElMessage.error("載入通知失敗");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 獲取學生通知列表
   * @param {Object} params - 查詢參數
   * @param {string} params.announcementType - 公告類型篩選（platform / instructor / other / 未填=全部）
   * @param {number} params.page - 頁碼
   * @param {number} params.size - 每頁數量
   * @param {boolean} params.append - 是否追加到現有列表（用於無限滾動）
   */
  const fetchStudentNotifications = async (params = {}) => {
    const { append = false } = params;

    loading.value = true;

    try {
      const response = await notificationApi.getStudentNotifications(params);

      if (append) {
        // 追加模式：用於無限滾動
        notifications.value = [...notifications.value, ...response.content];
      } else {
        // 替換模式：用於初始載入或重新整理
        notifications.value = response.content;
      }

      // 更新分頁資訊
      pagination.value = {
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.first,
        last: response.last,
      };

      console.log(`✅ 已載入 ${response.content.length} 個學生通知`);
    } catch (error) {
      console.error("獲取學生通知列表失敗:", error);
      ElMessage.error("載入通知失敗");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 獲取未讀通知數量
   */
  const fetchUnreadCount = async () => {
    try {
      const count = await notificationApi.getStudentUnreadCount();
      unreadCount.value = count;

      // 同步更新 user store 的通知數量
      const userStore = useUserStore();
      userStore.notifyQuantity = count;
    } catch (error) {
      console.error("獲取未讀通知數量失敗:", error);
      // 靜默失敗，不影響使用者體驗
    }
  };

  /**
   * 刪除通知
   * @param {number} id - 通知 ID
   */
  const deleteNotification = async (id) => {
    try {
      await notificationApi.deleteNotification(id);

      // 從本地列表中移除
      const index = notifications.value.findIndex((n) => n.id === id);
      if (index !== -1) {
        const notification = notifications.value[index];
        notifications.value.splice(index, 1);

        // 如果刪除的是未讀通知，更新未讀數量
        if (!notification.isRead && unreadCount.value > 0) {
          unreadCount.value--;
        }
      }

      ElMessage.success("通知已刪除");
    } catch (error) {
      console.error(`刪除通知 ${id} 失敗:`, error);
      ElMessage.error("刪除通知失敗");
      throw error;
    }
  };

  /**
   * 添加新通知（用於即時通知）
   * @param {Object} notification - 通知物件
   */
  const addNotification = (notification) => {
    // 檢查通知是否已存在（避免重複）
    const exists = notifications.value.some((n) => n.id === notification.id);
    if (!exists) {
      notifications.value.unshift(notification);
      instructorNotificationStore.temporary_list.unshift(notification);
      console.log("✅ 新通知已添加到列表:", notification.title);
    }
  };

  /**
   * 啟動 SSE 連線
   * 開始接收即時通知
   */
  const startSSE = () => {
    // 檢查 SSE 服務本身的連線狀態，而不是 store 的狀態
    const actualState = notificationSSEService.getConnectionState();
    const isActuallyConnected = notificationSSEService.isConnected();

    console.log('🔍 startSSE 檢查:', {
      storeConnected: isSSEConnected.value,
      actualState: actualState,
      isActuallyConnected: isActuallyConnected
    });

    // 如果實際連線是活躍的，就不需要重新連線
    if (isActuallyConnected) {
      console.log("✅ SSE 連線已存在且活躍");
      // 同步 store 狀態
      isSSEConnected.value = true;
      connectionState.value = actualState;
      return;
    }

    // 如果 store 認為已連線但實際沒有，重置狀態
    if (isSSEConnected.value && !isActuallyConnected) {
      console.log("🔄 重置不一致的連線狀態");
      isSSEConnected.value = false;
      connectionState.value = "disconnected";
    }

    console.log("🚀 開始建立 SSE 連線...");
    notificationSSEService.connect(
      // 收到新通知時的回調
      (notification) => {
        console.log("📬 Store 收到新通知:", notification);

        // 添加到通知列表（會自動檢查重複）
        addNotification(notification);

        // 顯示通知提示
        showNotificationToast(notification);

        // 同步更新未讀數量
        unreadCount.value++;
        console.log("📊 未讀數量更新:", unreadCount.value);

        // 更新用戶 store 的通知數量
        const userStore = useUserStore();
        if (userStore.notifyQuantity !== undefined) {
          userStore.notifyQuantity++;
          console.log("📊 用戶 store 通知數量更新:", userStore.notifyQuantity);
        }

        // 更新分頁資訊中的總數量
        if (pagination.value.totalElements !== undefined) {
          pagination.value.totalElements++;
        }
      },
      // 錯誤回調
      (error) => {
        console.error("SSE 連線錯誤:", error);
        isSSEConnected.value = false;
        connectionState.value = "error";

        // 根據錯誤類型顯示不同訊息
        if (error.type === "max_retries_reached") {
          // 達到最大重連次數
          ElMessage({
            message: "通知連線失敗，請重新整理頁面",
            type: "warning",
            duration: 0, // 不自動關閉
            showClose: true,
          });
        } else if (error.type === "connection_error") {
          // 一般連線錯誤（會自動重連，不需要顯示訊息）
          console.log("連線錯誤，系統將自動重試...");
        } else if (error.type === "auth_error") {
          ElMessage.error("通知連線失敗，請重新登入");
          // 可以在這裡觸發登出或重新導向到登入頁面
          // 例如: router.push('/login')
        } else {
          // 其他錯誤
          console.error("未知的 SSE 錯誤:", error);
        }
      },
      // 連線狀態變更回調
      (state) => {
        connectionState.value = state;
        console.log("連線狀態更新:", state);
      }
    );

    isSSEConnected.value = true;
    connectionState.value = notificationSSEService.getConnectionState();
    console.log("SSE 通知服務已啟動");
  };

  /**
   * 停止 SSE 連線
   */
  const stopSSE = () => {
    notificationSSEService.disconnect();
    isSSEConnected.value = false;
    connectionState.value = "disconnected";
    console.log("SSE 通知服務已停止");
  };

  /**
   * 顯示通知提示（桌面通知）
   * @param {Object} notification - 通知物件
   */
  const showNotificationToast = (notification) => {
    // 根據通知類型決定提示類型
    let notificationType = "info";

    if (notification.notification_type) {
      const type = notification.notification_type;

      if (["account_suspended", "course_force_unpublished"].includes(type)) {
        notificationType = "error";
      } else if (["account_restored", "instructor_application_approved"].includes(type)) {
        notificationType = "success";
      } else if (["transcoding_failed", "payout_failed"].includes(type)) {
        notificationType = "warning";
      }
    }

    ElNotification({
      title: notification.title || "新通知",
      message: notification.content || "",
      type: notificationType,
      duration: 5000,
      position: "top-right",
      onClick: () => {
        // 點擊通知後標記為已讀
        markAsRead(notification.id);
      },
    });
  };

  return {
    // State
    notifications,
    pagination,
    loading,
    unreadCount,

    // Getters
    unreadNotifications,
    recentNotifications,

    // Actions
    fetchNotifications,
    fetchStudentNotifications,
    fetchUnreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    addNotification,

    // SSE 相關
    isSSEConnected,
    connectionState,
    startSSE,
    stopSSE,
  };
});
