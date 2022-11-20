import {createSelector} from '@reduxjs/toolkit';
import get from 'lodash/get';

export const getAllLayersNetworkStatus = store =>
  store.planningGis.layerNetworkState;
export const getAllLayersData = store => store.planningGis.layerData;

export const getLayerNetworkState = layerKey =>
  createSelector(getAllLayersNetworkStatus, layerNetworkState =>
    get(layerNetworkState, layerKey, {}),
  );

export const getLayerViewData = layerKey =>
  createSelector(getAllLayersData, layerData => get(layerData, layerKey, []));

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

// flag to decide to set geometry when user tap on map / drag market or not
// set geometry if enableMapInterection is true;
export const getGisMapInterectionEnable = store =>
  store.planningGis.mapState.enableMapInterection;

export const getPlanningMapPosition = store => store.planningGis.mapPosition;
