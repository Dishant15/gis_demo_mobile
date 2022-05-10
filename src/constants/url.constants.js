// import {API_HOST} from '@env';
// console.log('🚀 ~ file: url.constants.js ~ line 2 ~ API_HOST', API_HOST);
const API_HOST = 'http://192.168.0.104:8000';
export const apiPostLogin = () => `${API_HOST}/api/token`;

export const apiAddSurvey = () => `${API_HOST}/api/geo/survey/add/`;
