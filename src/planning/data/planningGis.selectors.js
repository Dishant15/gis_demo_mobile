import {createSelector} from '@reduxjs/toolkit';
import get from 'lodash/get';

export const getAllLayersNetworkStatus = store =>
  store.planningGis.layerNetworkState;
export const getAllLayersData = store => store.planningGis.layerData;
export const getAllMasterData = store => store.planningGis.masterGisData;

export const getLayerNetworkState = layerKey =>
  createSelector(getAllLayersNetworkStatus, layerNetworkState =>
    get(layerNetworkState, layerKey, {}),
  );

export const getLayerViewData = layerKey =>
  createSelector(getAllLayersData, layerData => get(layerData, layerKey, []));

export const getMasterViewData = layerKey =>
  createSelector(getAllMasterData, masterGisData =>
    get(masterGisData, layerKey, []),
  );

// Gis Map Event selectors
export const getPlanningMapState = store => store.planningGis.mapState;
export const getPlanningMapStateData = store =>
  store.planningGis.mapState.data || {};
export const getPlanningMapStateEvent = store =>
  store.planningGis.mapState.event || '';

export const getSelectedConfigurations = store =>
  store.planningState.selectedConfigurations;

export const getPlanningTicketId = store => store.planningGis.ticketId;
export const getPlanningTicketData = store => store.planningGis.ticketData;
export const getPlanningTicketWorkOrderId = store =>
  store.planningGis.workOrderId;

export const getPlanningMapPosition = store => store.planningGis.mapPosition;
export const getPlanningMapFilters = store => store.planningGis.filters;

export const getMapHighlighted = store => store.planningGis.mapHighlight;

export const getTicketMapHighlighted = store =>
  store.planningGis.ticketData.ticketHighlightedWo;

export const getTicketDetails = store => store.planningGis.surveyTicketData;

export const getSurveyTicketWo = store =>
  store.planningGis.surveyTicketWorkorder;
