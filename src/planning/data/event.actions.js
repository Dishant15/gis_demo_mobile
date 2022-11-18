import {screens} from '~constants/constants';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {setMapState, setTicketWorkOrderId} from './planningGis.reducer';
import {getPlanningTicketData} from './planningGis.selectors';
import {handleLayerSelect, setActiveTab} from './planningState.reducer';
import {getSelectedRegionIds} from './planningState.selectors';

import get from 'lodash/get';
import size from 'lodash/size';

import {fetchLayerDataThunk} from './actionBar.services';
import {fetchTicketWorkorderDataThunk} from './ticket.services';

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
