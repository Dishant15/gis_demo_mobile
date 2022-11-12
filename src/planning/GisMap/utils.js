import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import {coordsToLatLongMap} from '~utils/map.utils';
import * as RegionLayer from './layers/region';
import * as DPLayer from './layers/p_dp';
import * as SplitterLayer from './layers/p_splitter';
import * as CableLayer from './layers/p_cable';
import * as BuildingLayer from './layers/p_survey_building';
import * as SAreaLayer from './layers/p_survey_area';
import {
  AddLayer as DPAddLayer,
  Geometry as DPGeometry,
  LAYER_KEY as DpKey,
  ElementForm as DpForm,
  getIcon as DpGetIcon,
  ElementLayer as DpElement,
  EditMapLayer as DpEditMapLayer,
} from './layers/p_dp';
import {
  LAYER_KEY as SplitterKey,
  Geometry as SplitterGeometry,
  AddLayer as SplitterAddLayer,
  ElementForm as SplitterForm,
  getIcon as SplitterGetIcon,
  ElementLayer as SplitterElement,
  EditMapLayer as SplitterEditMapLayer,
} from './layers/p_splitter';
import {
  LAYER_KEY as CableKey,
  Geometry as CableGeometry,
  getIcon as CableGetIcon,
  AddLayer as CableAddLayer,
  ElementLayer as CableElement,
  ElementForm as CableForm,
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
  EditMapLayer as BuildingEditMapLayer,
} from './layers/p_survey_building';

export const PLANNING_EVENT_old = {
  addElement: 'A',
  addElementForm: 'F',
  showElementDetails: 'D',
  editElementDetails: 'EF',
  editElementLocation: 'E',
};
// possible events that can happen on map
export const PLANNING_EVENT = {
  addElementGeometry: 'A',
  editElementGeometry: 'E',
  addElementForm: 'F',
  editElementForm: 'EF',
  showElementDetails: 'D',
  showElementConnections: 'EC',
  addElementConnection: 'AC',
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
  [RegionLayer.LAYER_KEY]: {
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
    getViewOptions: RegionLayer.getViewOptions,
  },
  [DPLayer.LAYER_KEY]: {
    featureType: DPLayer.LAYER_FEATURE_TYPE,
    getViewOptions: DPLayer.getViewOptions,
    initialElementData: DPLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DPLayer.ELEMENT_TABLE_FIELDS,
    formConfig: DPLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: DPLayer.transformAndValidateData,
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <DpEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <DpForm />,
    [PLANNING_EVENT.editElementDetails]: <DpForm />,
    Geometry: DPGeometry,
    Icon: DpGetIcon,
  },
  [SplitterLayer.LAYER_KEY]: {
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SplitterLayer.getViewOptions,
    initialElementData: SplitterLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SplitterLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: SplitterLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: SplitterLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: SplitterLayer.transformAndValidateData,
    [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SplitterEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SplitterForm />,
    [PLANNING_EVENT.editElementDetails]: <SplitterForm />,
    Geometry: SplitterGeometry,
    Icon: SplitterGetIcon,
  },
  [CableLayer.LAYER_KEY]: {
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    getViewOptions: CableLayer.getViewOptions,
    initialElementData: CableLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CableLayer.ELEMENT_TABLE_FIELDS,
    formConfig: CableLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: CableLayer.transformAndValidateData,
    [PLANNING_EVENT.addElement]: <CableAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <CableEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <CableForm />,
    [PLANNING_EVENT.editElementDetails]: <CableForm />,
    Geometry: CableGeometry,
    Icon: CableGetIcon,
  },
  [SAreaLayer.LAYER_KEY]: {
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SAreaLayer.getViewOptions,
    initialElementData: SAreaLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SAreaLayer.ELEMENT_TABLE_FIELDS,
    formConfig: SAreaLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: SAreaLayer.transformAndValidateData,
    [PLANNING_EVENT.addElement]: <SAreaAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <SAreaEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <SAreaForm />,
    [PLANNING_EVENT.editElementDetails]: <SAreaForm />,
    Geometry: SAreaGeometry,
    Icon: SAreaIcon,
  },
  [BuildingLayer.LAYER_KEY]: {
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
    getViewOptions: BuildingLayer.getViewOptions,
    initialElementData: BuildingLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: BuildingLayer.ELEMENT_TABLE_FIELDS,
    [PLANNING_EVENT.addElement]: <BuildingAddLayer />,
    [PLANNING_EVENT.editElementLocation]: <BuildingEditMapLayer />,
    [PLANNING_EVENT.addElementForm]: <BuildingForm />,
    [PLANNING_EVENT.editElementDetails]: <BuildingForm />,
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
  else if (layerKey === RegionLayer.LAYER_KEY) {
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
