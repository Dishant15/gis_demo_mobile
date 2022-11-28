import get from 'lodash/get';
import last from 'lodash/last';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';

import {
  circle,
  point,
  lineString,
  polygon,
  multiPolygon,
  booleanIntersects,
  distance,
} from '@turf/turf';

import {
  getLayerSelectedConfiguration,
  getSelectedLayerKeys,
} from './planningState.selectors';
import {
  handleLayerSelect,
  handleRegionSelect,
  selectConfiguration,
  setActiveTab,
  setLayerConfigurations,
} from './planningState.reducer';
import {fetchLayerDataThunk} from './actionBar.services';
import {
  resetTicketMapHighlight,
  resetUnselectedLayerGisData,
  setMapHighlight,
  setMapPosition,
  setMapState,
} from './planningGis.reducer';
import {
  generateElementUid,
  LayerKeyMappings,
  PLANNING_EVENT,
} from '~planning/GisMap/utils';
import {FEATURE_TYPES} from '~planning/GisMap/layers/common/configuration';
import {
  getAllLayersData,
  getPlanningMapStateEvent,
  getPlanningTicketData,
} from './planningGis.selectors';
import {
  coordsToLatLongMap,
  pointCoordsToLatLongMap,
  pointLatLongMapToCoords,
} from '~utils/map.utils';
import {screens} from '~constants/constants';

export const onRegionSelectionUpdate =
  updatedRegionIdList => (dispatch, getState) => {
    const storeState = getState();
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    // set selected regions
    dispatch(handleRegionSelect(updatedRegionIdList));
    // add region in selectedLayerKeys if not
    if (selectedLayerKeys.indexOf('region') === -1) {
      dispatch(handleLayerSelect('region'));
    }
    // fetch gis data for all region polygons
    dispatch(
      fetchLayerDataThunk({
        regionIdList: updatedRegionIdList,
        layerKey: 'region',
      }),
    );
    // re fetch data for each selected layers
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(
        fetchLayerDataThunk({
          regionIdList: updatedRegionIdList,
          layerKey: currLayerKey,
        }),
      );
    }
    dispatch(resetUnselectedLayerGisData(selectedLayerKeys));
  };

export const openElementDetails =
  ({layerKey, elementId}) =>
  dispatch => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: {elementId},
      }),
    );
  };

export const onPointShowOnMap =
  (center, elementId, layerKey, navigation) => dispatch => {
    // close form
    dispatch(setMapState({}));
    dispatch(
      setMapPosition({
        center: pointCoordsToLatLongMap(center),
        zoom: 16,
      }),
    );
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      }),
    );
    dispatch(resetTicketMapHighlight());
    navigation.navigate(screens.planningScreen);
  };

export const onPolygonShowOnMap =
  (coordinates, elementId, layerKey, navigation) => dispatch => {
    // close form
    dispatch(setMapState({}));
    dispatch(
      setMapPosition({
        coordinates: coordsToLatLongMap(coordinates),
      }),
    );
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      }),
    );
    dispatch(resetTicketMapHighlight());
    navigation.navigate(screens.planningScreen);
  };

export const onAssociatedElementShowOnMapClick =
  (element, layerKey, navigation) => dispatch => {
    const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(
          onPointShowOnMap(
            element.coordinates,
            element.id,
            layerKey,
            navigation,
          ),
        );
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(
          onPolygonShowOnMap(element.center, element.id, layerKey, navigation),
        );
        break;
      default:
        break;
    }
  };

// add geometry with optinal associations
export const onAddElementGeometry =
  ({layerKey, restriction_ids = null}) =>
  dispatch => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementGeometry,
        layerKey,
        data: {restriction_ids},
      }),
    );
    dispatch(setActiveTab(null));
  };

export const onAddElementDetails =
  ({layerKey, submitData, validationRes, extraParent, navigation}) =>
  (dispatch, getState) => {
    const initialData = get(LayerKeyMappings, [layerKey, 'initialElementData']);
    const storeState = getState();
    const selectedConfig = getLayerSelectedConfiguration(layerKey)(storeState);

    // generate ids
    let unique_id = generateElementUid(layerKey);
    let network_id = '';

    let region_list;
    // generate parent association data from parents res
    // shape: { layerKey : [{id, name, uid, netid}, ... ], ...]
    const parents = get(validationRes, 'data.parents', {});
    if (isEmpty(parents)) {
      // generate from region
      region_list = get(validationRes, 'data.region_list');
      // get region uid
      const reg_uid = !!size(region_list) ? last(region_list).unique_id : 'RGN';
      network_id = `${reg_uid}-${unique_id}`;
    } else {
      // generate network id from parent list, get first key
      const firstLayerKey = Object.keys(parents)[0];
      const parentNetId = get(
        parents,
        [firstLayerKey, '0', 'network_id'],
        'PNI',
      );
      network_id = `${parentNetId}-${unique_id}`;
    }
    // generate children association data from children res
    const children = get(validationRes, 'data.children', {});

    const getDependantFields = get(
      LayerKeyMappings,
      [layerKey, 'getDependantFields'],
      ({submitData}) => submitData,
    );
    submitData = getDependantFields({submitData, children, region_list});

    // add config id if layer is configurable
    const configuration = selectedConfig?.id;

    let mapStateData = {
      event: PLANNING_EVENT.addElementForm, // event for "layerForm"
      layerKey,
      data: {
        ...initialData,
        // submit data will have all geometry related fields submitted by AddGisMapLayer
        ...submitData,
        unique_id,
        network_id,
        association: {parents: merge(parents, extraParent), children},
        configuration,
      },
    };
    const ticketData = getPlanningTicketData(storeState);
    // assign new status as per ticket network_type
    if (ticketData?.network_type) {
      mapStateData.data['status'] = ticketData.network_type;
    }
    // complete current event -> fire next event
    dispatch(setMapState(mapStateData));
    navigation.navigate(screens.gisEventScreen);
  };

export const onFetchLayerListDetailsSuccess = layerConfData => dispatch => {
  // res shape same as layerConfigs bellow
  if (!!size(layerConfData)) {
    for (let lc_ind = 0; lc_ind < layerConfData.length; lc_ind++) {
      const {layer_key, is_configurable, configuration} = layerConfData[lc_ind];
      if (is_configurable) {
        // if layerConfData is there set layer configs in redux
        dispatch(
          setLayerConfigurations({
            layerKey: layer_key,
            configurationList: configuration,
          }),
        );
        // select default configs to show first
        dispatch(
          selectConfiguration({
            layerKey: layer_key,
            configuration: configuration[0],
          }),
        );
      }
    }
  }
};

export const onGisMapClick =
  (clickLatLong, navigation) => (dispatch, getState) => {
    const storeState = getState();
    const mapStateEvent = getPlanningMapStateEvent(storeState);
    const layerData = getAllLayersData(storeState);

    if (mapStateEvent === PLANNING_EVENT.selectElementsOnMapClick) {
      // if ths is select elements event get list of elements around user click
      const clickPoint = pointLatLongMapToCoords(clickLatLong);
      // create a circle at user click location
      const circPoly = circle(clickPoint, 0.01, {
        steps: 10,
        units: 'kilometers',
      });
      const elementResultList = [];
      // loop over layerData
      const layerKeyList = Object.keys(layerData);
      // check intersects
      for (let lkInd = 0; lkInd < layerKeyList.length; lkInd++) {
        const currLayerKey = layerKeyList[lkInd];

        if (currLayerKey === 'region') continue;
        const currLayerData = layerData[currLayerKey];
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
          const isIntersecting = booleanIntersects(circPoly, turfGeom);
          // add to list if intersect true
          if (isIntersecting) {
            elementResultList.push({
              ...element,
              layerKey: currLayerKey,
            });
          }
        }
      }
      const filterCoords = coordsToLatLongMap(circPoly.geometry.coordinates[0]);
      // fire next event : listElementsOnMap, with new list data
      dispatch(
        listElementsOnMap({elementList: elementResultList, filterCoords}),
      );
      navigation.navigate(screens.gisEventScreen);
    }
  };

export const listElementsOnMap =
  ({elementList, filterCoords}) =>
  dispatch => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.listElementsOnMap,
        data: {elementList, filterCoords},
      }),
    );
  };

export const onElementListItemClick =
  (elementId, layerKey, navigation) => dispatch => {
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      }),
    );
    dispatch(resetTicketMapHighlight());
    navigation.navigate(screens.planningScreen);
  };
