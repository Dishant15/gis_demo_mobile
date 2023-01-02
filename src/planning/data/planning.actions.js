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
  getLayerViewData,
  getPlanningMapStateEvent,
  getPlanningTicketData,
} from './planningGis.selectors';
import {
  coordsToLatLongMap,
  pointCoordsToLatLongMap,
  pointLatLongMapToCoords,
} from '~utils/map.utils';
import {screens} from '~constants/constants';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {filterGisDataByPolygon} from './planning.utils';

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
    if (navigation) {
      navigation.navigate(screens.gisEventScreen);
    }
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
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    if (mapStateEvent === PLANNING_EVENT.selectElementsOnMapClick) {
      // if ths is select elements event get list of elements around user click
      const clickPoint = pointLatLongMapToCoords(clickLatLong);
      // create a circle at user click location
      const circPoly = circle(clickPoint, 0.01, {
        steps: 10,
        units: 'kilometers',
      });

      const elementResultList = filterGisDataByPolygon({
        filterPolygon: circPoly,
        gisData: layerData,
        whiteList: selectedLayerKeys,
        blackList: ['region'],
      });

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

export const onWorkOrderListItemClick =
  (elementId, layerKey, navigation) => dispatch => {
    dispatch(
      setMapHighlight({
        layerKey,
        elementId,
      }),
    );
    dispatch(resetTicketMapHighlight());
    navigation.navigate(screens.planningStack);
  };

export const onElementAddConnectionEvent =
  ({layerKey, elementId, elementGeometry}) =>
  (dispatch, getState) => {
    const storeState = getState();
    // check if cable layer is selected in layers tab
    const selectedLayerKeys = getSelectedLayerKeys(storeState);
    if (selectedLayerKeys.indexOf('p_cable') === -1) {
      // dispatch error notification if not
      showToast(
        'Please select Cable layer, Cable layer needs to be selected to add connections',
        TOAST_TYPE.SUCCESS,
      );
      return;
    }
    let resultCableList = [];
    // if point element
    const elementPoint = point(elementGeometry);
    // create a circle around element
    const circPoly = circle(elementGeometry, 0.01, {
      steps: 10,
      units: 'kilometers',
    });
    // get all cables intersecting that polygon
    const cableList = getLayerViewData('p_cable')(storeState);
    for (let c_ind = 0; c_ind < cableList.length; c_ind++) {
      const c_cable = cableList[c_ind];
      const isIntersecting = booleanIntersects(
        circPoly,
        lineString(c_cable.geometry),
      );
      if (isIntersecting) {
        // calculate which end of this cable is nearest to current point
        const Aend = c_cable.geometry[0];
        const Bend = c_cable.geometry[c_cable.geometry.length - 1];

        const distanceA = distance(elementPoint, point(Aend));
        const distanceB = distance(elementPoint, point(Bend));
        const cable_end = distanceA > distanceB ? 'B' : 'A';
        // add list of cables into data of current element, with cable end marker
        resultCableList.push({...c_cable, cable_end, layerKey: 'p_cable'});
      }
    }
    // dispatch addElementConection
    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementConnection,
        layerKey,
        data: {
          elementList: resultCableList,
          elementId,
          layerKey,
        },
      }),
    );
  };
