import {
  setMapPosition,
  setMapState,
  setTicketWorkOrderId,
  unHideElement,
} from './planningGis.reducer';
import {
  getPlanningMapStateData,
  getPlanningMapStateEvent,
  getPlanningTicketData,
  getPlanningTicketId,
} from './planningGis.selectors';
import {handleLayerSelect} from './planningState.reducer';
import {getSelectedRegionIds} from './planningState.selectors';

import get from 'lodash/get';
import size from 'lodash/size';

import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {fetchLayerDataThunk} from './actionBar.services';
import {fetchTicketWorkorderDataThunk} from './ticket.services';
import {FEATURE_TYPES} from '~planning/GisMap/layers/common/configuration';
import {screens} from '~constants/constants';
import {coordsToLatLongMap, pointCoordsToLatLongMap} from '~utils/map.utils';

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

// clicked from ticket WO screen
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
  navigation.navigate(screens.planningStack);
};

export const onElementUpdate = layerKey => (dispatch, getState) => {
  const storeState = getState();
  const selectedRegionIds = getSelectedRegionIds(storeState);
  const {elementId} = getPlanningMapStateData(storeState);
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
  dispatch(
    unHideElement({
      layerKey,
      elementId,
      isTicket: !!ticketId,
    }),
  );
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

export const goBackFromGisEventScreen = navigation => () => {
  navigation.goBack();
};

export const goBackFromPlanningScreen = navigation => (dispatch, getState) => {
  const storeState = getState();
  const ticketId = getPlanningTicketId(storeState);

  if (ticketId) {
    dispatch(setTicketWorkOrderId(null));
    navigation.navigate(screens.planningTicketWorkorder, {ticketId});
  } else {
    navigation.navigate(screens.dashboardScreen);
  }
};

export const showAssociatiationList =
  ({layerKey, elementId}) =>
  dispatch => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showAssociatedElements,
        layerKey,
        data: {elementId},
      }),
    );
  };

export const selectElementsOnMapClick = (dispatch, getState) => {
  const event = getPlanningMapStateEvent(getState());

  if (event === PLANNING_EVENT.selectElementsOnMapClick) {
    // reset event
    dispatch(setMapState({}));
  } else {
    // start event
    dispatch(
      setMapState({
        event: PLANNING_EVENT.selectElementsOnMapClick,
      }),
    );
  }
};
