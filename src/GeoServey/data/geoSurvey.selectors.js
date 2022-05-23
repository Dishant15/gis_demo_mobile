import {createSelector} from '@reduxjs/toolkit';

export const getGeoSurveyCoords = store => store.geoSurvey.coordinates;

export const getGeoSurveyFormData = store => store.geoSurvey.boundaryData;

export const getGeoSurveyTags = store =>
  store.geoSurvey.boundaryData.tags || [];

export const getGeoSurveyUnitList = store => store.geoSurvey.units;

export const getGeoSurveySelectedUnitIndex = store =>
  store.geoSurvey.selectedUnitIndex;

export const getGeoSurveySelectedUnitData = createSelector(
  [getGeoSurveyUnitList, getGeoSurveySelectedUnitIndex],
  (units, index) => units[index],
);

export const getGeoSurveyUnitFormData = store =>
  store.geoSurvey.selectedUnitData;

export const getIsReviewed = store => store.geoSurvey.isReview;

export const getSelectedArea = store => store.geoSurvey.selectedArea;
export const getSelectedSurveyId = store => store.geoSurvey.selectedSurvey.id;

export const getParentId = store => store.geoSurvey.parentId;

export const getSurveyPolygons = store => store.geoSurvey.surveyList;
