import {
  apiAddSurvey,
  apiGetAreaPocketList,
  apiGetSurveyAddBoundary,
  apiGetSurveyEditBoundary,
  apiGetSurveyList,
} from '~constants/url.constants';
import Api from '~utils/api.utils';

export const fetchAreaPockets = async () => {
  const res = await Api.get(apiGetAreaPocketList());
  return res.data;
};

export const fetchSurveyList = async () => {
  const res = await Api.get(apiGetSurveyList());
  return res.data;
};

export const postGeoServey = async data => {
  const res = await Api.post(apiAddSurvey(), data);
  return res.data;
};

// handle add / edti survey
export const updateGeoServey = async data => {
  if (data.id) {
    const res = await Api.put(apiGetSurveyEditBoundary(data.id), data);
    return res.data;
  } else {
    const res = await Api.post(apiGetSurveyAddBoundary(), data);
    return res.data;
  }
};
