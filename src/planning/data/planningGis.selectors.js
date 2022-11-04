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
  createSelector(getAllLayersData, layerData => get(layerData, layerKey, {}));

export const getGisMapState = store => store.planningGis.mapState.state;
export const getGisMapStateLayerKey = store =>
  store.planningGis.mapState.layerKey;
export const getGisMapStateGeometry = store =>
  store.planningGis.mapState.geometry;

export const getGisMapInterectionEnable = store =>
  store.planningGis.mapState.enableMapInterection;

// Gis Map Event selectors
export const getPlanningMapState = store => store.planningGis.mapState;
export const getPlanningMapStateData = store =>
  store.planningGis.mapState.data || {};
export const getPlanningTicketWorkOrderId = store =>
  store.planningGis.workOrderId;
export const getPlanningTicketId = store =>
  get(store, 'planningGis.ticketData.id');

export const getSelectedConfigurations = store =>
  store.planningState.selectedConfigurations;

export const getPlanningTicketData = store => store.planningGis.ticketData;
