import {GOOGLE_API_KEY} from '@env';

export const apiGetVersion = () => `/api/version/`;

export const apiPostLogin = () => `/api/token/`;
export const apiPostChangePassword = () => '/api/user/change-password/';

export const apiAddSurvey = () => `/api/geo/survey/add/`;

export const getGoogleAddress = (long, lat) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_API_KEY}`;

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
