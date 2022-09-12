import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

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
  getElementCoordinates as handleDpMapClick,
} from './layers/p_dp';
// import {
//   LAYER_KEY as SplitterKey,
//   ViewLayer as SplitterLayer,
//   Geometry as SplitterGeometry,
//   AddLayer as SplitterAddLayer,
//   ElementForm as SplitterForm,
//   getIcon as SplitterGetIcon,
//   ELEMENT_CONFIG_TEMPLATE as SplitterConfigFormTemplate,
//   INITIAL_CONFIG_DATA as SplitterConfigInitData,
//   transformAndValidateConfigData as spConfigTransformData,
// } from './layers/p_splitter';
// import {
//   LAYER_KEY as CableKey,
//   ViewLayer as CableLayer,
//   Geometry as CableGeometry,
//   AddLayer as CableAddLayer,
//   ElementForm as CableForm,
//   getIcon as CableGetIcon,
//   ELEMENT_CONFIG_TEMPLATE as CableConfigFormTemplate,
//   INITIAL_CONFIG_DATA as CableConfigInitData,
//   transformAndValidateConfigData as cblConfigTransformData,
// } from './layers/p_cable';

import {coordsToLatLongMap} from '~utils/map.utils';

// possible events that can happen on map
export const PLANNING_EVENT = {
  addElement: 'A',
  editElement: 'E',
  showElementForm: 'F',
};

export const LayerKeyMappings = {
  [RegionKey]: {
    ViewLayer: RegionViewLayer,
  },
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
    [PLANNING_EVENT.showElementForm]: <DpForm />,
    ElementLayer: DpElement,
    ViewLayer: DPViewLayer,
    Geometry: DPGeometry,
    Icon: DpIcon,
    onMapClick: handleDpMapClick,
  },
  // [SplitterKey]: {
  //   [PLANNING_EVENT.addElement]: <SplitterAddLayer />,
  //   [PLANNING_EVENT.showElementForm]: <SplitterForm />,
  //   ViewLayer: SplitterLayer,
  //   Geometry: SplitterGeometry,
  //   Icon: SplitterGetIcon,
  //   ConfigFormTemplate: SplitterConfigFormTemplate,
  //   ConfigInitData: SplitterConfigInitData,
  //   configTransformData: spConfigTransformData,
  // },
  // [CableKey]: {
  //   [PLANNING_EVENT.addElement]: <CableAddLayer />,
  //   [PLANNING_EVENT.showElementForm]: <CableForm />,
  //   ViewLayer: CableLayer,
  //   Geometry: CableGeometry,
  //   Icon: CableGetIcon,
  //   ConfigFormTemplate: CableConfigFormTemplate,
  //   ConfigInitData: CableConfigInitData,
  //   configTransformData: cblConfigTransformData,
  // },
};

export const InfoLayerKeyMappings = {
  [DpKey]: {
    [PLANNING_EVENT.addElement]: <DPAddLayer />,
  },
};

export const covertLayerServerData = (layerKey, serverData) => {
  let resultData = cloneDeep(serverData) || [];

  // hard coded layers
  if (layerKey === RegionKey) {
    resultData.map(d => {
      // [ [lat, lng], ...] -> [{lat, lng}, ...]
      d.coordinates = coordsToLatLongMap(d.coordinates, true);
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
};
