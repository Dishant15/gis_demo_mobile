import Api from '~utils/api.utils';
import {
  apiGetElementDetails,
  apiPostAddElement,
  apiPostAddTicketWorkorder,
  apiPutEditElement,
  apiPutTicketWorkorderElementEdit,
} from '~constants/url.constants';

export const addNewElement = async ({data, layerKey}) => {
  const res = await Api.post(apiPostAddElement(layerKey), data);
  return res.data;
};

export const editElementDetails = async ({data, layerKey, elementId}) => {
  const res = await Api.put(apiPutEditElement(layerKey, elementId), data);
  return res.data;
};

export const addNewTicketWorkorder = async ({data, ticketId}) => {
  const res = await Api.post(apiPostAddTicketWorkorder(ticketId), data);
  return res.data;
};

export const editTicketWorkorderElement = async ({data, workOrderId}) => {
  const res = await Api.put(
    apiPutTicketWorkorderElementEdit(workOrderId),
    data,
  );
  return res.data;
};

export const fetchElementDetails = async ({queryKey}) => {
  const [_key, layerKey, elementId] = queryKey;
  const res = await Api.get(apiGetElementDetails(layerKey, elementId));
  return res.data;
};
