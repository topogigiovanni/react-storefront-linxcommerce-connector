import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

function normalizeItems(items): any[] {
  return items.map((item) => ({
    name: get(item, 'Name', ''),
    url: get(item, 'Url', ''),
    items: !isEmpty(item.Child) ? normalizeItems(item.Child) : [],
  }));
}

/**
 * Linx Commerce: menu normalizer
 */
function normalizer(rawData): any[] {
  // const rawMenu = get(rawData, 'ComponentData.RootCategories', [])
  //   .filter((menu) => get(menu, 'level') === 1)[0];
  // const children = get(rawMenu, 'children', []);
  // const menu = normalizeItems(children);
  // return menu;

  return normalizeItems(get(rawData, 'ComponentData.RootCategories', []));
}

export default normalizer;
