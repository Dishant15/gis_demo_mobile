import {screens} from '~constants/constants';
import {
  setTicketId,
  setTicketWorkOrderId,
} from '~planning/data/planningGis.reducer';

export const onTicketClick = (navigation, ticketId) => dispatch => {
  // set ticket id and reset workorder
  dispatch(setTicketId(ticketId));
  dispatch(setTicketWorkOrderId(null));
  navigation.navigate(screens.planningTicketWorkorder, {ticketId});
};
