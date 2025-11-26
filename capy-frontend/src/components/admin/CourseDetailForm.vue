<script setup>
const formModel = ref({
  name: "java basic",
  price: "3600",
  imageUrl: "https://picsum.photos/400",
  cate: ["guide", "disciplines", "consistency"],
});
//category
const cateOptions = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          {
            value: "consistency",
            label: "Consistency",
          },
          {
            value: "feedback",
            label: "Feedback",
          },
          {
            value: "efficiency",
            label: "Efficiency",
          },
          {
            value: "controllability",
            label: "Controllability",
          },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "side nav",
            label: "Side Navigation",
          },
          {
            value: "top nav",
            label: "Top Navigation",
          },
        ],
      },
    ],
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [
          {
            value: "layout",
            label: "Layout",
          },
          {
            value: "color",
            label: "Color",
          },
          {
            value: "typography",
            label: "Typography",
          },
          {
            value: "icon",
            label: "Icon",
          },
          {
            value: "button",
            label: "Button",
          },
        ],
      },
      {
        value: "form",
        label: "Form",
        children: [
          {
            value: "radio",
            label: "Radio",
          },
          {
            value: "checkbox",
            label: "Checkbox",
          },
          {
            value: "input",
            label: "Input",
          },
          {
            value: "input-number",
            label: "InputNumber",
          },
          {
            value: "select",
            label: "Select",
          },
          {
            value: "cascader",
            label: "Cascader",
          },
          {
            value: "switch",
            label: "Switch",
          },
          {
            value: "slider",
            label: "Slider",
          },
          {
            value: "time-picker",
            label: "TimePicker",
          },
          {
            value: "date-picker",
            label: "DatePicker",
          },
          {
            value: "datetime-picker",
            label: "DateTimePicker",
          },
          {
            value: "upload",
            label: "Upload",
          },
          {
            value: "rate",
            label: "Rate",
          },
          {
            value: "form",
            label: "Form",
          },
        ],
      },
      {
        value: "data",
        label: "Data",
        children: [
          {
            value: "table",
            label: "Table",
          },
          {
            value: "tag",
            label: "Tag",
          },
          {
            value: "progress",
            label: "Progress",
          },
          {
            value: "tree",
            label: "Tree",
          },
          {
            value: "pagination",
            label: "Pagination",
          },
          {
            value: "badge",
            label: "Badge",
          },
        ],
      },
      {
        value: "notice",
        label: "Notice",
        children: [
          {
            value: "alert",
            label: "Alert",
          },
          {
            value: "loading",
            label: "Loading",
          },
          {
            value: "message",
            label: "Message",
          },
          {
            value: "message-box",
            label: "MessageBox",
          },
          {
            value: "notification",
            label: "Notification",
          },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          {
            value: "menu",
            label: "Menu",
          },
          {
            value: "tabs",
            label: "Tabs",
          },
          {
            value: "breadcrumb",
            label: "Breadcrumb",
          },
          {
            value: "dropdown",
            label: "Dropdown",
          },
          {
            value: "steps",
            label: "Steps",
          },
        ],
      },
      {
        value: "others",
        label: "Others",
        children: [
          {
            value: "dialog",
            label: "Dialog",
          },
          {
            value: "tooltip",
            label: "Tooltip",
          },
          {
            value: "popover",
            label: "Popover",
          },
          {
            value: "card",
            label: "Card",
          },
          {
            value: "carousel",
            label: "Carousel",
          },
          {
            value: "collapse",
            label: "Collapse",
          },
        ],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      {
        value: "axure",
        label: "Axure Components",
      },
      {
        value: "sketch",
        label: "Sketch Templates",
      },
      {
        value: "docs",
        label: "Design Documentation",
      },
    ],
  },
];
//tags
const tagValue = ref(["Label1", "Label2"]);

const tagOptions = [
  {
    tagId: "1",
    label: "Label1",
  },
  {
    tagId: "2",
    label: "Label2",
  },
  {
    tagId: "3",
    label: "Label3",
  },
  {
    tagId: "4",
    label: "Label4",
  },
  {
    tagId: "5",
    label: "Label5",
  },
];
</script>
<template>
  <div class="wrapper">
    <h2 class="section-title">課程基本資訊</h2>
    <el-form size="large" label-position="top" label-width="auto" :model="formModel">
      <el-form-item>
        <template #label>
          <span class="form-label">課程名稱 :</span>
        </template>
        <el-input readonly style="width: 80%" v-model="formModel.name" />
      </el-form-item>
      <el-form-item label="課程封面 :">
        <img
          style="max-width: 100%"
          v-if="formModel.imageUrl"
          :src="formModel.imageUrl"
          class="avatar"
        />
      </el-form-item>
      <el-form-item label="課程價格 :">
        <el-input style="width: auto" v-model="formModel.price">
          <template #prefix> NTD &nbsp&nbsp</template>
        </el-input>
      </el-form-item>
      <el-form-item label="課程分類 :">
        <el-cascader v-model="formModel.cate" :options="cateOptions" />
      </el-form-item>
      <el-form-item label="課程標籤 :">
        <el-select
          disabled
          v-model="tagValue"
          placeholder="選擇課程標籤"
          style="width: 240px"
          clearable
          multiple
        >
          <template #label="{ label, value }">
            <span style="font-weight: bold">{{ value }}</span>
          </template>
          <el-option
            v-for="tag in tagOptions"
            :key="tag.tagId"
            :label="tag.label"
            :value="tag.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="課程簡介 :">
        <el-input style="width: 80%" type="textarea" :rows="5" placeholder="輸入課程簡介" />
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.el-form) {
  overflow: hidden;
}
</style>
