import fetch from 'isomorphic-unfetch';
import { webApiHost, webApiAuth } from './config';

const baseRequestParams = {
  headers: {
    Authorization: `Basic ${webApiAuth}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function postWithWebApi(url: string, body: any): Promise<any> {
  const requestData = {
    method: 'POST',
    ...baseRequestParams,
    body: JSON.stringify(body),
  };

  return fetch(`${webApiHost}${url}`, requestData).then((res) => res.json());
}

function getWithWebApi(url: string): Promise<any> {
  const requestData = {
    method: 'GET',
    ...baseRequestParams,
  };

  return fetch(`${webApiHost}${url}`, requestData).then((res) => res.json());
}

export { postWithWebApi, getWithWebApi };
