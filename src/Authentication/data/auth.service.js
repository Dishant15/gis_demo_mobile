import {apiPostLogin} from '~constants/url.constants';
import Api from '~utils/api.utils';

import {CLIENT_ID} from '@env';

export const postLogin = async data => {
  const reqData = {...data, client_id: CLIENT_ID};
  const res = await Api.post(apiPostLogin(), reqData);
  return res.data;
};
