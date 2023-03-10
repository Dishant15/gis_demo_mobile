import {Platform} from 'react-native';
import {GM_IOS_API_KEY, GM_ANDROID_API_KEY} from '@env';

export const apiGetVersion = () => `/api/version/`;
export const apiGetHealthCheck = () => '/api/health/check/';

export const apiPostLogin = () => `/api/token/`;
export const apiPostChangePassword = () => '/api/user/change-password/';
export const apiPostProfileEdit = () => '/api/user/profile-edit/';

export const apiAddSurvey = () => `/api/geo/survey/add/`;

export const getGoogleAddress = (long, lat) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${
    Platform.OS === 'ios' ? GM_IOS_API_KEY : GM_ANDROID_API_KEY
  }`;

/* External server apis **/
export const apiGetAreaPocketList = () => '/api/geo/survey/area-pocket/list/';
export const apiGetUserTaskList = () => '/api/task/survey/list/';

export const apiGetSurveyList = () => '/api/geo/survey/list/';
export const apiGetSurveyAddBoundary = () => '/api/geo/survey/boundary/add/';
export const apiGetSurveyEditBoundary = (surveyId = ':survey_id') =>
  `/api/geo/survey/boundary/${surveyId}/edit/`;
export const apiDeteleSurvey = (surveyId = ':survey_id') =>
  `/api/geo/survey/boundary/${surveyId}/delete/`;

export const apiPostSurveyAddUnit = () => '/api/geo/survey/unit/add/';
export const apiPutEditUnit = (unitId = ':unit_id') =>
  `/api/geo/survey/unit/${unitId}/edit/`;
export const apiDeleteUnit = (unitId = ':unit_id') =>
  `/api/geo/survey/unit/${unitId}/delete/`;

export const apiGetTicketList = () => '/api/ticket/list/';
export const apiGetTicketWorkorders = ticketId =>
  `/api/ticket/${ticketId}/workorders/`;

export const apiGetDashboardData = () => '/api/dashboard/';
export const apiGetDashboardSurveyTicketSummery = () =>
  '/api/survey-ticket-summery/';

// region apis

// query_type = detail | data
export const apiGetRegionList = (query_type = 'detail') =>
  `/api/region/${query_type}/list/`;
export const apiGetRegionDetails = regionId =>
  `/api/region/${regionId}/details/?query_type=data`;

// planning apis
export const apiGetPlanningConfigs = () => '/api/planning/configs/';
export const apiGetPlanningConfigsDetails = () =>
  '/api/planning/configs/details/';
export const apiGetPlanningLayerData = () => '/api/planning/layer/';

export const apiPostAddElement = layerKey =>
  `/api/planning/layer/${layerKey}/add/`;

export const apiPutEditElement = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/edit/`;

export const apiPostAddTicketWorkorder = ticketId =>
  `/api/ticket/${ticketId}/workorder/add/`;

export const apiGetElementDetails = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/details/`;

export const apiGetTicketWorkorderElements = (ticketId = ':ticketId') =>
  `/api/ticket/${ticketId}/workorders/elements/`;

export const apiPutTicketWorkorderEdit = workOrderId =>
  `/api/ticket/workorder/${workOrderId}/edit/`;

export const apiPutTicketWorkorderElementEdit = workOrderId =>
  `/api/ticket/workorder/${workOrderId}/edit/element/`;

export const apiPostValidateElementGeometry = () =>
  '/api/planning/layer/validate/geometry/';

export const apiGetElementAssociations = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/associations/`;

export const apiGetElementConnections = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/connections/`;

// same api as edit element -> cable edit
export const apiUpdateElementConnections = cableId =>
  apiPutEditElement('p_cable', cableId);

export const apiGetElementPortDetails = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/ports/`;

export const getApiSurveyTicketWoList = ticketId =>
  `/api/survey/ticket/${ticketId}/list/`;

export const apiGetSurveyWoDetails = (layerKey, elementId) =>
  `/api/survey/${layerKey}/${elementId}/details/`;

export const apiGetTicketDetails = ticketId =>
  `/api/ticket/${ticketId}/details/`;

export const apiPostSurveyWo = (layerKey, elementId) =>
  `/api/survey/${layerKey}/${elementId}/add/`;

export const apiPutSurveyWo = (layerKey, elementId) =>
  `/api/survey/${layerKey}/${elementId}/edit/`;
