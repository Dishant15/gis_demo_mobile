import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import {FEATURE_TYPES} from './layers/common/configuration';
import {coordsToLatLongMap} from '~utils/map.utils';
import {customAlphabet} from 'nanoid/non-secure';

import * as RegionLayer from './layers/region';
import * as DPLayer from './layers/p_dp';
import * as SplitterLayer from './layers/p_splitter';
import * as CableLayer from './layers/p_cable';
import * as BuildingLayer from './layers/p_survey_building';
import * as SAreaLayer from './layers/p_survey_area';

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElementGeometry: 1,
  editElementGeometry: 2,
  addElementForm: 3,
  editElementForm: 4,
  showElementDetails: 5,
  // special events
  showElementConnections: 6,
  addElementConnection: 7,
  showPossibleAddAssociatiation: 8,
  showAssociatedElements: 9,
  // map select elements on location
  selectElementsOnMapClick: 10,
  listElementsOnMap: 11,
};

export const TICKET_WORKORDER_TYPE = {
  ADD: 'A',
  EDIT: 'E',
  DELETE: 'D',
};

export const LayerKeyMappings = {
  [RegionLayer.LAYER_KEY]: {
    preUid: RegionLayer.PRE_UID,
    featureType: RegionLayer.LAYER_FEATURE_TYPE,
    getViewOptions: RegionLayer.getViewOptions,
    elementTableFields: RegionLayer.ELEMENT_TABLE_FIELDS,
  },
  [DPLayer.LAYER_KEY]: {
    preUid: DPLayer.PRE_UID,
    featureType: DPLayer.LAYER_FEATURE_TYPE,
    getViewOptions: DPLayer.getViewOptions,
    initialElementData: DPLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: DPLayer.ELEMENT_TABLE_FIELDS,
    formConfig: DPLayer.ELEMENT_FORM_TEMPLATE,
  },
  [SplitterLayer.LAYER_KEY]: {
    preUid: SplitterLayer.PRE_UID,
    featureType: SplitterLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SplitterLayer.getViewOptions,
    initialElementData: SplitterLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SplitterLayer.ELEMENT_TABLE_FIELDS,
    elementTableExtraControls: SplitterLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    formConfig: SplitterLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: SplitterLayer.transformAndValidateData,
  },
  [CableLayer.LAYER_KEY]: {
    preUid: CableLayer.PRE_UID,
    featureType: CableLayer.LAYER_FEATURE_TYPE,
    getViewOptions: CableLayer.getViewOptions,
    initialElementData: CableLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: CableLayer.ELEMENT_TABLE_FIELDS,
    formConfig: CableLayer.ELEMENT_FORM_TEMPLATE,
    transformAndValidateData: CableLayer.transformAndValidateData,
  },
  [SAreaLayer.LAYER_KEY]: {
    preUid: SAreaLayer.PRE_UID,
    featureType: SAreaLayer.LAYER_FEATURE_TYPE,
    getViewOptions: SAreaLayer.getViewOptions,
    initialElementData: SAreaLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: SAreaLayer.ELEMENT_TABLE_FIELDS,
    formConfig: SAreaLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: SAreaLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
    getDependantFields: SAreaLayer.getDependantFields,
  },
  [BuildingLayer.LAYER_KEY]: {
    preUid: BuildingLayer.PRE_UID,
    featureType: BuildingLayer.LAYER_FEATURE_TYPE,
    getViewOptions: BuildingLayer.getViewOptions,
    initialElementData: BuildingLayer.INITIAL_ELEMENT_DATA,
    elementTableFields: BuildingLayer.ELEMENT_TABLE_FIELDS,
    formConfig: BuildingLayer.ELEMENT_FORM_TEMPLATE,
    elementTableExtraControls: BuildingLayer.ELEMENT_TABLE_EXTRA_CONTROLS,
  },
};

// on Gis event handle with gis mapping
export const LayerKeyGisMapping = {};

export const convertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];
  resultData = orderBy(serverData, ['id'], ['desc']);
  const featureType = LayerKeyMappings[layerKey]['featureType'];

  // PolyLine / Polygon
  if (
    featureType === FEATURE_TYPES.POLYGON ||
    featureType === FEATURE_TYPES.POLYLINE
  ) {
    resultData.map(d => {
      d.geometry = [...d.coordinates];
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
  // Point gis layer
  else if (featureType === FEATURE_TYPES.POINT) {
    resultData.map(d => {
      d.geometry = [...d.coordinates];
      d.coordinates = coordsToLatLongMap([d.coordinates])[0];
    });
    return resultData;
  }
  // Multi polygon
  else if (featureType === FEATURE_TYPES.MULTI_POLYGON) {
    resultData.map(d => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
      d.center = coordsToLatLongMap([d.center])[0];
    });
    return resultData;
  }
};

/**
 * Transform function return new Coordinates based on featureType
 * used in GisMap, on map click
 * polygon, polyline required list
 * marker required single object
 */
export const getElementCoordinates = (
  newCoordinates,
  existingCoordinates,
  featureType,
) => {
  if (
    featureType === FEATURE_TYPES.POLYGON ||
    featureType === FEATURE_TYPES.POLYLINE
  ) {
    return [...(existingCoordinates || []), newCoordinates];
  }
  return newCoordinates;
};

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const nanoid = customAlphabet(alphabet, 6);

export const generateElementUid = layerKey => {
  return `${LayerKeyMappings[layerKey]['preUid']}.${nanoid()}`;
};
