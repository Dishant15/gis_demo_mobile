import Api from '~utils/api.utils';
import {
  apiGetDashboardData,
  apiGetDashboardSurveyTicketSummery,
  apiGetHealthCheck,
  apiGetTicketList,
  apiGetVersion,
} from '~constants/url.constants';

export const fetchTicketList = async ({queryKey}) => {
  const [_key, ticketType] = queryKey;
  const res = await Api.get(apiGetTicketList(), {
    assignee: 1,
    ticket_type: ticketType,
    status: 'A',
  });
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

export const fetchDashSurveySummery = async () => {
  const res = await Api.get(apiGetDashboardSurveyTicketSummery());
  return res.data;
};

export const fetchHealthCheck = async () => {
  const res = await Api.get(apiGetHealthCheck());
  return res.data;
};
