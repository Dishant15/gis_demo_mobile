import {
  setMapPosition,
  setMapState,
  setTicketWorkOrderId,
} from './planningGis.reducer';
import {getPlanningTicketData} from './planningGis.selectors';
import {handleLayerSelect, setActiveTab} from './planningState.reducer';
import {getSelectedRegionIds} from './planningState.selectors';

import get from 'lodash/get';
import last from 'lodash/last';
import size from 'lodash/size';

import {
  PLANNING_EVENT,
  LayerKeyMappings,
  generateElementUid,
} from '~planning/GisMap/utils';
import {fetchLayerDataThunk} from './actionBar.services';
import {fetchTicketWorkorderDataThunk} from './ticket.services';
import {screens} from '~constants/constants';
import {coordsToLatLongMap, pointCoordsToLatLongMap} from '~utils/map.utils';
import {FEATURE_TYPES} from '~planning/GisMap/layers/common/configuration';

export const navigateTicketWorkorderToDetails =
  (item, navigation) => dispatch => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey: item.layer_key,
        data: {elementId: item.element.id},
      }),
    );
    dispatch(setTicketWorkOrderId(item.id));
    navigation.navigate(screens.gisEventScreen);
  };

export const onEditElementGeometry =
  (data, featureType, navigation) => dispatch => {
    dispatch(setMapState(data));
    if (featureType === FEATURE_TYPES.POINT) {
      dispatch(
        setMapPosition({
          center: data.geometry,
          zoom: 16,
        }),
      );
    } else {
      dispatch(
        setMapPosition({
          coordinates: data.geometry,
        }),
      );
    }
    navigation.navigate(screens.planningScreen);
  };

export const onAddElementDetails =
  ({layerKey, submitData, validationRes, navigation}) =>
  dispatch => {
    const initialData = get(LayerKeyMappings, [layerKey, 'initialElementData']);
    const region_list = get(validationRes, 'data.region_list');
    // get region uid
    const reg_uid = !!size(region_list) ? last(region_list).unique_id : 'RGN';
    const element_uid = generateElementUid(layerKey);

    dispatch(
      setMapState({
        event: PLANNING_EVENT.addElementForm, // event for "layerForm"
        layerKey,
        data: {
          ...initialData,
          // submit data will have all geometry related fields submitted by AddGisMapLayer
          ...submitData,
          unique_id: element_uid,
          network_id: `${reg_uid}-${element_uid}`,
        },
      }),
    );
    navigation.navigate(screens.gisEventScreen);
  };

/**
 * click on layer tab -> layer -> element
 * close tab, set layer element id, navigate to event screen
 */
export const openElementDetails =
  (layerKey, elementId, navigation) => dispatch => {
    dispatch(setActiveTab(null));
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: {elementId},
      }),
    );
    navigation.navigate(screens.gisEventScreen);
  };

export const onViewMapClick = navigation => (dispatch, getState) => {
  const storeState = getState();
  const ticketData = getPlanningTicketData(storeState);
  const ticketArea = get(ticketData, 'area_pocket.coordinates', null);
  if (ticketArea) {
    dispatch(
      setMapPosition({
        coordinates: ticketArea,
      }),
    );
  }
  dispatch(setMapState({}));
  navigation.navigate(screens.planningTicketMap);
};

export const onElementUpdate = layerKey => (dispatch, getState) => {
  const storeState = getState();
  const selectedRegionIds = getSelectedRegionIds(storeState);
  const ticketData = getPlanningTicketData(storeState);
  const ticketId = get(ticketData, 'id');

  // close form
  dispatch(setMapState({}));
  // fetch ticket details if user come from ticket screen
  if (ticketId) {
    dispatch(fetchTicketWorkorderDataThunk(ticketId));
  } else {
    // otherwise select layer
    dispatch(handleLayerSelect(layerKey));
    // refetch layer
    if (size(selectedRegionIds)) {
      dispatch(
        fetchLayerDataThunk({
          regionIdList: selectedRegionIds,
          layerKey,
        }),
      );
    }
  }
};

export const onShowMarkerOnMapPress = (center, navigation) => dispatch => {
  // close form
  dispatch(setMapState({}));
  dispatch(
    setMapPosition({
      center: pointCoordsToLatLongMap(center),
      zoom: 16,
    }),
  );
  navigation.navigate(screens.planningScreen);
};

// polygon, polyline
export const onShowAreaOnMapPress = (coordinates, navigation) => dispatch => {
  // close form
  dispatch(setMapState({}));
  dispatch(
    setMapPosition({
      coordinates: coordsToLatLongMap(coordinates),
    }),
  );
  navigation.navigate(screens.planningScreen);
};
