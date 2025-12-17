<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDownBold, ArrowRightBold, CirclePlus } from '@element-plus/icons-vue'
import { VueDraggable as Draggable } from 'vue-draggable-plus'
import TextInputDialog from '../common/TextInputDialog.vue'
import AlertDialog from '../common/AlertDialog.vue'
import LessonFormDialog from './LessonFormDialog.vue'
import { useLesson } from '@/composable/useLesson'
import { useCourseStore } from '@/stores/course'
import { useVideo } from '@/composable/useVideo'
import { useVideoStore } from '@/stores/video'
import { getVideoUrl } from '@/api/teacher/video'
import { createLesson, updateLesson } from '@/api/teacher/course'
import transformSeconds from '@/utils/timetransform'

const props = defineProps({
  sectionInfo: {
    type: Object,
    required: true
  }
})

const courseStore = useCourseStore()
const { deleteSection, updateSection, deleteCourseLesson, reorderCourseLesson } = useLesson(props.sectionInfo)

const sectionTitle = ref(props.sectionInfo.title)
const showSectionEditDialog = ref(false)
const showSectionDeleteDialog = ref(false)

const handleEditSection = async (val) => {
  await updateSection(val)
}

const handleDeleteSection = async () => {
  await deleteSection()
}

// lesson dialog / data
const lessonDialogRef = ref(null)
const isEditLesson = ref(false)
const currentLesson = ref(null)
const showLessonDialog = ref(false)
const lessonVideoUrl = ref(null)

const handleCreateLesson = () => {
  isEditLesson.value = false
  lessonVideoUrl.value = null
  showLessonDialog.value = true
}

const handleEditLesson = async (lessonInfo) => {
  isEditLesson.value = true
  currentLesson.value = lessonInfo
  const res = await getVideoUrl(lessonInfo.lessonId)
  if (res?.signedUrl) {
    lessonVideoUrl.value = res.signedUrl
  }
  showLessonDialog.value = true
}

const handleSaveLesson = async (data) => {
  data.request.courseId = courseStore.currentCourseId
  data.request.sectionId = props.sectionInfo.sectionId
  if (!isEditLesson.value) {
    data.request.displayOrder = props.sectionInfo.lessons.length
  }

  const fd = new FormData()
  fd.append('uploadRequest', new Blob([JSON.stringify(data.request)], { type: 'application/json' }))
  for (let i = 0; i < data.fileList.length; i += 1) {
    fd.append('attachments', data.fileList[i])
  }

  try {
    if (!isEditLesson.value) {
      const res = await createLesson(fd)
      await courseStore.fetchCourseOverview()

      if (data.request.videoMeta) {
        ElMessage.warning('影片上傳中，請勿關閉或離開頁面。')
        const videoStore = useVideoStore()
        videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId })
        const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId)
        await uploadVideoToGCP(res.videoInfo.initiateUrl, data.videoFile)
      } else {
        ElMessage.success('新增成功')
      }
    } else {
      const res = await updateLesson(fd)
      await courseStore.fetchCourseOverview()
      if (data.request.videoMeta) {
        ElMessage.warning('影片上傳中，請勿關閉或離開頁面。')
        const videoStore = useVideoStore()
        videoStore.append({ lessonId: res.lessonId, videoAssetId: res.videoInfo.videoAssetId })
        const { uploadVideoToGCP } = useVideo(res.videoInfo.videoAssetId)
        await uploadVideoToGCP(res.videoInfo.initiateUrl, data.videoFile)
      } else {
        ElMessage.success('更新成功')
      }
    }
  } catch (e) {
    const message = isEditLesson.value ? '更新失敗' : '新增失敗'
    ElMessage.error(message)
  }
}

const checkIsUploading = (lessonId) => {
  const { isUploading } = useVideo()
  return isUploading(lessonId)
}

const handleDeleteLesson = async (lessonId) => {
  await deleteCourseLesson(lessonId)
}

const lessonOrderList = computed(() => props.sectionInfo.lessons.map((lesson) => lesson.lessonId))

let reverseFlag = false
watch(lessonOrderList, async (newVal, oldVal) => {
  if (reverseFlag) {
    reverseFlag = false
    return
  }

  const verify = () => {
    for (let i = 0; i < newVal.length; i += 1) {
      if (newVal[i] !== oldVal[i]) {
        return false
      }
    }
    return true
  }

  if (newVal.length < 1) return
  if (newVal.length === oldVal.length && verify()) return

  const map = new Map(props.sectionInfo.lessons.map((s) => [s.lessonId, s]))
  try {
    await reorderCourseLesson(newVal)
    ElMessage.success('單元順序已更新')
  } catch (e) {
    ElMessage.error('單元順序更新失敗')
    reverseFlag = true
    props.sectionInfo.lessons = oldVal.map((id) => map.get(id)).filter(Boolean)
  }
})

const handleReorderLesson = () => {
  reorderCourseLesson(lessonOrderList.value)
}

const handleStartDrag = () => {
  ElMessage.info('拖曳以調整單元順序')
}
</script>

<template>
  <div>
    <TextInputDialog
      v-model:visible="showSectionEditDialog"
      v-model:inputValue="sectionTitle"
      title="編輯章節標題"
      placeholder="輸入章節標題"
      @confirm="handleEditSection"
    />
    <AlertDialog
      v-model:visible="showSectionDeleteDialog"
      title="刪除章節"
      alert-text="確認要刪除這個章節？"
      :highlight="props.sectionInfo.title"
      @confirm="handleDeleteSection"
    />

    <LessonFormDialog
      ref="lessonDialogRef"
      v-model:visible="showLessonDialog"
      v-model:videoUrl="lessonVideoUrl"
      :sectionInfo="props.sectionInfo"
      :isEdit="isEditLesson"
      :lessonInfo="currentLesson"
      @confirm="handleSaveLesson"
    />

    <el-collapse-item :name="sectionInfo.sectionId ?? sectionInfo.id">
      <template #icon="{ isActive }">
        <el-icon size="large" v-show="isActive"><ArrowDownBold /></el-icon>
        <el-icon size="large" v-show="!isActive"><ArrowRightBold /></el-icon>
      </template>
      <template #title>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding-right: 24px;
            flex-wrap: wrap;
            justify-content: space-between;
          "
        >
          <p style="font-size: 20px; padding: 5px 0; padding-left: 20px">
            {{ sectionInfo?.title }}
            <span v-if="sectionInfo.lessons?.length > 0" style="font-size: 14px">
              | 共 {{ sectionInfo?.lessons?.length }} 個單元
            </span>
          </p>
          <div>
            <el-button @click.stop="showSectionEditDialog = true">編輯</el-button>
            <el-button type="info" @click.stop="showSectionDeleteDialog = true">刪除</el-button>
          </div>
        </div>
      </template>

      <div>
        <el-button plain class="upload-btn" @click="handleCreateLesson">
          <el-icon><CirclePlus /></el-icon>
          上傳新單元影片
        </el-button>
        <ul v-if="sectionInfo.lessons?.length > 0" class="course-playlist">
          <Draggable
            v-model="sectionInfo.lessons"
            @start="handleStartDrag"
            @update="handleReorderLesson"
          >
            <li v-for="(lesson, index) in sectionInfo?.lessons" :key="lesson.lessonId">
              <div style="display: flex; align-items: center; flex: 2">
                <span class="index">{{ index < 10 ? '0' + (index + 1) : index }}</span>
                {{ lesson.lessonTitle }}
                <el-tag v-show="lesson.freePreview" style="margin-left: 8px">試看單元</el-tag>
              </div>

              <div v-if="!checkIsUploading(lesson.lessonId)">
                {{ lesson.videoAssetStatus === 'upload_failed' ? '尚無影片' : transformSeconds(lesson.lessonDurationSeconds) }}

                <el-button style="margin-left: 8px" @click="handleEditLesson(lesson)">編輯</el-button>
                <el-button type="info" @click="handleDeleteLesson(lesson.lessonId)">刪除</el-button>
              </div>
              <div v-else style="flex: 1">
                上傳中，請稍候
                <el-progress :percentage="100" :show-text="false" :indeterminate="true" :duration="5" />
              </div>
            </li>
          </Draggable>
        </ul>
      </div>
    </el-collapse-item>
  </div>
</template>

<style scoped>
:deep(.el-collapse-item__header) {
  background-color: rgb(221, 233, 246);
  border-radius: 8px;
}
:deep(.el-collapse-item__header.focusing:focus:not(:hover)) {
  color: #000;
}

:deep(.el-collapse-item__content) {
  padding: 10px 0;
  background-color: rgb(245, 247, 249);
  border-radius: 0 0 8px 8px;
}

.upload-btn {
  width: 90%;
  margin-left: 5%;
  border: 1px dashed #000;
  text-align: center;
  border-radius: 8px;
  padding: 20px 0;
}

.course-playlist {
  margin-top: 10px;
}

.course-playlist li {
  margin-bottom: 4px;
  background-color: #fff;
  padding: 10px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
}

.course-playlist li .index {
  font-size: 20px;
  font-weight: 700;
  margin-right: 8px;
}

.course-playlist li:hover {
  background-color: #eff4f9;
}

.dialogForm {
  padding: 16px;
}

.collapse-chapter-btns {
  position: absolute;
  z-index: 10;
  display: flex;
  right: 20px;
}
</style>
