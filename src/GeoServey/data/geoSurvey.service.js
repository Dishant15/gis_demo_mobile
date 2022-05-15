import {apiAddSurvey, apiGetAreaPocketList} from '~constants/url.constants';
import Api from '~utils/api.utils';

export const fetchAreaPockets = async () => {
  const res = await Api.get(apiGetAreaPocketList());
  return res.data;
};

export const postGeoServey = async data => {
  const res = await Api.post(apiAddSurvey(), data);
  return res.data;
};
