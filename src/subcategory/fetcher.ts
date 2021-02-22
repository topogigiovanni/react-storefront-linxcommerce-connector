import { getWithStoreApi } from '../fetchWithStoreApi';

/**
 * Linx Commerce: subcategory fetcher
 */
async function fetcher({
  categoryId = null,
  pageSize = 16,
  currentPage = 1,
  slug = '',
  filter = '',
  sort = '',
  search = '',
}): Promise<any> {
  /* eslint-disable no-console */
  console.log('subcategory fetch', categoryId, pageSize, currentPage, slug, filter, sort, search);
  /* eslint-enable no-console */
  const query = `/${slug}.json`;
  const result = await getWithStoreApi(query);
  return result;
}

export default fetcher;
