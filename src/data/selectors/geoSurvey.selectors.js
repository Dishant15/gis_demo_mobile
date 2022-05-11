import {createSelector} from '@reduxjs/toolkit';

export const getGeoSurveyCoords = store => store.geoSurvey.coordinates;

export const getGeoSurveyFormData = store => store.geoSurvey.boundaryData;

export const getGeoSurveyUnitList = store => store.geoSurvey.units;

export const getGeoSurveySelectedUnitIndex = store =>
  store.geoSurvey.selectedUnit;

export const getGeoSurveySelectedUnitData = createSelector(
  [getGeoSurveyUnitList, getGeoSurveySelectedUnitIndex],
  (units, index) => units[index],
);

export const getIsReviewed = store => store.geoSurvey.isReview;
