import slugify from 'slugify';
import { v4 } from 'uuid';

export const generateUniqueFileName = (file: Express.Multer.File): string => {
  const originalFileName = file.originalname;
  const extension = originalFileName.split('.').pop();
  const baseName = originalFileName.split('.')[0]; // Remove extension

  // Slugify for a clean and URL-friendly filename
  const cleanBaseName = slugify(baseName, { lower: true, strict: true });

  // Generate a UUID for uniqueness
  const uniqueIdentifier = v4();

  // Construct the unique filename
  return `${cleanBaseName}-${uniqueIdentifier}.${extension}`;
};
