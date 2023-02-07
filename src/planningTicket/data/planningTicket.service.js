import {getApiSurveyTicketWoList} from '~constants/url.constants';
import Api from '~utils/api.utils';

export const fetchTicketWoList = async ({queryKey}) => {
  const [_key, ticketId] = queryKey;
  const res = await Api.get(getApiSurveyTicketWoList(ticketId));
  return res.data;
};
