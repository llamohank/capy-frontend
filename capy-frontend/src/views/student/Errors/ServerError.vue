<template>
  <div class="server-error-page">
    <div class="server-error-container">
      <!-- 500 水豚插圖 -->
      <div class="illustration-wrapper">
        <img
          src="@/assets/images/error/500-capy.svg"
          alt="500 - 伺服器錯誤"
          class="capy-illustration"
        />
      </div>

      <!-- 錯誤內容卡片 -->
      <div class="error-card">
        <!-- 500 錯誤代碼 -->
        <div class="error-code">500</div>

        <!-- 標題 -->
        <h1 class="error-title">伺服器正在休息</h1>

        <!-- 描述 -->
        <p class="error-description">
          我們的工程師水豚正在搶修管線中，可能是不小心踢到了插頭。<br>
          請稍後再試，或聯絡客服人員。
        </p>

        <!-- 操作按鈕 -->
        <div class="error-actions">
          <el-button
            type="primary"
            size="large"
            @click="handleRefresh"
          >
            <el-icon class="button-icon">
              <Refresh />
            </el-icon>
            重新整理
          </el-button>

          <el-button
            text
            size="large"
            @click="handleContactSupport"
          >
            <el-icon class="button-icon">
              <Service />
            </el-icon>
            聯絡客服
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Refresh, Service } from '@element-plus/icons-vue'

/**
 * 重新整理頁面
 */
const handleRefresh = () => {
  window.location.reload()
}

/**
 * 聯絡客服
 */
const handleContactSupport = () => {
  // 可以改為實際的客服頁面路徑或客服系統
  window.location.href = 'mailto:support@capycourse.com'
}
</script>

<style scoped>
/* 主容器 - 使用專案背景色 */
.server-error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--capy-bg-base);
  padding: var(--capy-spacing-lg);
}

.server-error-container {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--capy-spacing-xl);
}

/* 插圖容器 */
.illustration-wrapper {
  width: 100%;
  max-width: 400px;
  animation: shake 0.5s ease-in-out infinite alternate;
}

.capy-illustration {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(var(--capy-shadow-md));
}

/* 抖動動畫 - 模擬故障效果 */
@keyframes shake {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(-2px) rotate(-0.5deg);
  }
  75% {
    transform: translateX(2px) rotate(0.5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

/* 錯誤內容卡片 - 使用專案卡片背景和陰影 */
.error-card {
  width: 100%;
  background-color: var(--capy-bg-surface);
  border-radius: var(--capy-radius-lg);
  box-shadow: var(--capy-shadow-base);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-xl);
  text-align: center;
  transition: box-shadow var(--capy-transition-base);
}

.error-card:hover {
  box-shadow: var(--capy-shadow-md);
}

/* 500 錯誤代碼 - 使用危險色 */
.error-code {
  font-size: 96px;
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-danger);
  line-height: 1;
  margin-bottom: var(--capy-spacing-md);
  text-shadow: 0 4px 8px rgba(245, 108, 108, 0.2);
  letter-spacing: -2px;
  animation: pulse 2s ease-in-out infinite;
}

/* 脈衝動畫 - 強調錯誤 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

/* 標題 - 使用主要文字色 */
.error-title {
  font-size: var(--capy-font-size-title);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-text-primary);
  margin: 0 0 var(--capy-spacing-md);
  line-height: 1.4;
}

/* 描述文字 - 使用常規文字色 */
.error-description {
  font-size: var(--capy-font-size-lg);
  color: var(--capy-text-regular);
  line-height: 1.6;
  margin: 0 0 var(--capy-spacing-xl);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* 操作按鈕區域 */
.error-actions {
  display: flex;
  gap: var(--capy-spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.button-icon {
  margin-right: var(--capy-spacing-xs);
}

/* Element Plus 按鈕自定義 */
:deep(.el-button) {
  border-radius: var(--capy-radius-md);
  font-weight: var(--capy-font-weight-medium);
  padding: 12px 24px;
  transition: all var(--capy-transition-base);
}

:deep(.el-button--primary) {
  box-shadow: 0 4px 12px rgba(84, 205, 242, 0.3);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(84, 205, 242, 0.4);
}

:deep(.el-button--text) {
  color: var(--capy-primary);
}

:deep(.el-button--text:hover) {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-button:active) {
  transform: translateY(0);
}

/* 響應式設計 - 平板 */
@media (max-width: 768px) {
  .server-error-page {
    padding: var(--capy-spacing-md);
  }

  .server-error-container {
    gap: var(--capy-spacing-lg);
  }

  .illustration-wrapper {
    max-width: 320px;
  }

  .error-card {
    padding: var(--capy-spacing-xl) var(--capy-spacing-lg);
  }

  .error-code {
    font-size: 72px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-description {
    font-size: var(--capy-font-size-base);
  }

  .error-actions {
    flex-direction: column;
    width: 100%;
  }

  :deep(.el-button) {
    width: 100%;
    justify-content: center;
  }
}

/* 響應式設計 - 手機 */
@media (max-width: 480px) {
  .server-error-page {
    padding: var(--capy-spacing-sm);
  }

  .illustration-wrapper {
    max-width: 280px;
  }

  .error-card {
    padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  }

  .error-code {
    font-size: 56px;
  }

  .error-title {
    font-size: 18px;
  }

  .error-description {
    font-size: var(--capy-font-size-sm);
  }

  :deep(.el-button) {
    padding: 10px 20px;
  }
}

/* 動畫優化 - 減少動畫以提升性能 */
@media (prefers-reduced-motion: reduce) {
  .illustration-wrapper {
    animation: none;
  }

  .error-code {
    animation: none;
  }

  :deep(.el-button--primary:hover) {
    transform: none;
  }

  :deep(.el-button:active) {
    transform: none;
  }
}
</style>
