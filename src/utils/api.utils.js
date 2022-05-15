import {API_HOST} from '@env';
console.log('🚀 ~ file: api.utils.js ~ line 2 ~ API_HOST', API_HOST);
import axios from 'axios';
import {isNil, map, keys, join} from 'lodash';
import store from '~store';

export function convertObjectToQueryParams(object) {
  if (!isNil(object)) {
    const paramArray = map(keys(object), key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(object[key]);
    });
    return '?' + join(paramArray, '&');
  } else {
    return '';
  }
}

export const apiRequestConfig = {
  baseURL: API_HOST,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const token = store.getState().auth.token;
  if (config.headers)
    config.headers.Authorization = token ? `Token ${token}` : undefined;
  return config;
});

class Api {
  static get(url, queryParams, config = {}) {
    return axiosInstance.get(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }

  static post(url, body, queryParams, config = {}) {
    console.log(
      '🚀 ~ file: api.utils.js ~ line 43 ~ Api ~ post ~ url, body',
      url,
      body,
    );
    return axiosInstance.post(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      },
    );
  }

  static put(url, body, queryParams, config = {}) {
    return axiosInstance.put(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      },
    );
  }

  static patch(url, body, queryParams, config = {}) {
    return axiosInstance.patch(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      },
    );
  }

  static delete(url, queryParams, config = {}) {
    return axiosInstance.delete(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }
}

export default Api;
