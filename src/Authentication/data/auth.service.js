import {
  apiPostChangePassword,
  apiPostLogin,
  apiPostProfileEdit,
} from '~constants/url.constants';
import Api from '~utils/api.utils';

import {CLIENT_ID} from '@env';
import trim from 'lodash/trim';

export const postLogin = async data => {
  const reqData = {
    username: trim(data.username),
    password: trim(data.password),
    client_id: CLIENT_ID,
  };
  const res = await Api.post(apiPostLogin(), reqData);
  return res.data;
};

export const postChangePassword = async data => {
  const res = await Api.post(apiPostChangePassword(), data);
  return res.data;
};

export const postProfileEdit = async data => {
  const res = await Api.post(apiPostProfileEdit(), data);
  return res.data;
};
