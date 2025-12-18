<script setup>
import { getTeacherProfile, updateProfile } from "@/api/teacher/profile";
import { onUnmounted } from "vue";
const formModel = ref({
  instructorName: "",
  bio: "",
  bankCode: "",
  accountNumber: "",
  avatarUrl: "",
});
const isEdit = ref(false);
let defaultFormModel;
let isRequesting = false;
onMounted(async () => {
  try {
    const res = await getTeacherProfile();
    defaultFormModel = res;
    formModel.value = { ...res };
    formModel.value.avatarUrl = "";
    console.log(res);
  } catch (e) {
    console.log(e);
    ElMessage.error("載入失敗，請重新嘗試");
  }
});
const formRule = {
  instructorName: [
    { required: true, message: "教師名稱為必填項", trigger: "blur" },
    { max: 15, message: "教師名稱最多為15個字", trigger: "blur" },
  ],
  bio: [{ max: 300, message: "教師簡介最多為300個字", trigger: "blur" }],
};
const formRef = ref(null);
watch(
  formModel,
  (val) => {
    if (!verify(val)) {
      isEdit.value = true;
    } else {
      isEdit.value = false;
    }
  },
  { deep: true }
);
let currentAvatarFile;
const verify = (obj) => {
  for (let key in defaultFormModel) {
    if (obj[key] !== defaultFormModel[key]) {
      return false;
    }
  }
  return true;
};
const handleUpdateProfile = async () => {
  if (isRequesting) {
    ElMessage.warning("處理中，請稍後");
    return;
  }
  try {
    await formRef.value.validate();
  } catch (e) {
    console.log(e);
    ElMessage.error("表單驗證失敗");
    return;
  }
  if (!isEdit.value) {
    ElMessage.success("目前已是最新狀態");
    return;
  }
  try {
    isRequesting = true;
    const fd = new FormData();
    fd.append("instructorName", formModel.value.instructorName);
    fd.append("bio", formModel.value.bio);
    if (currentAvatarFile) {
      fd.append("avatar", currentAvatarFile);
    }

    const res = await updateProfile(fd);
    defaultFormModel = res;
    formModel.value = { ...res };
    ElMessage.success("更新成功");
  } catch (e) {
    console.log(e);
    ElMessage.error("更新失敗");
  } finally {
    formRef.value.clearValidate();
    isRequesting = false;
  }
};
const clearToDefault = () => {
  formRef.value.clearValidate();
  for (let key in defaultFormModel) {
    formModel.value[key] = defaultFormModel[key];
  }
  ElMessage.success("已取消更新");
  isEdit.value = false;
  currentAvatarFile = null;
};
const handleAvatarChange = ({ raw }) => {
  console.log(raw);
  const acceptType = ["image/jpeg", "image/png"];
  if (!acceptType.includes(raw.type)) {
    ElMessage.error("不支援的圖片格式!");
    return;
  } else if (raw.size / 1024 / 1024 > 5) {
    ElMessage.error("僅限上傳5MB以內的圖片檔!");
    return;
  }
  formModel.value.avatarUrl = URL.createObjectURL(raw);
  currentAvatarFile = raw;
};
onUnmounted(() => {
  if (!formModel.value.avatarUrl && formModel.value.avatarUrl !== defaultFormModel.avatarUrl) {
    URL.revokeObjectURL(formModel.value.avatarUrl);
  }
});
</script>
<template>
  <h2 class="section-heading">教師個人詳情</h2>
  <div class="wrapper">
    <div class="profile-wrapper">
      <div class="avatar-wrapper">
        <el-upload
          :on-change="handleAvatarChange"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
        >
          <img v-if="formModel.avatarUrl" :src="formModel.avatarUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </div>
      <!-- <el-row :gutter="12">
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">4.8</span>總評分</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">1200</span>學生總數</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">5</span>課堂總數</div></el-col
        >
        <el-col :span="6"
          ><div class="card-wrapper"><span class="data-text">350</span>則評價</div></el-col
        >
      </el-row> -->
      <div class="form-wrapper">
        <el-form
          status-icon
          require-asterisk-position="right"
          :rules="formRule"
          ref="formRef"
          scroll-to-
          size="large"
          :model="formModel"
          label-position="top"
        >
          <el-form-item label="教師名 :" prop="instructorName">
            <el-input style="width: auto" v-model.trim="formModel.instructorName" />
          </el-form-item>
          <el-form-item label="教師簡介 :" prop="bio">
            <el-input
              placeholder="請輸入300字以內的教師簡介"
              v-model.trim="formModel.bio"
              type="textarea"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="銀行帳號 :">
            <div style="display: flex; align-items: center; gap: 12px">
              {{ formModel.bankCode }}
              <el-icon><Minus /></el-icon>{{ formModel.accountNumber }}
            </div>
          </el-form-item>
          <el-form-item>
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: center;
                gap: 24px;
                margin-top: 36px;
              "
            >
              <el-button v-if="isEdit" @click="clearToDefault" size="large" type="info"
                >取消</el-button
              >
              <el-button @click="handleUpdateProfile" size="large" type="primary"
                >保存更新</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* :deep(div.el-col) { */
/* background-color: pink; */
/* border: 1px solid #d1d9e1;
  border-radius: 16px; */
/* height: auto !important; */
/* } */
.el-row {
  /* height: 88px; */
  height: auto;
}
.avatar-wrapper {
  display: flex;
  /* flex: 1; */
  width: 30%;
  justify-content: center;
  align-items: flex-start;
}
.profile-wrapper {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  /* flex-direction: column; */
  gap: 48px;
}
.form-wrapper {
  flex: 1;
}
.card-wrapper {
  border: 1px solid #d1d9e1;
  border-radius: 16px;
  padding: 24px;
  /* height: 100%; */
  text-align: center;
  /* font-size: 18px; */
  color: #667f99;
}
.form-label {
  font-size: 18px;
}
/* .data-text {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 8px;
  color: #667F99;
} */
.avatar {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 50%;
  border: 1px solid #667f99;
}
.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f3f5;
  /* border: 2px solid #adbbca; */
  /* box-shadow: ; */
  border-radius: 50%;
  width: 200px;
  min-height: 200px;
  /* width: 100%; */
  transition: "translateY" 2s;
}
.avatar-uploader:hover {
  cursor: pointer;
  transform: translateY(-2px);
}
.avatar-uploader-icon {
  font-size: 48px;
}
</style>
