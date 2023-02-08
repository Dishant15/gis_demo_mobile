import Api from '~utils/api.utils';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  apiGetSurveyWoDetails,
  apiGetTicketDetails,
  apiGetTicketWorkorderElements,
  apiPutTicketWorkorderEdit,
  getApiSurveyTicketWoList,
} from '~constants/url.constants';
import {get} from 'lodash';

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

// survey ticket wo list
const fetchSurveyTicketWorkorderData = async ticketId => {
  const res = await Api.get(getApiSurveyTicketWoList(ticketId));
  return res.data;
};

export const fetchSurveyTicketWorkorderDataThunk = createAsyncThunk(
  'planningGis/fetchSurveyTicketWorkorderData',
  fetchSurveyTicketWorkorderData,
);

const fetchTicketDetails = async ticketId => {
  const res = await Api.get(apiGetTicketDetails(ticketId));
  return res.data;
};

export const fetchTicketDetailsThunk = createAsyncThunk(
  'planningGis/fetchTicketDetails',
  fetchTicketDetails,
);

const fetchSurveyWoDetails = async (
  {layerKey, elementId},
  {rejectWithValue},
) => {
  try {
    const res = await Api.get(apiGetSurveyWoDetails(layerKey, elementId));
    return res.data;
  } catch (error) {
    return rejectWithValue(get(error, 'response.status'));
  }
};

export const fetchSurveyWoDetailsThunk = createAsyncThunk(
  'planningGis/fetchSurveyWoDetails',
  fetchSurveyWoDetails,
);
