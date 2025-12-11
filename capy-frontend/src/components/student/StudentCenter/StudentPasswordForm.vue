<template>
  <div class="password-form-container">
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="100px"
      class="password-form"
    >
      <el-form-item label="目前密碼" prop="currentPassword">
        <el-input
          v-model="passwordForm.currentPassword"
          type="password"
          placeholder="請輸入目前密碼"
          show-password
          autocomplete="current-password"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="新密碼" prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="請輸入新密碼"
          show-password
          autocomplete="new-password"
          @input="checkPasswordStrength"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>

        <!-- Password Strength Meter -->
        <div v-if="passwordForm.newPassword" class="password-strength">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :class="`strength-${passwordStrength.level}`"
              :style="{ width: `${passwordStrength.percentage}%` }"
            ></div>
          </div>
          <div class="strength-text" :class="`strength-${passwordStrength.level}`">
            {{ passwordStrength.text }}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="確認密碼" prop="confirmPassword">
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="請再次輸入新密碼"
          show-password
          autocomplete="new-password"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- Password Requirements -->
      <div class="password-requirements">
        <div class="requirement-title">密碼需求：</div>
        <ul class="requirement-list">
          <li :class="{ valid: requirements.length }">
            <el-icon><CircleCheck v-if="requirements.length" /><CircleClose v-else /></el-icon>
            8-64 個字元
          </li>
          <li :class="{ valid: requirements.uppercase }">
            <el-icon><CircleCheck v-if="requirements.uppercase" /><CircleClose v-else /></el-icon>
            包含大寫字母
          </li>
          <li :class="{ valid: requirements.lowercase }">
            <el-icon><CircleCheck v-if="requirements.lowercase" /><CircleClose v-else /></el-icon>
            包含小寫字母
          </li>
          <li :class="{ valid: requirements.number }">
            <el-icon><CircleCheck v-if="requirements.number" /><CircleClose v-else /></el-icon>
            包含數字
          </li>
          <li :class="{ valid: requirements.specialChar }">
            <el-icon><CircleCheck v-if="requirements.specialChar" /><CircleClose v-else /></el-icon>
            包含特殊符號
          </li>
        </ul>
        <div class="password-hint">
          可使用字母、數字及特殊字元 !@#$%^&*()_+-={}[]:;"'&lt;&gt;,.?/
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Lock, CircleCheck, CircleClose } from '@element-plus/icons-vue'

// Emits
const emit = defineEmits(['submit'])

// Refs
const passwordFormRef = ref(null)

// Form Data
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password Requirements
const requirements = computed(() => ({
  length: passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length <= 64,
  uppercase: /[A-Z]/.test(passwordForm.newPassword),
  lowercase: /[a-z]/.test(passwordForm.newPassword),
  number: /[0-9]/.test(passwordForm.newPassword),
  specialChar: /[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]/.test(passwordForm.newPassword)
}))

// Password Strength
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return { level: 'none', percentage: 0, text: '' }

  let score = 0
  if (requirements.value.length) score += 20
  if (requirements.value.uppercase) score += 20
  if (requirements.value.lowercase) score += 20
  if (requirements.value.number) score += 20
  if (requirements.value.specialChar) score += 20

  if (score <= 40) {
    return { level: 'weak', percentage: 40, text: '弱' }
  } else if (score <= 60) {
    return { level: 'fair', percentage: 60, text: '普通' }
  } else if (score <= 80) {
    return { level: 'good', percentage: 80, text: '良好' }
  } else {
    return { level: 'strong', percentage: 100, text: '強' }
  }
})

// Validation Rules
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('請再次輸入新密碼'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('兩次輸入的密碼不一致'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('請輸入新密碼'))
  } else if (value === passwordForm.currentPassword) {
    callback(new Error('新密碼不能與目前密碼相同'))
  } else if (value.length < 8) {
    callback(new Error('密碼長度至少為 8 個字元'))
  } else if (value.length > 64) {
    callback(new Error('密碼長度不能超過 64 個字元'))
  } else if (!requirements.value.uppercase || !requirements.value.lowercase || !requirements.value.number) {
    callback(new Error('密碼必須包含大小寫字母和數字'))
  } else if (!requirements.value.specialChar) {
    callback(new Error('密碼必須包含至少一個特殊符號'))
  } else {
    // 驗證是否只包含允許的字元（字母、數字、特殊字元）
    const allowedCharsRegex = /^[A-Za-z\d!@#$%^&*()_+\-={}[\]:;"'<>,.?/]+$/
    if (!allowedCharsRegex.test(value)) {
      callback(new Error('密碼包含不允許的字元'))
    } else {
      callback()
    }
  }
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '請輸入目前密碼', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// Methods
const checkPasswordStrength = () => {
  // Trigger validation on confirm password when new password changes
  if (passwordForm.confirmPassword) {
    passwordFormRef.value?.validateField('confirmPassword')
  }
}

const validate = async () => {
  if (!passwordFormRef.value) return false
  try {
    await passwordFormRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

const resetForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.clearValidate()
}

const getFormData = () => {
  return {
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  }
}

// Expose methods to parent
defineExpose({
  validate,
  resetForm,
  getFormData
})
</script>

<style scoped>
.password-form-container {
  padding: var(--capy-spacing-md) 0;
}

.password-form {
  width: 100%;
}

.password-form :deep(.el-form-item__label) {
  font-weight: var(--capy-font-weight-medium);
  color: var(--capy-text-primary);
}

.password-form :deep(.el-input__prefix) {
  color: var(--capy-text-secondary);
}

/* Password Strength Meter */
.password-strength {
  margin-top: var(--capy-spacing-sm);
}

.strength-bar {
  height: 4px;
  background-color: var(--capy-border-light);
  border-radius: var(--capy-radius-sm);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all var(--capy-transition-base);
  border-radius: var(--capy-radius-sm);
}

.strength-fill.strength-weak {
  background-color: var(--el-color-danger);
}

.strength-fill.strength-fair {
  background-color: var(--el-color-warning);
}

.strength-fill.strength-good {
  background-color: var(--el-color-info);
}

.strength-fill.strength-strong {
  background-color: var(--el-color-success);
}

.strength-text {
  margin-top: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-medium);
}

.strength-text.strength-weak {
  color: var(--el-color-danger);
}

.strength-text.strength-fair {
  color: var(--el-color-warning);
}

.strength-text.strength-good {
  color: var(--el-color-info);
}

.strength-text.strength-strong {
  color: var(--el-color-success);
}

/* Password Requirements */
.password-requirements {
  margin-top: var(--capy-spacing-lg);
  padding: var(--capy-spacing-md);
  background-color: var(--capy-bg-base);
  border-radius: var(--capy-radius-md);
  border: 1px solid var(--capy-border-light);
}

.requirement-title {
  font-size: var(--capy-font-size-sm);
  font-weight: var(--capy-font-weight-semibold);
  color: var(--capy-text-primary);
  margin-bottom: var(--capy-spacing-sm);
}

.requirement-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--capy-spacing-xs);
}

.requirement-list li {
  display: flex;
  align-items: center;
  gap: var(--capy-spacing-xs);
  font-size: var(--capy-font-size-sm);
  color: var(--capy-text-secondary);
  transition: color var(--capy-transition-base);
}

.requirement-list li.valid {
  color: var(--el-color-success);
}

.requirement-list li .el-icon {
  font-size: 16px;
}

.password-hint {
  margin-top: var(--capy-spacing-sm);
  padding-top: var(--capy-spacing-sm);
  border-top: 1px solid var(--capy-border-light);
  font-size: var(--capy-font-size-xs);
  color: var(--capy-text-placeholder);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .password-form :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    margin-bottom: var(--capy-spacing-xs);
  }

  .password-form :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>
