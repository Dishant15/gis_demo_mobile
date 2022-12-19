import Api from '~utils/api.utils';
import {
  apiGetDashboardData,
  apiGetTicketList,
  apiGetVersion,
} from '~constants/url.constants';

export const fetchTicketList = async () => {
  const res = await Api.get(apiGetTicketList());
  return res.data;
};

export const fetchDashboardData = async () => {
  const res = await Api.get(apiGetDashboardData());
  return res.data;
};

export const fetchVersionData = async () => {
  const res = await Api.get(apiGetVersion());
  return res.data;
};
