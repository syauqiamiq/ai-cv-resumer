import { SelectQueryBuilder } from 'typeorm';

export async function executePaginateQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 25,
): Promise<{
  data: T[];
  total: number;
  lastPage: number;
  page: number;
  perPage: number;
}> {
  // Execute the query with pagination
  const [data, total] = await queryBuilder
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();

  // Calculate lastPage
  const lastPage = Math.ceil(total / limit);

  return {
    data,
    total,
    lastPage,
    page: parseInt(page.toString()),
    perPage: parseInt(limit.toString()),
  };
}
export async function executePaginateQueryWithJoinTable<T>(
  queryBuilder: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 25,
): Promise<{
  data: T[];
  total: number;
  lastPage: number;
  page: number;
  perPage: number;
}> {
  // Execute the query with pagination
  const data = await queryBuilder
    .take(limit)
    .skip((page - 1) * limit)
    .getRawMany();

  const total = await queryBuilder.getCount();

  // Calculate lastPage
  const lastPage = Math.ceil(total / limit);

  return {
    data,
    total,
    lastPage,
    page: parseInt(page.toString()),
    perPage: parseInt(limit.toString()),
  };
}
