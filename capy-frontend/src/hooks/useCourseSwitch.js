const STATUS_MAP = {
  draft: "draft",
  submitted_rejected: "draft",
  transcoding_failed: "draft",
  published: "published",
  pending_review: "review",
  submitted_approved: "review",
  transcoding: "review",
  force_unpublish: "banned",
};
export const switchCourseStatus = (status) => {
  // const switchCourseStatus = (status) => STATUS_MAP[status] ?? "unknown";
  // return { switchCourseStatus };
  return STATUS_MAP[status] ?? "unknown";
  // switch (status) {
  //   //草稿(包含草稿、申請上架失敗、課程轉碼失敗)
  //   case "draft":
  //   case "submitted_rejected":
  //   case "transcoding_failed":
  //     return "draft";
  //   //上架中
  //   case "published":
  //     return "published";
  //   //審核中(包含待審核、審核通過、轉碼)
  //   case "pending_review":
  //   case "submitted_approved":
  //   case "transcoding":
  //     return "review";
  //   //強制下架
  //   case "force_unpublish":
  //     return "banned";
  //   default:
  //     return "unknown";
  // }
};
