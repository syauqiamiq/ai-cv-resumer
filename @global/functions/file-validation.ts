import { BadRequestException } from '@nestjs/common';

export const fileTypeValidation = (
  file: Express.Multer.File,
  allowedMimeTypes: string[],
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException(`Invalid file type for ${file.fieldname}.`);
  }
  return true;
};

export const fileSizeValidation = (
  file: Express.Multer.File,
  allowdSizedInBytes: number,
) => {
  if (file.size > allowdSizedInBytes) {
    throw new BadRequestException(`Invalid file size for ${file.fieldname}.`);
  }
  return true;
};
