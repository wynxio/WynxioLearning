function getFileType(fileName) {
  if (!fileName || typeof fileName !== "string") return "invalid";

  const ext = fileName.split(".").pop().toLowerCase();

  const videoExts = ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm"];
  const audioExts = ["mp3", "wav", "aac", "flac", "ogg", "m4a"];
  const docExts   = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg"];

  if (videoExts.includes(ext)) return "video";
  if (audioExts.includes(ext)) return "audio";
  if (docExts.includes(ext)) return "document";
  if (imageExts.includes(ext)) return "image";

  return "invalid";
}


export { getFileType };