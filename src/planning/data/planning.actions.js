import get from 'lodash/get';

import {getSelectedLayerKeys} from './planningState.selectors';
import {
  handleLayerSelect,
  handleRegionSelect,
  setActiveTab,
} from './planningState.reducer';
import {fetchLayerDataThunk} from './actionBar.services';
import {
  resetTicketMapHighlight,
  resetUnselectedLayerGisData,
  setMapHighlight,
  setMapPosition,
  setMapState,
} from './planningGis.reducer';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {FEATURE_TYPES} from '~planning/GisMap/layers/common/configuration';
import {coordsToLatLongMap, pointCoordsToLatLongMap} from '~utils/map.utils';
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
