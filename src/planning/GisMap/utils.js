import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import {coordsToLatLongMap} from '~utils/map.utils';

import {
  ViewLayer as RegionViewLayer,
  LAYER_KEY as RegionKey,
} from './layers/region';
import {
  ViewLayer as DPViewLayer,
  AddLayer as DPAddLayer,
  Geometry as DPGeometry,
  LAYER_KEY as DpKey,
  ElementForm as DpForm,
  Icon as DpIcon,
  ElementLayer as DpElement,
} from './layers/p_dp';
import {
  LAYER_KEY as SplitterKey,
  ViewLayer as SplitterLayer,
  Geometry as SplitterGeometry,
  AddLayer as SplitterAddLayer,
  ElementForm as SplitterForm,
  getIcon as SplitterGetIcon,
  ElementLayer as SplitterElement,
} from './layers/p_splitter';
import {LAYER_KEY as CableKey} from './layers/p_cable';

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElement: 'A',
  addElementForm: 'F',
  showElementDetails: 'D',
  editElementDetails: 'EF',
  editElementLocation: 'E',
};

export const TICKET_WORKORDER_TYPE = {
  ADD: 'A',
  EDIT: 'E',
  DELETE: 'D',
};

export const LayerKeyMappings = {
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
  },
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.addElementForm]: <DpForm />,
    ViewLayer: DPViewLayer,
    Geometry: DPGeometry,
    Icon: DpIcon,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
    [PLANNING_EVENT.addElementForm]: <SplitterForm />,
    ViewLayer: SplitterLayer,
    Geometry: SplitterGeometry,
    Icon: SplitterGetIcon,
  },
  // [CableKey]: {
  //   [PLANNING_EVENT.addElement]: <CableAddLayer />,
  //   [PLANNING_EVENT.addElementForm]: <CableForm />,
  //   ViewLayer: CableLayer,
  //   Geometry: CableGeometry,
  //   Icon: CableGetIcon,
  //   ConfigFormTemplate: CableConfigFormTemplate,
  //   ConfigInitData: CableConfigInitData,
  //   configTransformData: cblConfigTransformData,
  // },
};

// on Gis event handle with gis mapping
export const LayerKeyGisMapping = {
  [DpKey]: {
    [PLANNING_EVENT.addElement]: DpElement,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: SplitterElement,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // PolyLine
  if (layerKey === CableKey) {
    resultData.map(d => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (layerKey === DpKey || layerKey === SplitterKey) {
    resultData.map(d => {
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon - regions
  else if (layerKey === RegionKey) {
    resultData.map(d => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};

export const getElementCoordinates = (
  newCoordinates,
  existingCoordinates,
  layerKey,
) => {
  return newCoordinates;
};
