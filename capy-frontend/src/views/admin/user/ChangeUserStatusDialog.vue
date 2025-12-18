<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { suspendUser, unsuspendUser } from "@/api/admin/user";

const visible = ref(false);
const operationDetail = ref("");
const loading = ref(false);
let resolveFn = null;
const defaultUser = { isActive: false, nickname: "", userId: null };
let currentUserdetail = { ...defaultUser };

function open(userdetail, resolve) {
  visible.value = true;
  currentUserdetail = userdetail || { ...defaultUser }; // user物件
  resolveFn = resolve;
  operationDetail.value = ""; // 重置備註
}

async function confirm() {
  // 驗證備註是否填寫
  if (!operationDetail.value.trim()) {
    ElMessage.warning("請輸入操作備註");
    return;
  }

  try {
    loading.value = true;
    
    if (currentUserdetail.isActive) {
      // 當前是 active，要停權
      await suspendUser(currentUserdetail.userId, operationDetail.value);
      ElMessage.success("用戶已停權");
    } else {
      // 當前是 suspended，要恢復
      await unsuspendUser(currentUserdetail.userId, operationDetail.value);
      ElMessage.success("用戶已恢復");
    }
    
    visible.value = false;
    operationDetail.value = "";
    resolveFn(true);
  } catch (error) {
    console.error("操作失敗:", error);
    ElMessage.error(error?.response?.data?.message || "操作失敗，請稍後再試");
    resolveFn(false);
  } finally {
    loading.value = false;
  }
}

function cancel() {
  visible.value = false;
  currentUserdetail = { ...defaultUser };
  resolveFn(false); // switch 不切換
}

defineExpose({
  open,
});
</script>
<template>
  <el-dialog v-model="visible" width="500">
    <template #header>
      <h4 class="admin-dialog-heading">
        {{ currentUserdetail.isActive ? "禁用此用戶" : "恢復此用戶" }}
      </h4>
    </template>
    <div class="admin-dialog-body">
      <p style="margin-bottom: 36px">
        確認{{ currentUserdetail.isActive ? "禁用用戶" : "恢復用戶" }}
        <span class="admin-dialog-username">{{ currentUserdetail?.nickname }}</span
        >?
      </p>
      <el-input
        v-model="operationDetail"
        placeholder="輸入操作備註(必填) :"
        :rows="5"
        style="width: 90%"
        type="textarea"
      />
    </div>
    <template #footer>
      <div class="admin-dialog-footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirm"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
/* Page-specific styles - uses shared admin-dialog-* classes */
</style>

