import {
  point,
  lineString,
  polygon,
  multiPolygon,
  booleanIntersects,
} from '@turf/turf';
import indexOf from 'lodash/indexOf';
import size from 'lodash/size';

import {FEATURE_TYPES} from '~planning/GisMap/layers/common/configuration';
import {LayerKeyMappings} from '~planning/GisMap/utils';

export const filterGisDataByPolygon = ({
  filterPolygon,
  gisData,
  whiteList = [],
  blackList = [],
  groupByLayerKey = false,
}) => {
  const elementResultList = [];
  // user this if groupByLayerKey true, will return same data as input gisData but filtered
  const elementGroupResult = {};
  // loop over layerData
  const layerKeyList = Object.keys(gisData);
  // check intersects
  for (let lkInd = 0; lkInd < layerKeyList.length; lkInd++) {
    const currLayerKey = layerKeyList[lkInd];
    elementGroupResult[currLayerKey] = [];

    // don't filter if not in whitelist
    if (size(whiteList) && indexOf(whiteList, currLayerKey) === -1) continue;
    // don't filter if in blackList
    if (size(blackList) && indexOf(blackList, currLayerKey) !== -1) continue;
    const currLayerData = gisData[currLayerKey];
    const featureType = LayerKeyMappings[currLayerKey]['featureType'];

    for (let elemInd = 0; elemInd < currLayerData.length; elemInd++) {
      const element = currLayerData[elemInd];
      // create turf geom for each element
      let turfGeom;
      if (featureType === FEATURE_TYPES.POINT) {
        turfGeom = point(element.geometry);
      } else if (featureType === FEATURE_TYPES.POLYLINE) {
        turfGeom = lineString(element.geometry);
      } else if (featureType === FEATURE_TYPES.POLYGON) {
        turfGeom = polygon([element.geometry]);
      } else {
        // multi polygon
        turfGeom = multiPolygon(element.geometry);
      }
      // check intersects
      const isIntersecting = booleanIntersects(filterPolygon, turfGeom);
      // add to list if intersect true
      if (isIntersecting) {
        // generate {layerKey: [...filteredElements], ...} shape of data
        if (groupByLayerKey) {
          elementGroupResult[currLayerKey].push({
            ...element,
            layerKey: currLayerKey,
          });
        } else {
          // simple list of elements : [...filteredElements]
          elementResultList.push({
            ...element,
            layerKey: currLayerKey,
          });
        }
      }
    }
  }

  return groupByLayerKey ? elementGroupResult : elementResultList;
};
