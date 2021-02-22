import { getWithStoreApi } from '../fetchWithStoreApi';

/**
 * Linx Commerce: menu fetcher
 */
async function fetcher({
  numberOfLevels = 2,
}): Promise<any> {
  const query = `/widget/browsing_categorymenu?RenderJson=true&Levels=${numberOfLevels}`;
  const result = await getWithStoreApi(query);
  return result;
}

export default fetcher;
