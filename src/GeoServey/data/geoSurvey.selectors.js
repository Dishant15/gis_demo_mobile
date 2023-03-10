import {createSelector} from '@reduxjs/toolkit';

// task , area related selectors

export const getSelectedArea = store => store.geoSurvey.selectedAreaData;

// survey related selectors
export const getSurveyBoundaryList = store => store.geoSurvey.surveyList;
export const getFilteredSurveyList = store =>
  store.geoSurvey.filteredSurveyList;
export const getAppliedStatusFilter = store => store.geoSurvey.statusFilter;
export const getCountByStatus = store => store.geoSurvey.countByStatus;

export const getSelectedSurveyId = store => store.geoSurvey.selectedSurvey.id;
export const getSelectedSurveyIndex = store =>
  store.geoSurvey.selectedSurveyIndex;
export const getSurveyCoordinates = store =>
  store.geoSurvey.selectedSurvey.coordinates;
export const getSurveyStatus = store => store.geoSurvey.selectedSurvey.status;

export const getGeoSurveyFormData = store => store.geoSurvey.selectedSurvey;

export const getGeoSurveyTags = store =>
  store.geoSurvey.selectedSurvey.tags || [];

// survey unit related selectors
export const getGeoSurveyUnitList = store =>
  store.geoSurvey.selectedSurvey.units;
export const getGeoSurveySelectedUnitIndex = store =>
  store.geoSurvey.selectedUnitIndex;

export const getGeoSurveySelectedUnitData = createSelector(
  [getGeoSurveyUnitList, getGeoSurveySelectedUnitIndex],
  (units, index) => units[index],
);

export const getGeoSurveyUnitFormData = store =>
  store.geoSurvey.selectedUnitData;

// other integration data selectors
export const getIsReviewed = store => store.geoSurvey.isReview;
export const getTicketId = store => store.geoSurvey.selectedTicketId;
export const getTicketStatus = store => store.geoSurvey.selectedTicketStatus;
export const getErrPolygons = store => store.geoSurvey.errPolygons;
