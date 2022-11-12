import {screens} from '~constants/constants';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {setMapState, setTicketWorkOrderId} from './planningGis.reducer';

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
    navigation.navigate(screens.planningTicketDetails);
  };
