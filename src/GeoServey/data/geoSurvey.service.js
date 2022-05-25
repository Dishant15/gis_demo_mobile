import {
  apiAddSurvey,
  apiGetUserTaskList,
  apiGetSurveyAddBoundary,
  apiGetSurveyEditBoundary,
  apiGetSurveyList,
  apiPostSurveyAddUnit,
  apiPutEditUnit,
} from '~constants/url.constants';
import Api from '~utils/api.utils';

export const fetchUserTaskList = async () => {
  const res = await Api.get(apiGetUserTaskList());
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

// handle add / edti survey
export const upsertSurveyUnit = async data => {
  if (data.id) {
    const res = await Api.put(apiPutEditUnit(data.id), data);
    return res.data;
  } else {
    const res = await Api.post(apiPostSurveyAddUnit(), data);
    return res.data;
  }
};
