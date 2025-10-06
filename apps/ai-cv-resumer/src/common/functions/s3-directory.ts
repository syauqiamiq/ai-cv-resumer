export const getUserAttachmentS3Directory = (
  userId: string,
  uniqueFileName: string,
) => {
  return `user-attachments/${userId}/${uniqueFileName}`;
};
