<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  {
    id: 1,
    icon: '👥',
    number: '10,000+',
    targetValue: 10000,
    suffix: '+',
    label: '活躍學員',
    displayValue: 0
  },
  {
    id: 2,
    icon: '📚',
    number: '500+',
    targetValue: 500,
    suffix: '+',
    label: '精選課程',
    displayValue: 0
  },
  {
    id: 3,
    icon: '🎓',
    number: '100+',
    targetValue: 100,
    suffix: '+',
    label: '專業講師',
    displayValue: 0
  },
  {
    id: 4,
    icon: '⭐',
    number: '4.8',
    targetValue: 4.8,
    suffix: '',
    label: '平均評分',
    displayValue: 0,
    isDecimal: true
  }
])

// 數字動畫函數
const animateNumber = (stat, duration = 2000) => {
  const startTime = Date.now()
  const startValue = 0
  const endValue = stat.targetValue

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用 easeOutQuart 緩動函數
    const easeProgress = 1 - Math.pow(1 - progress, 4)

    if (stat.isDecimal) {
      stat.displayValue = (startValue + (endValue - startValue) * easeProgress).toFixed(1)
    } else {
      stat.displayValue = Math.floor(startValue + (endValue - startValue) * easeProgress)
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      stat.displayValue = stat.isDecimal ? endValue.toFixed(1) : endValue
    }
  }

  animate()
}

// 格式化顯示數字
const formatDisplayNumber = (stat) => {
  if (stat.displayValue === 0) return '0'

  const value = stat.displayValue
  if (stat.isDecimal) {
    return value
  }

  // 格式化大數字（加入千分位逗號）
  if (value >= 1000) {
    return value.toLocaleString('zh-TW')
  }

  return value
}

onMounted(() => {
  // 延遲啟動動畫，讓頁面先渲染
  setTimeout(() => {
    stats.value.forEach((stat, index) => {
      // 錯開每個數字的動畫開始時間
      setTimeout(() => {
        animateNumber(stat, 2000)
      }, index * 100)
    })
  }, 300)
})
</script>

<template>
  <div class="trust-bar">
    <div class="trust-bar-container">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="stat-item"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-number">
          {{ formatDisplayNumber(stat) }}{{ stat.suffix }}
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trust-bar {
  background-color: var(--capy-bg-surface);
  padding: var(--capy-spacing-xxl) var(--capy-spacing-lg);
  box-shadow: var(--capy-shadow-sm);
}

.trust-bar-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--capy-spacing-xl);
}

.stat-item {
  text-align: center;
  padding: var(--capy-spacing-md);
  transition: transform var(--capy-transition-base);
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: var(--capy-spacing-sm);
  filter: grayscale(0.2);
}

.stat-number {
  font-size: var(--capy-font-size-xxl);
  font-weight: var(--capy-font-weight-bold);
  color: var(--capy-primary);
  margin-bottom: var(--capy-spacing-xs);
  line-height: 1.2;
}

.stat-label {
  font-size: var(--capy-font-size-base);
  color: var(--capy-text-secondary);
  font-weight: var(--capy-font-weight-medium);
}

@media (max-width: 768px) {
  .trust-bar {
    padding: var(--capy-spacing-lg) var(--capy-spacing-md);
  }

  .trust-bar-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-lg);
  }

  .stat-icon {
    font-size: 36px;
  }

  .stat-number {
    font-size: var(--capy-font-size-xl);
  }

  .stat-label {
    font-size: var(--capy-font-size-sm);
  }
}

@media (max-width: 480px) {
  .trust-bar-container {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--capy-spacing-md);
  }
}
</style>
