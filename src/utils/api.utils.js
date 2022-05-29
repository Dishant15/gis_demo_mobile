import {API_HOST} from '@env';
console.log('🚀 ~ file: api.utils.js ~ line 2 ~ API_HOST', API_HOST);
import axios from 'axios';
import {isNil, map, keys, join, get} from 'lodash';
import {logout} from '~Authentication/data/auth.reducer';
import {authRevoked} from '~constants/messages';
import store from '~store';
import {showToast, TOAST_TYPE} from './toast.utils';

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
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  const token = store.getState().auth.token;
  if (config.headers)
    config.headers.Authorization = token ? `Bearer ${token}` : undefined;
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // dispatch logout action if request unauthorised.
    const status = get(error, 'response.status');
    if (status === 401) {
      store.dispatch(logout());
      showToast(authRevoked(), TOAST_TYPE.INFO);
    }
    return Promise.reject(error);
  },
);

class Api {
  static get(url, queryParams, config = {}) {
    return axiosInstance.get(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }

  static post(url, body, queryParams, config = {}) {
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
