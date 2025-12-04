<script setup>
const formModel = ref({
  name: "java basic",
  price: "3600",
  imageUrl: "https://picsum.photos/300",
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
    <el-form size="large" label-position="top" :model="formModel">
      <el-form-item label="課程名稱 :"> Lorem ipsum dolor sit amet. </el-form-item>
      <el-form-item label="課程封面 :">
        <img style="max-width: 100%" v-if="formModel.imageUrl" :src="formModel.imageUrl" />
      </el-form-item>
      <el-form-item label="課程價格 :"> ${{ 55 }} </el-form-item>
      <el-form-item label="課程分類 :"> 商業>會計 </el-form-item>
      <el-form-item label="課程標籤 :">
        <el-tag effect="plain" round size="large">88</el-tag>
      </el-form-item>
      <el-form-item label="課程簡介 :">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, molestias.</p>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
:deep(.el-form-item__content) {
  padding-left: 12px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
:deep(.el-form-item) {
  margin-bottom: 12px;
}
</style>
