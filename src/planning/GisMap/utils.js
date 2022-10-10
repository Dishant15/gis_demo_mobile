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
  getIcon as DpGetIcon,
  ElementLayer as DpElement,
  ElementDetails as DpDetails,
  EditMapLayer as DpEditMapLayer,
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
  EditMapLayer as SplitterEditMapLayer,
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
  EditMapLayer as CableEditMapLayer,
} from './layers/p_cable';
import {
  LAYER_KEY as SAreaKey,
  ViewLayer as SAreaViewLayer,
  Geometry as SAreaGeometry,
  getIcon as SAreaIcon,
  AddLayer as SAreaAddLayer,
  ElementLayer as SAreaElement,
  ElementForm as SAreaForm,
  ElementDetails as SAreaDetails,
  EditMapLayer as SAreaEditMapLayer,
} from './layers/p_survey_area';

import {
  LAYER_KEY as BuildingKey,
  ViewLayer as BuildingViewLayer,
  Geometry as BuildingGeometry,
  getIcon as BuildingIcon,
  AddLayer as BuildingAddLayer,
  ElementLayer as BuildingElement,
  ElementForm as BuildingForm,
  ElementDetails as BuildingDetails,
  EditMapLayer as BuildingEditMapLayer,
} from './layers/p_survey_building';

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
  } else if (layerKey === SAreaKey) {
    return ELEMENT_TYPE.POLYGON;
  }
};

export const LayerKeyMappings = {
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
  },
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <DpEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <DpForm />,
    [PLANNING_EVENT.showElementDetails]: <DpDetails />,
    [PLANNING_EVENT.editElementDetails]: <DpForm />,
    ViewLayer: DPViewLayer,
    Geometry: DPGeometry,
    Icon: DpGetIcon,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SplitterEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SplitterForm />,
    [PLANNING_EVENT.showElementDetails]: <SplitterDetails />,
    [PLANNING_EVENT.editElementDetails]: <SplitterForm />,
    ViewLayer: SplitterLayer,
    Geometry: SplitterGeometry,
    Icon: SplitterGetIcon,
  },
  [CableKey]: {
    [PLANNING_EVENT.addElement]: <CableAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <CableEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <CableForm />,
    [PLANNING_EVENT.showElementDetails]: <CableDetails />,
    [PLANNING_EVENT.editElementDetails]: <CableForm />,
    ViewLayer: CableLayer,
    Geometry: CableGeometry,
    Icon: CableGetIcon,
  },
  [SAreaKey]: {
    [PLANNING_EVENT.addElement]: <SAreaAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SAreaEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SAreaForm />,
    [PLANNING_EVENT.showElementDetails]: <SAreaDetails />,
    [PLANNING_EVENT.editElementDetails]: <SAreaForm />,
    ViewLayer: SAreaViewLayer,
    Geometry: SAreaGeometry,
    Icon: SAreaIcon,
  },
  [BuildingKey]: {
    [PLANNING_EVENT.addElement]: <BuildingAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <BuildingEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <BuildingForm />,
    [PLANNING_EVENT.showElementDetails]: <BuildingDetails />,
    [PLANNING_EVENT.editElementDetails]: <BuildingForm />,
    ViewLayer: BuildingViewLayer,
    Geometry: BuildingGeometry,
    Icon: BuildingIcon,
  },
};

// on Gis event handle with gis mapping
export const LayerKeyGisMapping = {
  [DpKey]: {
    [PLANNING_EVENT.addElement]: DpElement,
    [PLANNING_EVENT.editElementLocation]: DpElement,
  },
  [SplitterKey]: {
    [PLANNING_EVENT.addElement]: SplitterElement,
    [PLANNING_EVENT.editElementLocation]: SplitterElement,
  },
  [CableKey]: {
    [PLANNING_EVENT.addElement]: CableElement,
    [PLANNING_EVENT.editElementLocation]: CableElement,
  },
  [SAreaKey]: {
    [PLANNING_EVENT.addElement]: SAreaElement,
    [PLANNING_EVENT.editElementLocation]: SAreaElement,
  },
  [BuildingKey]: {
    [PLANNING_EVENT.addElement]: BuildingElement,
    [PLANNING_EVENT.editElementLocation]: BuildingElement,
  },
};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // PolyLine
  if (layerKey === CableKey || layerKey === SAreaKey) {
    resultData.map(d => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (
    layerKey === DpKey ||
    layerKey === SplitterKey ||
    layerKey === BuildingKey
  ) {
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
