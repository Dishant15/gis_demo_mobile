import {createSelector} from '@reduxjs/toolkit';
import {get} from 'lodash';

export const getActiveTab = store => store.planningState.activeTab;

export const getSelectedRegionIds = store =>
  store.planningState.selectedRegionIds;
export const getExpandedRegionIds = store =>
  store.planningState.expandedRegionIds;

export const getSelectedLayerKeys = store =>
  store.planningState.selectedLayerKeys;

export const getSelectedConfigurations = store =>
  store.planningState.selectedConfigurations;

export const getLayerSelectedConfiguration = layerKey =>
  createSelector(getSelectedConfigurations, selectedConfigs =>
    get(selectedConfigs, layerKey, {}),
  );
