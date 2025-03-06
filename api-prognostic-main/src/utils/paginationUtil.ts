export const paginate = (page: number, pageSize: number) => {
  const limit = pageSize > 0 ? pageSize : 10;
  const offset = (page > 0 ? page - 1 : 0) * limit;
  return { limit, offset };
};

export const paginateResponse = (
  data: any,
  count: number,
  page: number,
  pageSize: number
) => {
  const totalPages = Math.ceil(count / pageSize);
  return {
    data,
    currentPage: page,
    totalPages,
    totalRecords: count,
    pageSize,
  };
};
