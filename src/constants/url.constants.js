// import {API_HOST} from '@env';
// console.log('🚀 ~ file: url.constants.js ~ line 2 ~ API_HOST', API_HOST);
const API_HOST = 'http://192.168.0.104:8000';
const GOOGLE_KEY = 'AIzaSyC4fchbQzIjIhCiuV-FqvuALteha7484ik';
export const apiPostLogin = () => `${API_HOST}/api/token`;

export const apiAddSurvey = () => `${API_HOST}/api/geo/survey/add/`;

export const getGoogleAddress = (lat, long) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_KEY}`;
