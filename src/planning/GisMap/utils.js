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
  ElementDetails as DpDetails,
} from './layers/p_dp';
import {
  LAYER_KEY as SplitterKey,
  ViewLayer as SplitterLayer,
  Geometry as SplitterGeometry,
  AddLayer as SplitterAddLayer,
  ElementForm as SplitterForm,
  getIcon as SplitterGetIcon,
  ElementLayer as SplitterElement,
  ElementDetails as SplitterDetails,
} from './layers/p_splitter';
import {
  LAYER_KEY as CableKey,
  ViewLayer as CableLayer,
  Geometry as CableGeometry,
  getIcon as CableGetIcon,
  AddLayer as CableAddLayer,
  ElementLayer as CableElement,
  ElementForm as CableForm,
  ElementDetails as CableDetails,
} from './layers/p_cable';

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

export const ELEMENT_TYPE = {
  MARKER: 'marker',
  POLYLINE: 'polyline',
  POLYGON: 'polygon',
};

export const getElementTypeFromLayerKey = layerKey => {
  if (layerKey === SplitterKey || layerKey === DpKey) {
    return ELEMENT_TYPE.MARKER;
  } else if (layerKey === CableKey) {
    return ELEMENT_TYPE.POLYLINE;
  }
};

export const LayerKeyMappings = {
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
  },
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.addElementForm]: <DpForm />,
    [PLANNING_EVENT.showElementDetails]: <DpDetails />,
    ViewLayer: DPViewLayer,
    Geometry: DPGeometry,
    Icon: DpIcon,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
    [PLANNING_EVENT.addElementForm]: <SplitterForm />,
    [PLANNING_EVENT.showElementDetails]: <SplitterDetails />,
    ViewLayer: SplitterLayer,
    Geometry: SplitterGeometry,
    Icon: SplitterGetIcon,
  },
  [CableKey]: {
    [PLANNING_EVENT.addElement]: <CableAddLayer />,
    [PLANNING_EVENT.addElementForm]: <CableForm />,
    [PLANNING_EVENT.showElementDetails]: <CableDetails />,
    ViewLayer: CableLayer,
    Geometry: CableGeometry,
    Icon: CableGetIcon,
  },
};

// on Gis event handle with gis mapping
export const LayerKeyGisMapping = {
  [DpKey]: {
    [PLANNING_EVENT.addElement]: DpElement,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: SplitterElement,
  },
  [CableKey]: {
    [PLANNING_EVENT.addElement]: CableElement,
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
  elementType,
) => {
  if (
    elementType === ELEMENT_TYPE.POLYGON ||
    elementType === ELEMENT_TYPE.POLYLINE
  ) {
    return [...(existingCoordinates || []), newCoordinates];
  }
  return newCoordinates;
};
