import fetchMenu from './fetcher';
import normalizeMenu from './normalizer';

/**
 * Usage example (in handler):
 *
 * import { fetchMenu, normalizeMenu } from 'react-storefront-linxcommerce-connector;
 * ...
 * ...
 * const rawData = await fetchMenu({});
 * const data = normalizeMenu(rawData);
 * ...
 * ...
 */
export {
  fetchMenu,
  normalizeMenu,
};
