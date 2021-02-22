import fetch from 'isomorphic-unfetch';
import { storeApiHost } from './config';

const baseRequestParams = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function postWithStoreApi(url: string, body: any): Promise<any> {
  const requestData = {
    method: 'POST',
    ...baseRequestParams,
    body: JSON.stringify(body),
  };

  return fetch(`${storeApiHost}${url}`, requestData).then((res) => res.json());
}

function getWithStoreApi(url: string): Promise<any> {
  const requestData = {
    method: 'GET',
    ...baseRequestParams,
  };

  return fetch(`${storeApiHost}${url}`, requestData).then((res) => res.json());
}

export { postWithStoreApi, getWithStoreApi };
