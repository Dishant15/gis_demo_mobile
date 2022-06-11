import Api from '~utils/api.utils';
import {apiGetTicketWorkorders} from '~constants/url.constants';

export const fetchTicketWorkorders = async ({queryKey}) => {
  const [_key, ticketId] = queryKey;
  const res = await Api.get(apiGetTicketWorkorders(ticketId));
  return res.data;
};
