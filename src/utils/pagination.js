export const paginate = async (
  model,
  page = 1,
  limit = 10,
  populateOptions = [],
  filter = {},
  select = "",
  sortField = { createdAt: -1 }
) => {
  const skip = (page - 1) * limit;
  console.log(populateOptions);

  const totalDocuments = await model.countDocuments(filter);

  let query = model.find(filter).skip(skip).limit(limit).sort(sortField);

  if (select) {
    const selectFields = select.split(",").join(" ");
    query = query.select(selectFields);
  }

  // Apply population if options are provided
  if (populateOptions.length > 0) {
    populateOptions.forEach((option) => {
      query = query.populate(option);
    });
  }
  const data = await query;

  // Calculate total pages and create pages array
  const totalPages = Math.ceil(totalDocuments / limit);
  let pagesArray = [1];

  if (totalPages > 3) {
    if (page > 2) pagesArray.push(page - 1);
    pagesArray.push(page);
    if (page < totalPages - 1) pagesArray.push(page + 1);
    if (!pagesArray.includes(totalPages)) pagesArray.push(totalPages);
  } else {
    for (let i = 2; i <= totalPages; i++) {
      pagesArray.push(i);
    }
  }

  pagesArray = [...new Set(pagesArray)].sort((a, b) => a - b);

  // Build pagination object
  const pagination = {
    total: totalDocuments,
    current_page: page,
    limit,
    next: page < totalPages ? page + 1 : null,
    prev: page > 1 ? page - 1 : null,
    pages: pagesArray,
  };

  return { data, pagination };
};
