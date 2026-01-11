import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export type PaginatedResult<T, K extends keyof T> = {
  data: T[];
  nextCursor: T[K] | null;
};

export async function paginationToDataFetch<
  T extends ObjectLiteral,
  K extends keyof T = 'id',
>(
  qb: SelectQueryBuilder<T>,
  cursor?: T[K],
  limit = 10,
  sortBy: K = 'id' as K,
  order: 'ASC' | 'DESC' = 'ASC',
  selectColumns?: K[],
): Promise<PaginatedResult<T, K>> {
  // Select only needed columns
  if (selectColumns?.length) {
    qb.select(selectColumns.map((col) => `${qb.alias}.${String(col)}`));
  }

  qb.take(limit).orderBy(`${qb.alias}.${String(sortBy)}`, order);

  // Dynamic cursor condition
  if (cursor !== undefined) {
    qb.andWhere(
      order === 'ASC'
        ? `${qb.alias}.${String(sortBy)} > :cursor`
        : `${qb.alias}.${String(sortBy)} < :cursor`,
      { cursor },
    );
  }

  // Fetch data
  const data = await qb.getMany();

  // Compute nextCursor safely
  const nextCursor: T[K] | null = data.length
    ? data[data.length - 1][sortBy]
    : null;

  return { data, nextCursor };
}
