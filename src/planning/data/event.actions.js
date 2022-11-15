import {screens} from '~constants/constants';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {setMapState, setTicketWorkOrderId} from './planningGis.reducer';
import {setActiveTab} from './planningState.reducer';

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

export const navigateEventScreenToMap = (data, navigation) => dispatch => {
  dispatch(setMapState(data));
  navigation.navigate(screens.planningScreen);
};

export const onElementGeometryEdit = (data, navigation) => dispatch => {
  dispatch(setMapState(data));
  navigation.navigate(screens.gisEventScreen);
};

/**
 * click on layer tab -> layer -> element
 * close tab, set layer element id, navigate to event screen
 */
export const onLayerElementClick = (data, navigation) => dispatch => {
  dispatch(setActiveTab(null));
  dispatch(setMapState(data));
  navigation.navigate(screens.gisEventScreen);
};

export const onViewMapClick = navigation => dispatch => {
  dispatch(setMapState({}));
  navigation.navigate(screens.planningTicketMap);
};
