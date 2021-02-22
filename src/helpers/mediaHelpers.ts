/* eslint-disable import/prefer-default-export */
import { cdnProduct } from '../config';

const productCdn = (imgSrc) => `${cdnProduct}${imgSrc}`;

export {
  productCdn,
};
