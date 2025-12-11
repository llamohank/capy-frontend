 Admin 頁面檢查報告

  ---
  🟡 潛在問題


  2. UserManagement.vue:60 - 未導入 ElMessage

  ElMessage.error("取得用戶列表失敗");  // 但沒有 import
  問題: ElMessage 應該從 element-plus 導入，或確認是否全局註冊

  3. CourseManagement.vue:77 - 同樣未導入 ElMessage

  ElMessage.error("取得課程列表失敗");

  4. InstructorList.vue:54 - 同樣未導入 ElMessage

  ElMessage.error("取得教師申請列表失敗");

  5. ViewCourseDetail.vue:53 - 未導入 ElMessage 和 ElMessageBox

  ElMessage.error("取得課程資料失敗");
  ElMessageBox.confirm(...)

  ---
  🟢 優化建議


  3. WorkSpace.vue - 熱門課程的「查看」按鈕無功能

  <el-button link type="primary">查看</el-button>  // 沒有 @click
  建議: 加入點擊跳轉到課程詳情頁

  4. InstructorDetail.vue - 可優化錯誤處理

  // 當前
  } catch (error) {
    if (error !== "cancel") {
      ...
    }
  }

  // 建議 - 更明確的判斷
  } catch (error) {
    if (error === "cancel" || error?.message === "cancel") return;
    ...
  }

  5. API 服務一致性問題

  - course.js 有 getAllTags() 呼叫 /admin/tags
  - tag.js 有 listAllTags() 呼叫 /admin/tags

  建議: 統一使用一個，避免重複定義

