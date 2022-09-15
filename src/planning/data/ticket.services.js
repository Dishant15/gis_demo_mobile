import Api from '~utils/api.utils';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  apiGetTicketWorkorderElements,
  apiPutTicketWorkorderEdit,
} from '~constants/url.constants';

export const fetchTicketWorkorderData = async ticketId => {
  const res = await Api.get(apiGetTicketWorkorderElements(ticketId));
  return res.data;
};

export const fetchTicketWorkorderDataThunk = createAsyncThunk(
  'planningGis/fetchTicketWorkorderData',
  fetchTicketWorkorderData,
);

// data: { status, remark }
export const updateTicketWorkOrder = async ({workOrderId, data}) => {
  const res = await Api.put(apiPutTicketWorkorderEdit(workOrderId), data);
  return res.data;
};
