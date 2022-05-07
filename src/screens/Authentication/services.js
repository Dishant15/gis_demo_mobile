import {apiPostLogin} from '~constants/url.constants';
import Api from '~utils/api.utils';

export const postLogin = async data => {
  const res = await Api.post(apiPostLogin(), data);
  return res.data;
};
