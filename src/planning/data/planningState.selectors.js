import {createSelector} from '@reduxjs/toolkit';
import get from 'lodash/get';

export const getActiveTab = store => store.planningState.activeTab;

export const getSelectedRegionIds = store =>
  store.planningState.selectedRegionIds;
export const getExpandedRegionIds = store =>
  store.planningState.expandedRegionIds;

export const getSelectedLayerKeys = store =>
  store.planningState.selectedLayerKeys;

// Get list of all configurable layerKey -> ConfigList
export const getLayerConfigurations = store =>
  store.planningState.layerConfigurations;

export const getSingleLayerConfigurationList = layerKey =>
  createSelector(getLayerConfigurations, layerConfigList =>
    get(layerConfigList, layerKey, []),
  );

export const getSelectedConfigurations = store =>
  store.planningState.selectedConfigurations;

export const getLayerSelectedConfiguration = layerKey =>
  createSelector(getSelectedConfigurations, selectedConfigs =>
    get(selectedConfigs, layerKey, {}),
  );
