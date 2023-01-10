import {API_HOST} from '@env';

import axios from 'axios';
import {isNil, map, keys, join, get} from 'lodash';
import {handleLogoutUser} from '~Authentication/data/auth.actions';
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

  config.baseURL =
    process.env.NODE_ENV !== 'production'
      ? API_HOST
      : store.getState().appState.hostConfig.value;

  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        '🚀 ~ file: api.utils.js ~ line 44 ~ error',
        error?.response,
        error?.message,
      );
    }
    // dispatch logout action if request unauthorised.
    const status = get(error, 'response.status');
    if (status === 401) {
      store.dispatch(handleLogoutUser);
      showToast(authRevoked(), TOAST_TYPE.ERROR, 10000);
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

export const parseErrorMessagesWithFields = error => {
  let msgList = [];
  let fieldList = [];
  const status = get(error, 'response.status');

  if (status) {
    if (status === 400) {
      const errorData = get(error, 'response.data', {});
      fieldList = [];
      msgList = [];
      for (const key in errorData) {
        if (Object.hasOwnProperty.call(errorData, key)) {
          const errorList = errorData[key];
          if (key === '__all__') {
            showToast(
              get(errorList, 0, 'Undefined Error'),
              TOAST_TYPE.ERROR,
              5000,
            );
          } else {
            fieldList.push(key);
            msgList.push(get(errorList, 0, 'Undefined Error'));
          }
        }
      }
    } else if (status === 403) {
      store.dispatch(handleLogoutUser);
      showToast(authRevoked(), TOAST_TYPE.ERROR, 10000);
    }
  } else {
    showToast('Something Went Wrong', TOAST_TYPE.ERROR, 10000);
  }

  return {fieldList, messageList: msgList};
};
