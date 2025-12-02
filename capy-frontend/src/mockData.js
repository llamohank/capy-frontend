/**
 * 課程學習頁面假資料
 * 包含課程結構、FAQ 等模擬資料
 */

/**
 * 課程資料結構
 */
const coursesData = {
  'course-001': {
    courseId: 'course-001',
    courseTitle: 'Vue 3 完整開發指南',
    chapters: [
      {
        id: 'chapter-1',
        title: '第一章：Vue 3 基礎入門',
        lessons: [
          {
            id: 'lesson-1-1',
            title: '1-1 Vue 3 簡介與特性',
            duration: 1200, // 20 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=1',
            isCompleted: true,
            isLocked: false,
            description: `
              <h3>課程簡介</h3>
              <p>本單元將介紹 Vue 3 的核心特性與改進，包括：</p>
              <ul>
                <li>Composition API 的優勢</li>
                <li>效能提升與優化</li>
                <li>TypeScript 支援增強</li>
                <li>新的響應式系統</li>
              </ul>
              <h3>學習目標</h3>
              <p>完成本單元後，您將能夠：</p>
              <ol>
                <li>理解 Vue 3 與 Vue 2 的主要差異</li>
                <li>掌握 Composition API 的基本概念</li>
                <li>了解 Vue 3 的效能優勢</li>
              </ol>
            `,
            attachments: [
              {
                name: 'Vue3-簡介.pdf',
                type: 'pdf',
                size: '2.5MB',
                url: '#'
              },
              {
                name: '課程範例程式碼.zip',
                type: 'zip',
                size: '1.2MB',
                url: '#'
              }
            ]
          },
          {
            id: 'lesson-1-2',
            title: '1-2 開發環境建置',
            duration: 900, // 15 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=2',
            isCompleted: false,
            isLocked: false,
            description: `
              <h3>課程簡介</h3>
              <p>本單元將教您如何建置 Vue 3 開發環境，包括：</p>
              <ul>
                <li>Node.js 與 npm 安裝</li>
                <li>Vue CLI 與 Vite 介紹</li>
                <li>VS Code 擴充套件推薦</li>
                <li>專案初始化與設定</li>
              </ul>
            `,
            attachments: [
              {
                name: '環境建置指南.pdf',
                type: 'pdf',
                size: '1.8MB',
                url: '#'
              }
            ]
          },
          {
            id: 'lesson-1-3',
            title: '1-3 第一個 Vue 3 應用程式',
            duration: 1500, // 25 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=3',
            isCompleted: false,
            isLocked: false,
            description: `
              <h3>課程簡介</h3>
              <p>透過實作第一個 Vue 3 應用程式，學習基本概念：</p>
              <ul>
                <li>專案結構說明</li>
                <li>元件基礎</li>
                <li>模板語法</li>
                <li>資料綁定</li>
              </ul>
            `,
            attachments: []
          }
        ]
      },
      {
        id: 'chapter-2',
        title: '第二章：Composition API 深入探討',
        lessons: [
          {
            id: 'lesson-2-1',
            title: '2-1 setup() 函式詳解',
            duration: 1800, // 30 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=4',
            isCompleted: false,
            isLocked: false,
            description: `
              <h3>課程簡介</h3>
              <p>深入了解 Composition API 的核心 - setup() 函式：</p>
              <ul>
                <li>setup() 的執行時機</li>
                <li>參數與返回值</li>
                <li>與 Options API 的比較</li>
                <li>最佳實踐</li>
              </ul>
            `,
            attachments: [
              {
                name: 'Composition-API-範例.zip',
                type: 'zip',
                size: '3.2MB',
                url: '#'
              }
            ]
          },
          {
            id: 'lesson-2-2',
            title: '2-2 響應式 API：ref 與 reactive',
            duration: 2100, // 35 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=5',
            isCompleted: false,
            isLocked: false,
            description: `
              <h3>課程簡介</h3>
              <p>學習 Vue 3 的響應式系統：</p>
              <ul>
                <li>ref() 的使用時機</li>
                <li>reactive() 的使用時機</li>
                <li>toRef() 與 toRefs()</li>
                <li>響應式原理解析</li>
              </ul>
            `,
            attachments: []
          },
          {
            id: 'lesson-2-3',
            title: '2-3 計算屬性與監聽器',
            duration: 1650, // 27.5 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=6',
            isCompleted: false,
            isLocked: true, // 鎖定狀態
            description: `
              <h3>課程簡介</h3>
              <p>掌握 computed 與 watch 的使用：</p>
              <ul>
                <li>computed() 計算屬性</li>
                <li>watch() 監聽器</li>
                <li>watchEffect() 自動追蹤</li>
                <li>效能優化技巧</li>
              </ul>
            `,
            attachments: []
          }
        ]
      },
      {
        id: 'chapter-3',
        title: '第三章：元件開發進階',
        lessons: [
          {
            id: 'lesson-3-1',
            title: '3-1 元件通訊：Props 與 Emits',
            duration: 1950, // 32.5 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=7',
            isCompleted: false,
            isLocked: true,
            description: `
              <h3>課程簡介</h3>
              <p>學習元件之間的資料傳遞：</p>
              <ul>
                <li>Props 定義與驗證</li>
                <li>Emits 事件發送</li>
                <li>v-model 雙向綁定</li>
                <li>Provide/Inject 跨層級通訊</li>
              </ul>
            `,
            attachments: [
              {
                name: '元件通訊範例.zip',
                type: 'zip',
                size: '2.8MB',
                url: '#'
              },
              {
                name: '元件設計模式.pdf',
                type: 'pdf',
                size: '3.5MB',
                url: '#'
              }
            ]
          },
          {
            id: 'lesson-3-2',
            title: '3-2 插槽 (Slots) 的應用',
            duration: 1440, // 24 分鐘
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=8',
            isCompleted: false,
            isLocked: true,
            description: `
              <h3>課程簡介</h3>
              <p>深入了解 Vue 的插槽機制：</p>
              <ul>
                <li>預設插槽</li>
                <li>具名插槽</li>
                <li>作用域插槽</li>
                <li>動態插槽名稱</li>
              </ul>
            `,
            attachments: []
          }
        ]
      }
    ]
  },
  'course-002': {
    courseId: 'course-002',
    courseTitle: 'React 18 實戰開發',
    chapters: [
      {
        id: 'chapter-1',
        title: '第一章：React 基礎',
        lessons: [
          {
            id: 'lesson-1-1',
            title: '1-1 React 簡介',
            duration: 1080,
            videoUrl: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
            poster: 'https://picsum.photos/1920/1080?random=9',
            isCompleted: false,
            isLocked: false,
            description: '<p>React 18 新特性介紹</p>',
            attachments: []
          }
        ]
      }
    ]
  }
}

/**
 * FAQ 資料結構
 */
const faqsData = {
  'course-001': [
    {
      id: 'faq-1',
      question: '如何安裝 Vue 3？',
      answer: `
        <p>安裝 Vue 3 有多種方式：</p>
        <h4>1. 使用 npm 或 yarn</h4>
        <pre><code>npm create vue@latest
# 或
yarn create vue</code></pre>
        <h4>2. 使用 CDN</h4>
        <pre><code>&lt;script src="https://unpkg.com/vue@3/dist/vue.global.js"&gt;&lt;/script&gt;</code></pre>
        <p>建議使用第一種方式，可以獲得完整的開發工具支援。</p>
      `,
      chapterId: 'chapter-1',
      lessonId: 'lesson-1-2',
      tags: ['安裝', '環境設定']
    },
    {
      id: 'faq-2',
      question: 'Composition API 和 Options API 有什麼區別？',
      answer: `
        <p>主要區別包括：</p>
        <ul>
          <li><strong>程式碼組織：</strong>Composition API 允許按功能組織程式碼，Options API 按選項類型組織</li>
          <li><strong>邏輯複用：</strong>Composition API 更容易抽取和複用邏輯</li>
          <li><strong>TypeScript 支援：</strong>Composition API 有更好的型別推斷</li>
          <li><strong>學習曲線：</strong>Options API 對初學者更友善</li>
        </ul>
        <p>兩者可以在同一個專案中混用，根據需求選擇。</p>
      `,
      chapterId: 'chapter-1',
      lessonId: 'lesson-1-1',
      tags: ['概念', '語法']
    },
    {
      id: 'faq-3',
      question: 'ref 和 reactive 應該如何選擇？',
      answer: `
        <p>選擇建議：</p>
        <ul>
          <li><strong>使用 ref：</strong>基本型別（string, number, boolean）、單一值</li>
          <li><strong>使用 reactive：</strong>物件、陣列等複雜資料結構</li>
        </ul>
        <p>注意：ref 需要透過 .value 存取，reactive 則直接存取屬性。</p>
        <pre><code>// ref 範例
const count = ref(0)
count.value++

// reactive 範例
const state = reactive({ count: 0 })
state.count++</code></pre>
      `,
      chapterId: 'chapter-2',
      lessonId: 'lesson-2-2',
      tags: ['語法', '最佳實踐']
    },
    {
      id: 'faq-4',
      question: '為什麼我的響應式資料沒有更新視圖？',
      answer: `
        <p>常見原因：</p>
        <ol>
          <li><strong>忘記使用 .value：</strong>ref 需要透過 .value 修改</li>
          <li><strong>直接賦值物件：</strong>reactive 物件應該修改屬性而非整個替換</li>
          <li><strong>陣列索引賦值：</strong>應使用陣列方法（push, splice 等）</li>
          <li><strong>解構響應式物件：</strong>會失去響應性，應使用 toRefs()</li>
        </ol>
        <p>解決方案：</p>
        <pre><code>// 錯誤
const state = reactive({ list: [] })
state = { list: [1, 2, 3] } // ❌

// 正確
state.list = [1, 2, 3] // ✅
// 或
state.list.push(1, 2, 3) // ✅</code></pre>
      `,
      chapterId: 'chapter-2',
      lessonId: 'lesson-2-2',
      tags: ['錯誤', '除錯']
    },
    {
      id: 'faq-5',
      question: 'computed 和 watch 的使用時機？',
      answer: `
        <p><strong>使用 computed：</strong></p>
        <ul>
          <li>需要根據其他資料計算衍生值</li>
          <li>結果會被多次使用</li>
          <li>需要快取計算結果</li>
        </ul>
        <p><strong>使用 watch：</strong></p>
        <ul>
          <li>需要在資料變化時執行非同步操作</li>
          <li>需要執行副作用（API 呼叫、DOM 操作等）</li>
          <li>需要存取變化前後的值</li>
        </ul>
      `,
      chapterId: 'chapter-2',
      lessonId: 'lesson-2-3',
      tags: ['概念', '最佳實踐']
    },
    {
      id: 'faq-6',
      question: '如何在 setup() 中使用生命週期鉤子？',
      answer: `
        <p>在 Composition API 中，生命週期鉤子需要導入並在 setup() 中呼叫：</p>
        <pre><code>import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('元件已掛載')
    })

    onUpdated(() => {
      console.log('元件已更新')
    })

    onUnmounted(() => {
      console.log('元件即將卸載')
    })
  }
}</code></pre>
        <p>注意：沒有 beforeCreate 和 created，因為 setup() 本身就在這兩個階段執行。</p>
      `,
      chapterId: 'chapter-2',
      lessonId: 'lesson-2-1',
      tags: ['語法', '生命週期']
    },
    {
      id: 'faq-7',
      question: '父子元件如何傳遞資料？',
      answer: `
        <p><strong>父傳子：使用 Props</strong></p>
        <pre><code>// 父元件
&lt;ChildComponent :message="parentMessage" /&gt;

// 子元件
const props = defineProps({
  message: String
})</code></pre>
        <p><strong>子傳父：使用 Emits</strong></p>
        <pre><code>// 子元件
const emit = defineEmits(['update'])
emit('update', newValue)

// 父元件
&lt;ChildComponent @update="handleUpdate" /&gt;</code></pre>
      `,
      chapterId: 'chapter-3',
      lessonId: 'lesson-3-1',
      tags: ['元件', '通訊']
    },
    {
      id: 'faq-8',
      question: 'Vue 3 的效能優化技巧有哪些？',
      answer: `
        <p>常用優化技巧：</p>
        <ol>
          <li><strong>使用 v-show 代替 v-if：</strong>頻繁切換時</li>
          <li><strong>使用 computed 快取：</strong>避免重複計算</li>
          <li><strong>使用 key 屬性：</strong>列表渲染時</li>
          <li><strong>元件懶載入：</strong>使用 defineAsyncComponent</li>
          <li><strong>使用 shallowRef/shallowReactive：</strong>大型資料結構</li>
          <li><strong>避免不必要的響應式：</strong>使用 markRaw</li>
        </ol>
      `,
      chapterId: 'chapter-1',
      lessonId: 'lesson-1-1',
      tags: ['效能', '最佳實踐']
    }
  ],
  'course-002': [
    {
      id: 'faq-react-1',
      question: 'React 18 有哪些新特性？',
      answer: '<p>React 18 引入了並發渲染、自動批次處理、Suspense 改進等新特性。</p>',
      chapterId: 'chapter-1',
      lessonId: 'lesson-1-1',
      tags: ['新特性', '概念']
    }
  ]
}

/**
 * 取得課程資料
 * @param {string} courseId - 課程 ID
 * @returns {Object|null} 課程資料
 */
export function getCourseData(courseId) {
  return coursesData[courseId] || null
}

/**
 * 取得 FAQ 資料
 * @param {string} courseId - 課程 ID
 * @returns {Array} FAQ 列表
 */
export function getFaqData(courseId) {
  return faqsData[courseId] || []
}

/**
 * 取得所有課程列表（用於其他頁面）
 * @returns {Array} 課程列表
 */
export function getAllCourses() {
  return Object.values(coursesData).map(course => ({
    id: course.courseId,
    title: course.courseTitle,
    chaptersCount: course.chapters.length,
    lessonsCount: course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
  }))
}

/**
 * 根據單元 ID 取得單元資料
 * @param {string} courseId - 課程 ID
 * @param {string} lessonId - 單元 ID
 * @returns {Object|null} 單元資料
 */
export function getLessonById(courseId, lessonId) {
  const course = coursesData[courseId]
  if (!course) return null

  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId)
    if (lesson) {
      return {
        ...lesson,
        chapterTitle: chapter.title
      }
    }
  }
  return null
}

/**
 * 更新單元完成狀態
 * @param {string} courseId - 課程 ID
 * @param {string} lessonId - 單元 ID
 * @param {boolean} isCompleted - 是否完成
 */
export function updateLessonProgress(courseId, lessonId, isCompleted) {
  const course = coursesData[courseId]
  if (!course) return

  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId)
    if (lesson) {
      lesson.isCompleted = isCompleted
      // 實際專案中應該呼叫 API 儲存進度
      console.log(`單元 ${lessonId} 完成狀態已更新為：${isCompleted}`)
      break
    }
  }
}

export default {
  getCourseData,
  getFaqData,
  getAllCourses,
  getLessonById,
  updateLessonProgress
}

// ============================================
// 探索頁面課程資料
// ============================================

/**
 * 探索頁面課程列表（統一的課程資料）
 * @used-in src/views/CourseExplorePage.vue
 * @used-in src/components/Explore/ExploreCourseCard.vue
 *
 * 注意：這些課程資料也會被願望清單、購物車等功能使用
 */
export const exploreCourses = [
  {
    id: 1,
    title: 'Database Design and Management with SQL',
    instructorName: 'Ava Mitchell',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
    averageRating: 4.8,
    reviewCount: 2341,
    price: 1299,
    category: 'Information Technology',
    tags: ['SQL', 'Database']
  },
  {
    id: 2,
    title: 'IT Project Management: Agile and Scrum Methodologies',
    instructorName: 'Liam Foster',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    averageRating: 4.6,
    reviewCount: 1876,
    price: 1599,
    category: 'Information Technology',
    tags: ['Agile', 'Scrum']
  },
  {
    id: 3,
    title: 'DevOps Fundamentals: Automating Your Infrastructure',
    instructorName: 'Isabella Reed',
    coverImageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400',
    averageRating: 4.9,
    reviewCount: 3124,
    price: 1899,
    category: 'Information Technology',
    tags: ['DevOps', 'CI/CD']
  },
  {
    id: 4,
    title: 'Mobile App Development with Flutter',
    instructorName: 'Jackson Cole',
    coverImageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    averageRating: 4.7,
    reviewCount: 2567,
    price: 1799,
    category: 'Information Technology',
    tags: ['Flutter', 'Mobile']
  },
  {
    id: 5,
    title: 'Artificial Intelligence and Deep Learning',
    instructorName: 'Mia Hughes',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    averageRating: 4.9,
    reviewCount: 4532,
    price: 2299,
    category: 'Information Technology',
    tags: ['AI', 'Deep Learning']
  },
  {
    id: 6,
    title: 'Cloud Security: Best Practices',
    instructorName: 'Lucas Bennett',
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    averageRating: 4.5,
    reviewCount: 1923,
    price: 1499,
    category: 'Information Technology',
    tags: ['Cloud', 'Security']
  },
  {
    id: 7,
    title: 'Ethical Hacking and Penetration Testing',
    instructorName: 'Chloe Parker',
    coverImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    averageRating: 4.8,
    reviewCount: 2891,
    price: 1999,
    category: 'Information Technology',
    tags: ['Security', 'Hacking']
  },
  {
    id: 8,
    title: 'Mastering Digital Photography',
    instructorName: 'Emily Carter',
    coverImageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    averageRating: 4.8,
    reviewCount: 1234,
    price: 2399,
    category: 'Design',
    tags: ['Photography', 'Digital Art']
  },
  {
    id: 9,
    title: 'Advanced Spanish Language Course',
    instructorName: 'Javier Rodriguez',
    coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    averageRating: 4.9,
    reviewCount: 856,
    price: 1799,
    category: 'Language',
    tags: ['Language', 'Spanish']
  },
  {
    id: 10,
    title: 'Introduction to Data Science',
    instructorName: 'Dr. Anya Sharma',
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    averageRating: 4.7,
    reviewCount: 2341,
    price: 2699,
    category: 'Information Technology',
    tags: ['Data Science', 'Programming']
  },
  {
    id: 11,
    title: 'Creative Writing Workshop',
    instructorName: 'Ethan Blake',
    coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    averageRating: 4.6,
    reviewCount: 678,
    price: 1499,
    category: 'Writing',
    tags: ['Writing', 'Creative']
  },
  {
    id: 12,
    title: 'Fundamentals of Graphic Design',
    instructorName: 'Olivia Chen',
    coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    averageRating: 4.8,
    reviewCount: 1567,
    price: 2099,
    category: 'Design',
    tags: ['Design', 'Graphics']
  },
  {
    id: 13,
    title: 'The Art of Public Speaking',
    instructorName: 'Marcus Reed',
    coverImageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
    averageRating: 4.7,
    reviewCount: 934,
    price: 1649,
    category: 'Communication',
    tags: ['Communication', 'Public Speaking']
  },
  {
    id: 14,
    title: 'Web Development Bootcamp',
    instructorName: 'Sophia Lee',
    coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    averageRating: 4.9,
    reviewCount: 3421,
    price: 2999,
    category: 'Information Technology',
    tags: ['Web Development', 'Programming']
  },
  {
    id: 15,
    title: 'Financial Planning for Beginners',
    instructorName: 'David Kim',
    coverImageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    averageRating: 4.5,
    reviewCount: 567,
    price: 1349,
    category: 'Finance',
    tags: ['Finance', 'Planning']
  }
]

// ============================================
// 學習中心課程資料
// ============================================

/**
 * 學習中心的課程註冊記錄
 * @used-in src/views/MyLearningPage.vue
 * @used-in src/components/StudentCenter/MyLearning/MyLearningCourseCard.vue
 */
export const enrollments = [
  {
    id: 1,
    course: {
      id: 15,
      title: 'Financial Planning for Beginners: Secure Your Future',
      instructor_name: 'David Kim',
      coverImageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
      price: 1349
    },
    completion_percentage: 75,
    my_review: {
      rating: 4,
      comment: '很棒的課程，內容豐富實用！'
    },
    status: 'ongoing'
  },
  {
    id: 2,
    course: {
      id: 16,
      title: 'Mastering Digital Marketing: Strategies for Success',
      instructor_name: 'Ava Harper',
      coverImageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=300&fit=crop',
      price: 1899
    },
    completion_percentage: 30,
    my_review: null,
    status: 'ongoing'
  },
  {
    id: 3,
    course: {
      id: 10,
      title: 'Advanced Data Analysis with Python',
      instructor_name: 'Dr. Anya Sharma',
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      price: 2699
    },
    completion_percentage: 15,
    my_review: null,
    status: 'ongoing'
  },
  {
    id: 4,
    course: {
      id: 14,
      title: 'Web Development Bootcamp: From Zero to Hero',
      instructor_name: 'Sophia Lee',
      coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      price: 2999
    },
    completion_percentage: 100,
    my_review: {
      rating: 5,
      comment: '非常棒的課程！講師教學清晰，內容實用。'
    },
    status: 'completed'
  },
  {
    id: 5,
    course: {
      id: 5,
      title: 'Introduction to Machine Learning',
      instructor_name: 'Mia Hughes',
      coverImageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      price: 2299
    },
    completion_percentage: 100,
    my_review: null,
    status: 'completed'
  },
  {
    id: 6,
    course: {
      id: 17,
      title: 'UI/UX Design Fundamentals',
      instructor_name: 'Emma Wilson',
      coverImageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      price: 2199
    },
    completion_percentage: 45,
    my_review: null,
    status: 'ongoing'
  }
]

// ============================================
// 訂單資料
// ============================================

/**
 * 訂單記錄資料
 * @used-in src/views/OrdersPage.vue
 */
export const orders = [
  {
    id: 1234587890,
    orderDate: '2024-03-15T10:30:00',
    status: 'paid',
    totalAmount: 2399,
    transactionId: 'TXN123456789',
    items: [
      {
        courseId: 8,
        title: 'Mastering Digital Photography',
        instructorName: 'Emily Carter',
        coverImageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
        price: 2399
      }
    ]
  },
  {
    id: 9876543210,
    orderDate: '2024-03-10T14:20:00',
    status: 'paid',
    totalAmount: 2699,
    transactionId: 'TXN987654321',
    items: [
      {
        courseId: 10,
        title: 'Introduction to Data Science',
        instructorName: 'Dr. Anya Sharma',
        coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        price: 2699
      }
    ]
  },
  {
    id: 5678901234,
    orderDate: '2024-03-05T09:15:00',
    status: 'paid',
    totalAmount: 2299,
    transactionId: 'TXN567890123',
    items: [
      {
        courseId: 5,
        title: 'Artificial Intelligence and Deep Learning',
        instructorName: 'Mia Hughes',
        coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        price: 2299
      }
    ]
  },
  {
    id: 1122334455,
    orderDate: '2024-02-28T16:45:00',
    status: 'paid',
    totalAmount: 5098,
    transactionId: 'TXN112233445',
    items: [
      {
        courseId: 14,
        title: 'Web Development Bootcamp',
        instructorName: 'Sophia Lee',
        coverImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
        price: 2999
      },
      {
        courseId: 12,
        title: 'Fundamentals of Graphic Design',
        instructorName: 'Olivia Chen',
        coverImageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
        price: 2099
      }
    ]
  },
  {
    id: 9988776655,
    orderDate: '2024-02-20T11:30:00',
    status: 'pending',
    totalAmount: 1999,
    transactionId: null,
    items: [
      {
        courseId: 7,
        title: 'Ethical Hacking and Penetration Testing',
        instructorName: 'Chloe Parker',
        coverImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
        price: 1999
      }
    ]
  }
]

// ============================================
// 測試用戶資料
// ============================================

/**
 * 測試用戶資料（用於開發測試）
 * @used-in src/views/AuthTestPage.vue
 */
export const mockUsers = {
  student: {
    token: 'mock-jwt-token-student-' + Date.now(),
    user: {
      id: 1001,
      nickname: '測試學生',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['student']
    }
  },
  teacher: {
    token: 'mock-jwt-token-teacher-' + Date.now(),
    user: {
      id: 2001,
      nickname: '測試教師',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      roles: ['teacher']
    }
  }
}

// ============================================
// 輔助函數：根據 ID 取得課程資料
// ============================================

/**
 * 根據課程 ID 取得完整課程資料
 * @param {number} courseId - 課程 ID
 * @returns {Object|null} 課程資料
 */
export function getCourseById(courseId) {
  return exploreCourses.find(course => course.id === courseId) || null
}

/**
 * 根據多個課程 ID 取得課程資料列表
 * @param {number[]} courseIds - 課程 ID 陣列
 * @returns {Object[]} 課程資料列表
 */
export function getCoursesByIds(courseIds) {
  return courseIds.map(id => getCourseById(id)).filter(Boolean)
}

// ============================================
// 分類樹狀結構資料
// ============================================

/**
 * 課程分類樹狀結構（支援多層級）
 * @used-in src/components/Explore/component/CategoryTreeMulti.vue
 * @used-in src/components/Explore/FilterDrawer.vue
 *
 * 格式說明：
 * - id: 分類唯一識別碼
 * - name: 分類名稱
 * - course_count: 該分類下的課程數量（包含子分類）
 * - children: 子分類陣列
 */
export const categories = [
  {
    id: 1,
    name: '資訊科技',
    course_count: 150,
    children: [
      {
        id: 11,
        name: 'Python',
        course_count: 25,
        children: []
      },
      {
        id: 12,
        name: 'JavaScript',
        course_count: 30,
        children: []
      },
      {
        id: 13,
        name: 'Java',
        course_count: 15,
        children: []
      },
      {
        id: 14,
        name: 'Web Development',
        course_count: 45,
        children: []
      },
      {
        id: 15,
        name: 'Data Science',
        course_count: 20,
        children: []
      },
      {
        id: 16,
        name: 'AI & Machine Learning',
        course_count: 15,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: '商業管理',
    course_count: 95,
    children: [
      {
        id: 21,
        name: '專案管理',
        course_count: 30,
        children: []
      },
      {
        id: 22,
        name: '行銷',
        course_count: 40,
        children: []
      },
      {
        id: 23,
        name: '財務管理',
        course_count: 25,
        children: []
      }
    ]
  },
  {
    id: 3,
    name: '設計',
    course_count: 70,
    children: [
      {
        id: 31,
        name: 'UI/UX 設計',
        course_count: 35,
        children: []
      },
      {
        id: 32,
        name: '平面設計',
        course_count: 25,
        children: []
      },
      {
        id: 33,
        name: '攝影',
        course_count: 10,
        children: []
      }
    ]
  },
  {
    id: 4,
    name: '語言學習',
    course_count: 60,
    children: [
      {
        id: 41,
        name: '英語',
        course_count: 30,
        children: []
      },
      {
        id: 42,
        name: '日語',
        course_count: 15,
        children: []
      },
      {
        id: 43,
        name: '西班牙語',
        course_count: 15,
        children: []
      }
    ]
  },
  {
    id: 5,
    name: '個人發展',
    course_count: 45,
    children: [
      {
        id: 51,
        name: '溝通技巧',
        course_count: 20,
        children: []
      },
      {
        id: 52,
        name: '時間管理',
        course_count: 15,
        children: []
      },
      {
        id: 53,
        name: '領導力',
        course_count: 10,
        children: []
      }
    ]
  }
]

/**
 * 根據分類 ID 取得分類名稱
 * @param {number} categoryId - 分類 ID
 * @returns {string|null} 分類名稱
 */
export function getCategoryNameById(categoryId) {
  const findCategory = (cats, id) => {
    for (const cat of cats) {
      if (cat.id === id) return cat.name
      if (cat.children && cat.children.length > 0) {
        const found = findCategory(cat.children, id)
        if (found) return found
      }
    }
    return null
  }
  return findCategory(categories, categoryId)
}

/**
 * 根據分類 ID 陣列取得分類名稱陣列
 * @param {number[]} categoryIds - 分類 ID 陣列
 * @returns {string[]} 分類名稱陣列
 */
export function getCategoryNamesByIds(categoryIds) {
  return categoryIds.map(id => getCategoryNameById(id)).filter(Boolean)
}
