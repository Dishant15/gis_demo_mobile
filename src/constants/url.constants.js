const GOOGLE_KEY = 'AIzaSyC4fchbQzIjIhCiuV-FqvuALteha7484ik';
export const apiPostLogin = () => `/api/token/`;

export const apiAddSurvey = () => `/api/geo/survey/add/`;

export const getGoogleAddress = (lat, long) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_KEY}`;

/* External server apis **/
export const apiGetAreaPocketList = () => '/api/geo/survey/area-pocket/list/';
