import get from 'lodash/get';
import find from 'lodash/find';
import filter from 'lodash/filter';
import first from 'lodash/first';
import { productCdn } from '../helpers/mediaHelpers';

const matchedSizeAlias = [
  'tamanho',
  'tamanhos',
  'size',
  'sizes',
  'num',
  'número',
  'numero',
  'nº',
  'number',
  'numb',
];

function getSizes(rawProduct) {
  const options = get(rawProduct, 'Options', []);

  if (!options.length) {
    return options;
  }

  let sizeOption = find(options, (o) => matchedSizeAlias.indexOf(o.PropertyName.toLowerCase()) >= 0);

  if (!sizeOption) {
    sizeOption = first(options);
  }

  if (!sizeOption) {
    return [];
  }

  return sizeOption.map((size) => {
    const text = get(size, 'Text', '');
    const id = get(size, 'PropertyPath', '');
    return {
      text,
      id,
    };
  });
}

const matchedColorAlias = [
  'cor',
  'cores',
  'color',
  'colors',
];

function getSwatches(rawProduct) {
  const options = get(rawProduct, 'Options', []);

  if (!options.length) {
    return options;
  }

  let colorOption = find(options, (o) => matchedColorAlias.indexOf(o.PropertyName.toLowerCase()) >= 0);

  if (!colorOption) {
    colorOption = first(options);
  }

  if (!colorOption) {
    return [];
  }

  return colorOption.Values.map((color) => {
    const text = get(color, 'Text', '');
    const rgb = get(color, 'Color', '');
    const propertyPath = get(color, 'PropertyPath', '');
    const rawMediaGroups = get(rawProduct, 'MediaGroups', []);
    const colorMediaGroups = filter(rawMediaGroups, (groups) => groups.VariationPath.indexOf(propertyPath) >= 0) || [];
    const medias = colorMediaGroups.map((media) => ({
      alt: media.Thumbnail ? media.Thumbnail.Title : rawProduct.Name,
      src: media.Thumbnail ? productCdn(media.Thumbnail.MediaPath) : '',
    }));

    return {
      id: propertyPath,
      css: rgb,
      text,
      image: {
        src: `https://via.placeholder.com/48x48/${rgb.replace('#', '')}?text=%20`,
        alt: `${text}`,
      },
      media: {
        thumbnail: first(medias),
        thumbnails: medias,
      },
    };
  });

  // /// ////
  // const rawConfigurableOptions = get(rawProduct, 'configurable_options', []);
  // const colors = get(keyBy(rawConfigurableOptions, 'attribute_code'), 'color.values', []);
  // const rawVariants = get(rawProduct, 'variants', []);
  // const variantsGrouped = groupBy(rawVariants, (item) => {
  //   const attrs = get(item, 'attributes');
  //   const attrsKeyed = keyBy(attrs, 'code');
  //   return get(attrsKeyed, 'color.label');
  // });
  // return colors.map((color) => {
  //   const text = get(color, 'label', '');
  //   const rgb = get(color, 'swatch_data.value', '');
  //   const image = get(variantsGrouped, `${text}[0].product.media_gallery[0]url`, '');
  //   const thumbnail = {
  //     alt: 'thumbnail image',
  //     src: image,
  //   };
  //   return {
  //     id: rgb,
  //     css: rgb,
  //     text,
  //     image: {
  //       src: `https://via.placeholder.com/48x48/${rgb.replace('#', '')}?text=%20`,
  //       alt: `${text} swatch`,
  //     },
  //     media: {
  //       thumbnail,
  //       thumbnails: [thumbnail],
  //     },
  //   };
  // });
}

function normalizeProductItem(rawItem) {
  const thumbnail = productCdn(get(rawItem, 'MediaSmall', ''));
  return {
    id: get(rawItem, 'ProductID', ''),
    url: `/p/${get(rawItem, 'Url', '')}`,
    name: get(rawItem, 'Name', ''),
    price: get(rawItem, 'RetailPrice', 0),
    basePriceText: `R$ ${get(rawItem, 'ListPrice', 0)}`,
    colors: getSwatches(rawItem),
    sizes: getSizes(rawItem),
    thumbnail: {
      src: thumbnail,
      alt: 'thumbnail',
      type: 'image',
    },
    reviewCount: get(rawItem, 'RatingCount', 0),
  };
}

function getSortData(rawSubcategoryData) {
  const rawSortFields = get(rawSubcategoryData, 'SortOptions');
  return {
    sortDefault: find(rawSortFields, (s) => s.Selected),
    sortOptions: rawSortFields
      .map((option) => ({
        name: get(option, 'Label'),
        code: get(option, 'Alias'),
      })),
  };
}

// @TODO - parei aqui - 21-02
function getFacetsData(rawSubcategoryData) {
  const rawFacets = get(rawSubcategoryData, 'aggregations', [])
    .filter((facet) => get(facet, 'attribute_code') !== 'category_id'); // skip categories
  return {
    facets: rawFacets.map((rawFilter) => {
      const attr = get(rawFilter, 'attribute_code');
      const isColorFacet = attr === 'color';
      const rawOptions = get(rawFilter, 'options', []);
      return {
        name: get(rawFilter, 'label'),
        ui: 'buttons',
        options: rawOptions
          .map((option) => ({
            name: get(option, 'label'),
            code: `${attr}:${get(option, 'value')}`,
            matches: get(option, 'count', 0),
            css: isColorFacet ? get(option, 'label', '').toLowerCase() : '',
          })),
      };
    }),
  };
}

/**
 * Linx Commerce: subcategory normalizer
 */
function normalizer(rawData): any {
  const rawSubcategoryData = get(rawData, 'Model.Grid', {});
  return {
    total: get(rawSubcategoryData, 'ProductCount', 0),
    totalPages: get(rawSubcategoryData, 'PageCount', 1),
    currentPage: get(rawSubcategoryData, 'PageNumber', 1),
    products: get(rawSubcategoryData, 'Products', []).map(normalizeProductItem),
    ...getSortData(rawSubcategoryData),
    ...getFacetsData(rawSubcategoryData),
  };
}

export default normalizer;
