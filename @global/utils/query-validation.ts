import { BadRequestException } from '@nestjs/common';

export function validatePagination(
  page: number,
  limit: number,
  maxLimit: number = 100,
): void {
  if (page < 1 || limit < 1 || limit > maxLimit) {
    throw new BadRequestException(
      `Invalid pagination parameters: page must be >= 1, limit must be between 1 and ${maxLimit}`,
    );
  }
}

export function validateOrderBy(orderBy: string, validFields: string[]): void {
  if (!validFields.includes(orderBy)) {
    throw new BadRequestException('Invalid order by field');
  }
}
