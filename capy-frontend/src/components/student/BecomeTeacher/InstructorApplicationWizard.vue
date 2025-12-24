<template>
  <div class="instructor-application-wizard">
    <!-- Steps Header -->
    <el-steps :active="activeStep" align-center finish-status="success" class="wizard-steps">
      <el-step title="教學資料" description="基本資訊" />
      <el-step title="證書文件" description="上傳證明" />
      <el-step title="確認送出" description="檢視資料" />
    </el-steps>

    <!-- Step Content -->
    <div class="wizard-content">
      <!-- Step 1: Teaching Profile -->
      <div v-show="activeStep === 0" class="step-container">
        <h2 class="step-title">教學資料</h2>
        <p class="step-description">請填寫您的基本資訊，這些資料將給審核員做審查。</p>

        <el-form
          ref="profileFormRef"
          :model="applicationForm"
          :rules="profileRules"
          label-width="120px"
          class="wizard-form"
        >
          <!-- 1. Identity Section -->
          <el-form-item label="姓名" prop="full_name">
            <el-input
              v-model="applicationForm.full_name"
              placeholder="請輸入您的真實姓名"
              maxlength="50"
              show-word-limit
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- 2. Professional Bio Section -->
          <el-form-item label="個人簡介" prop="resume">
            <el-input
              v-model="applicationForm.resume"
              type="textarea"
              :rows="6"
              placeholder="請介紹您的教學經驗、專業背景、教學理念等（建議至少 100 字）"
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>

          <!-- 3. Work Experience Section -->
          <el-divider content-position="left">
            <span class="section-title-student">工作經驗</span>
          </el-divider>

          <div class="work-experience-section">
            <div
              v-for="(experience, index) in applicationForm.work_experience"
              :key="index"
              class="experience-card"
            >
              <!-- Delete Button (Top-Right) -->
              <el-button
                :icon="Delete"
                @click="removeExperience(index)"
                type="danger"
                text
                class="delete-btn"
              >
                刪除
              </el-button>

              <!-- Experience Fields with Top Labels -->
              <div class="experience-fields">
                <!-- Row 1: Timeline -->
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item
                      label="開始日期"
                      :prop="'work_experience.' + index + '.start_date'"
                      :rules="[
                        { required: true, message: '請選擇開始日期', trigger: 'change' }
                      ]"
                      label-position="top"
                    >
                      <el-date-picker
                        v-model="experience.start_date"
                        type="month"
                        placeholder="選擇月份"
                        value-format="YYYY-MM"
                        style="width: 100%"
                        :disabled-date="disabledStartDate"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      label="結束日期"
                      :prop="'work_experience.' + index + '.end_date'"
                      :rules="[
                        { required: true, message: '請選擇結束日期', trigger: 'change' }
                      ]"
                      label-position="top"
                    >
                      <el-date-picker
                        v-model="experience.end_date"
                        type="month"
                        placeholder="選擇月份"
                        value-format="YYYY-MM"
                        style="width: 100%"
                        :disabled-date="(date) => disabledEndDate(date, experience.start_date)"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- Row 2: Role Details -->
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item
                      label="公司名稱"
                      :prop="'work_experience.' + index + '.company'"
                      :rules="[
                        { required: true, message: '請輸入公司名稱', trigger: 'blur' },
                        { max: 100, message: '公司名稱最多 100 字', trigger: 'blur' }
                      ]"
                      label-position="top"
                    >
                      <el-input
                        v-model="experience.company"
                        placeholder="請輸入公司名稱"
                        maxlength="100"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item
                      label="職位"
                      :prop="'work_experience.' + index + '.position'"
                      :rules="[
                        { required: true, message: '請輸入職位', trigger: 'blur' },
                        { max: 100, message: '職位名稱最多 100 字', trigger: 'blur' }
                      ]"
                      label-position="top"
                    >
                      <el-input
                        v-model="experience.position"
                        placeholder="請輸入職位"
                        maxlength="100"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>

            <el-button
              type="primary"
              :icon="Plus"
              @click="addExperience"
              class="add-experience-btn"
              plain
            >
              新增工作經驗
            </el-button>
          </div>

          <!-- 4. Financial Information Section (Bottom) -->
          <el-divider content-position="left">
            <span class="section-title-student">財務資訊</span>
          </el-divider>

          <el-alert
            title="重要提醒：銀行資訊送出後將無法修改，請務必確認正確"
            type="warning"
            :closable="false"
            show-icon
            class="bank-warning"
          />

          <el-form-item label="銀行代碼" prop="bank_code">
            <el-input
              v-model="applicationForm.bank_code"
              placeholder="請輸入 3 位數銀行代碼"
              maxlength="3"
              show-word-limit
            >
              <template #prefix>
                <el-icon><CreditCard /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="銀行帳號" prop="account_number">
            <el-input
              v-model="applicationForm.account_number"
              placeholder="請輸入您的銀行帳號"
              maxlength="20"
              show-word-limit
            >
              <template #prefix>
                <el-icon><Wallet /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <!-- Step 2: Documents Upload -->
      <div v-show="activeStep === 1" class="step-container">
        <h2 class="step-title">證書文件</h2>
        <p class="step-description">請上傳相關的教學證書、專業證照或學歷證明（最少 1 份，最多 5 份）。</p>

        <el-form
          ref="documentsFormRef"
          :model="applicationForm"
          :rules="documentsRules"
          class="wizard-form"
        >
          <el-form-item prop="files">
            <el-upload
              ref="uploadRef"
              v-model:file-list="applicationForm.files"
              class="upload-area"
              drag
              multiple
              :auto-upload="false"
              :limit="5"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              :before-upload="beforeFileUpload"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              :disabled="applicationForm.files.length >= 5"
            >
              <el-icon class="upload-icon"><UploadFilled /></el-icon>
              <div class="upload-text">
                <p class="upload-title">拖曳檔案至此或點擊上傳</p>
                <p class="upload-hint">支援 JPG、PNG、PDF、DOC、DOCX 格式，單檔最大 10MB</p>
              </div>
            </el-upload>

            <div v-if="applicationForm.files.length > 0" class="file-list">
              <div
                v-for="(file, index) in applicationForm.files"
                :key="index"
                class="file-item"
              >
                <el-icon class="file-icon"><Document /></el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.isExisting ? '已上傳' : formatFileSize(file.size) }}</span>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="handleRemoveFile(index)"
                />
              </div>
            </div>

            <div class="upload-stats">
              <el-tag :type="fileCountTagType">
                已上傳 {{ applicationForm.files.length }} / 5 份文件
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <!-- Step 3: Review & Submit -->
      <div v-show="activeStep === 2" class="step-container">
        <h2 class="step-title">確認資料</h2>
        <p class="step-description">請仔細檢查您的申請資料，確認無誤後即可送出申請。</p>

        <div class="review-section">
          <el-descriptions :column="1" border class="review-descriptions">
            <el-descriptions-item label="姓名">
              <span class="review-value">{{ applicationForm.full_name }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="銀行代碼">
              <span class="review-value">{{ applicationForm.bank_code }}</span>
              <el-tag type="warning" size="small" class="ml-2 bank-warning-tag">送出後無法修改</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="銀行帳號">
              <span class="review-value">{{ applicationForm.account_number }}</span>
              <el-tag type="warning" size="small" class="ml-2 bank-warning-tag">送出後無法修改</el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="個人簡介">
              <div class="review-bio-content">{{ applicationForm.resume }}</div>
            </el-descriptions-item>

            <el-descriptions-item label="工作經驗">
              <div v-if="applicationForm.work_experience.length === 0" class="no-experience">
                未填寫工作經驗
              </div>
              <div v-else class="experience-list">
                <div
                  v-for="(exp, index) in applicationForm.work_experience"
                  :key="index"
                  class="experience-review-item"
                >
                  <el-tag type="info" size="small">{{ index + 1 }}</el-tag>
                  <span class="exp-period">{{ exp.start_date }} ~ {{ exp.end_date }}</span>
                  <span class="exp-company">{{ exp.company }}</span>
                  <span class="exp-position">{{ exp.position }}</span>
                </div>
              </div>
            </el-descriptions-item>

            <el-descriptions-item label="證書文件">
              <div class="review-files">
                <el-tag
                  v-for="(file, index) in applicationForm.files"
                  :key="index"
                  type="success"
                  class="file-tag"
                >
                  <el-icon><Document /></el-icon>
                  <span>{{ file.name }}</span>
                </el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>

          <el-alert
            title="提交申請後，我們將在 3-5 個工作天內審核您的資料，審核結果將以電子郵件通知您。"
            type="info"
            :closable="false"
            show-icon
            class="submit-notice"
          />

          <el-checkbox v-model="isBankConfirmed" class="bank-confirmation-checkbox">
            我已確認銀行帳戶資訊正確，了解送出後無法自行修改
          </el-checkbox>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="wizard-footer">
      <el-button
        v-if="activeStep > 0"
        size="large"
        @click="handlePrevious"
        class="previous-button"
      >
        上一步
      </el-button>

      <el-button
        v-if="activeStep < 2"
        type="primary"
        size="large"
        @click="handleNext"
        class="next-button"
      >
        下一步
      </el-button>

      <el-button
        v-if="activeStep === 2"
        type="primary"
        size="large"
        :loading="submitting"
        :disabled="!isBankConfirmed"
        @click="handleSubmit"
        class="submit-button"
      >
        {{ submitting ? '正在上傳文件...' : (isResubmission ? '重新送出' : '送出申請') }}
      </el-button>
    </div>

    <!-- Custom Confirm Dialog -->
    <SubmitConfirmDialog
      ref="confirmDialogRef"
      @confirm="handleConfirmSubmit"
      @cancel="handleCancelSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  CreditCard,
  Wallet,
  UploadFilled,
  Document,
  Delete,
  Plus
} from '@element-plus/icons-vue'
import { becomeTeacher } from '@/api/student/becomTeacher.js'
import SubmitConfirmDialog from './SubmitConfirmDialog.vue'

// Props
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isResubmission: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['submit-success'])

// Refs
const router = useRouter()
const profileFormRef = ref(null)
const documentsFormRef = ref(null)
const uploadRef = ref(null)
const confirmDialogRef = ref(null)
const activeStep = ref(0)
const submitting = ref(false)
const isBankConfirmed = ref(false)

// Application Form Data
const applicationForm = ref({
  full_name: '',
  bank_code: '',
  account_number: '',
  resume: '',
  work_experience: [],
  files: []
})

// 初始化表單資料（用於 REJECTED 狀態的預填）
const initializeFormData = () => {
  if (props.initialData) {
    applicationForm.value = {
      full_name: props.initialData.full_name || '',
      bank_code: props.initialData.bank_code || '',
      account_number: props.initialData.account_number || '',
      resume: props.initialData.resume || '',
      work_experience: props.initialData.work_experience || [],
      files: props.initialData.certificates || []
    }
  }
}

// 監聽 initialData 變化
watch(() => props.initialData, (newData) => {
  if (newData) {
    initializeFormData()
  }
}, { immediate: true })

// 組件掛載時初始化
onMounted(() => {
  if (props.initialData) {
    initializeFormData()
  }
})

// Validation Rules - Step 1: Profile
const profileRules = {
  full_name: [
    { required: true, message: '請輸入您的姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名長度應在 2 到 50 個字元之間', trigger: 'blur' }
  ],
  bank_code: [
    { required: true, message: '請輸入銀行代碼', trigger: 'blur' },
    { pattern: /^\d{3}$/, message: '銀行代碼必須為 3 位數字', trigger: 'blur' }
  ],
  account_number: [
    { required: true, message: '請輸入銀行帳號', trigger: 'blur' },
    { min: 5, max: 20, message: '銀行帳號長度應在 5 到 20 個字元之間', trigger: 'blur' }
  ],
  resume: [
    { required: true, message: '請輸入個人簡介', trigger: 'blur' },
    { min: 100, max: 2000, message: '個人簡介建議至少 100 字，最多 2000 字', trigger: 'blur' }
  ]
}

// Validation Rules - Step 2: Documents
const documentsRules = {
  files: [
    {
      validator: (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('請至少上傳 1 份證書文件'))
        } else if (value.length > 5) {
          callback(new Error('最多只能上傳 5 份文件'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// Computed - File count tag type
const fileCountTagType = computed(() => {
  const count = applicationForm.value.files.length
  if (count === 0) return 'info'
  if (count >= 1 && count <= 3) return 'warning'
  return 'success'
})

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

// Before file upload validation
const beforeFileUpload = (file) => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    ElMessage.error(`檔案 ${file.name} 格式不支援，僅支援 JPG、PNG、PDF、DOC、DOCX`)
    return false
  }

  // Check file size (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(`檔案 ${file.name} 超過 10MB 限制`)
    return false
  }

  return true
}

// Handle file change
const handleFileChange = (file, fileList) => {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.raw.type)) {
    ElMessage.error(`檔案 ${file.name} 格式不支援，僅支援 JPG、PNG、PDF、DOC、DOCX`)
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    return
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error(`檔案 ${file.name} 超過 10MB 限制`)
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    return
  }

  applicationForm.value.files = fileList
}

// Handle file exceed limit
const handleExceed = () => {
  ElMessage.warning('最多只能上傳 5 份文件')
}

// Handle remove file
const handleRemoveFile = (index) => {
  applicationForm.value.files.splice(index, 1)
}

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Handle Next Step
const handleNext = async () => {
  try {
    if (activeStep.value === 0) {
      // Validate profile form
      await profileFormRef.value.validate()
      activeStep.value++
    } else if (activeStep.value === 1) {
      // Validate documents form
      await documentsFormRef.value.validate()
      activeStep.value++
    }
  } catch (error) {
    console.error('Validation failed:', error)
    ElMessage.error('請完整填寫所有必填欄位')
  }
}

// Handle Previous Step
const handlePrevious = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// Date picker validation - disable future dates for start date
const disabledStartDate = (date) => {
  return date.getTime() > Date.now()
}

// Date picker validation - disable dates before start date or after today
const disabledEndDate = (date, startDate) => {
  if (!startDate) {
    return date.getTime() > Date.now()
  }
  const start = new Date(startDate)
  return date.getTime() < start.getTime() || date.getTime() > Date.now()
}

// Handle Submit
const handleSubmit = () => {
  // Check bank confirmation
  if (!isBankConfirmed.value) {
    ElMessage.warning('請確認銀行帳戶資訊正確')
    return
  }

  // Show custom confirm dialog
  confirmDialogRef.value?.show()
}

// Handle Confirm Submit (after dialog confirmation)
const handleConfirmSubmit = async () => {
  try {
    submitting.value = true

    // Prepare application data
    const applicationData = {
      fullName: applicationForm.value.full_name,
      resume: applicationForm.value.resume, // 傳送個人簡介文字
      bankCode: applicationForm.value.bank_code,
      accountNumber: applicationForm.value.account_number,
      // 將工作經驗陣列的欄位名稱轉換為後端期待的 camelCase 格式
      workExperience: applicationForm.value.work_experience.map(exp => ({
        companyName: exp.company,    // company → companyName
        jobTitle: exp.position,      // position → jobTitle
        // 後端期待完整日期格式 yyyy-MM-dd（LocalDate），前端 date picker 回傳 yyyy-MM，需補上 -01
        startDate: exp.start_date ? `${exp.start_date}-01` : null,
        endDate: exp.end_date ? `${exp.end_date}-01` : null
      }))
    }

    // Prepare certificate files - 只提交新上傳的檔案（有 raw 屬性的）
    // 已存在的檔案（isExisting: true）不需要重新上傳
    const certificates = applicationForm.value.files
      .filter(file => !file.isExisting && file.raw)
      .map(file => file.raw)

    // Call API
    const response = await becomeTeacher(applicationData, certificates)

    // Success
    ElMessage.success('申請已送出！我們將在 3-5 個工作天內審核您的資料')

    // Reset form
    resetForm()

    // Redirect to success page or instructor landing
    setTimeout(() => {
      router.push('/instructor/landing')
    }, 1500)

  } catch (error) {
    console.error('Submit error:', error)
    ElMessage.error(error.message || '申請送出失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

// Handle Cancel Submit (dialog cancelled)
const handleCancelSubmit = () => {
  // Do nothing, just close the dialog
}

// Add work experience
const addExperience = () => {
  applicationForm.value.work_experience.push({
    start_date: '',
    end_date: '',
    company: '',
    position: ''
  })
}

// Remove work experience
const removeExperience = (index) => {
  applicationForm.value.work_experience.splice(index, 1)
}

// Reset form
const resetForm = () => {
  applicationForm.value = {
    full_name: '',
    bank_code: '',
    account_number: '',
    resume: '',
    work_experience: [],
    files: []
  }
  isBankConfirmed.value = false
  activeStep.value = 0
  profileFormRef.value?.clearValidate()
  documentsFormRef.value?.clearValidate()
}

// Expose methods for parent component
defineExpose({
  resetForm
})
</script>

<style scoped>
.instructor-application-confirm-dialog{
  width: 600px !important;
}
.instructor-application-wizard {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--capy-spacing-xl);
}

/* Steps */
.wizard-steps {
  margin-bottom: var(--capy-spacing-xxl);
}

.wizard-steps :deep(.el-step__title) {
  font-size: var(--capy-font-size-base);
  font-weight: var(--capy-font-weight-medium);
}

.wizard-steps :deep(.el-step__description) {
  font-size: var(--capy-font-size-sm);
}

.wizard-steps :deep(.el-step__head.is-finish) {
  color: var(--capy-primary);
  border-color: var(--capy-primary);
}

.wizard-steps :deep(.el-step__title.is-finish) {
  color: var(--capy-primary);
}

/* Content */
.wizard-content {
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  padding: var(--capy-spacing-xl);
  box-shadow: var(--capy-shadow-base);
  min-height: 500px;
}

.step-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-title {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-sm) 0;
}

.step-description {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  margin: 0 0 var(--capy-spacing-xl) 0;
}

/* Form */
.wizard-form {
  margin-top: var(--capy-spacing-lg);
}

.wizard-form :deep(.el-form-item__label) {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

.bank-warning {
  margin-top: var(--capy-spacing-sm);
}

/* Upload Area */
.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: var(--capy-spacing-xxl);
  border: 2px dashed var(--capy-border-base);
  border-radius: var(--capy-radius-lg);
  background-color: var(--capy-bg-base);
  transition: all var(--capy-transition-base);
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: var(--capy-primary);
  background-color: var(--el-color-primary-light-9);
}

.upload-area :deep(.el-upload.is-disabled .el-upload-dragger) {
  cursor: not-allowed;
  opacity: 0.6;
}

.upload-icon {
  font-size: 64px;
  color: var(--capy-primary);
  margin-bottom: var(--capy-spacing-md);
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-xs) 0;
}

.upload-hint {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  margin: 0;
}

/* File List */
.file-list {
  margin-top: var(--capy-spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-md);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.file-icon {
  font-size: 24px;
  color: var(--capy-primary);
}

.file-name {
  flex: 1;
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
}

.upload-stats {
  margin-top: var(--capy-spacing-md);
  text-align: center;
}

/* Review Section */
.review-section {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-lg);
}

.review-descriptions {
  margin-top: var(--capy-spacing-lg);
}

.review-descriptions :deep(.el-descriptions__label) {
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  width: 120px;
}

.review-value {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
}

.review-bio-content {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
  color: var(--capy-text-regular);
}

.bank-warning-tag {
  color: var(--el-color-warning-dark-2);
}

.review-files {
  display: flex;
  flex-wrap: wrap;
  gap: var(--capy-spacing-sm);
}

.file-tag {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
}

.ml-2 {
  margin-left: var(--capy-spacing-sm);
}

.submit-notice {
  margin-top: var(--capy-spacing-lg);
}

.bank-confirmation-checkbox {
  margin-top: var(--capy-spacing-lg);
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-primary);
  /* Force wrap and flexible height */
  white-space: normal;
  height: auto;
  align-items: flex-start; /* Align checkbox to top */
  padding: 8px 0;
}

.bank-confirmation-checkbox :deep(.el-checkbox__input) {
  margin-top: 2px; /* Slight adjustment for alignment */
}

.bank-confirmation-checkbox :deep(.el-checkbox__label) {
  color: var(--capy-text-primary);
  font-weight: var(--capy-font-weight-medium);
  line-height: 1.5;
}

/* Section Titles */
.section-title-student {
  font-size: var(--capy-font-size-lg);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-primary);
}

/* Work Experience Section */
.work-experience-section {
  margin-top: var(--capy-spacing-lg);
}

.experience-card {
  position: relative;
  margin-bottom: var(--capy-spacing-lg);
  padding: var(--capy-spacing-lg);
  background-color: var(--el-fill-color-lighter);
  border-radius: var(--capy-radius-lg);
  border: 1px solid var(--capy-border-light);
}

.experience-card:last-of-type {
  margin-bottom: var(--capy-spacing-md);
}

.experience-card .delete-btn {
  position: absolute;
  top: var(--capy-spacing-sm);
  right: var(--capy-spacing-sm);
  z-index: 1;
}

.experience-card .delete-btn:hover {
  color: var(--el-color-danger);
}

.experience-fields {
  width: 100%;
}

.experience-fields :deep(.el-form-item__label) {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-xs);
}

.add-experience-btn {
  width: 100%;
  border-color: var(--capy-primary);
  color: var(--capy-primary);
}

.add-experience-btn:hover {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--capy-primary);
  color: var(--capy-primary);
}

/* Review - Work Experience */
.no-experience {
  color: var(--capy-text-secondary);
  font-style: italic;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-sm);
}

.experience-review-item {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-sm);
  padding: var(--capy-spacing-sm);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-sm);
}

.exp-period {
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  min-width: 140px;
}

.exp-company {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
  flex: 1;
}

.exp-position {
  color: var(--capy-primary);
  font-size: var(--capy-font-size-sm);
}

/* Footer */
.wizard-footer {
  display: flex;
  justify-content: center;
  gap: var(--capy-spacing-md);
  margin-top: var(--capy-spacing-xl);
  padding-top: var(--capy-spacing-xl);
  border-top: 1px solid var(--capy-border-light);
}

.previous-button {
  background-color: #ffffff;
  border-color: var(--capy-border-base);
  color: var(--capy-text-primary);
  transition: all var(--capy-transition-base);
}

.previous-button:hover {
  border-color: var(--capy-primary-light-5);
  background-color: var(--el-color-primary-light-9);
  color: var(--capy-primary);
}

.next-button,
.submit-button {
  background-color: var(--capy-primary);
  border-color: var(--capy-primary);
  min-width: 120px;
}

.next-button:hover,
.submit-button:hover {
  background-color: var(--el-color-primary-light-1);
  border-color: var(--el-color-primary-light-1);
}

.next-button:active,
.submit-button:active {
  background-color: var(--el-color-primary-dark-1);
  border-color: var(--el-color-primary-dark-1);
}

/* Responsive */
@media (max-width: 768px) {
  .instructor-application-wizard {
    padding: var(--capy-spacing-md);
  }

  .wizard-content {
    padding: var(--capy-spacing-lg);
  }

  .wizard-steps {
    margin-bottom: var(--capy-spacing-lg);
  }

  .wizard-steps :deep(.el-step__title) {
    font-size: var(--capy-font-size-sm);
  }

  .wizard-steps :deep(.el-step__description) {
    display: none;
  }

  .step-title {
    font-size: var(--capy-font-size-xl);
  }

  /* Force labels to stack on top for mobile */
  .wizard-form :deep(.el-form-item) {
    display: block;
  }
  
  .wizard-form :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: 8px;
    justify-content: flex-start;
  }
  
  .wizard-form :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }

  /* Prevent delete button overlap on mobile */
  .experience-card {
    padding-top: 50px;
  }

  .review-descriptions :deep(.el-descriptions__label) {
    width: 100px;
  }

  .file-item {
    flex-wrap: wrap;
  }

  .wizard-footer {
    flex-direction: row; /* 保持水平排列 */
  }

  .wizard-footer .el-button {
    flex: 1; /* 按鈕平均分配寬度 */
    width: auto;
  }
}
</style>
