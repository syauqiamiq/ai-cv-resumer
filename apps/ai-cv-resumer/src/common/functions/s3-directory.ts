export const getUserAttachmentS3Directory = (uniqueFileName: string) => {
  return `user-attachments/${uniqueFileName}`;
};
