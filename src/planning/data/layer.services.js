import Api from '~utils/api.utils';
import {
  apiPostAddElement,
  apiPostAddTicketWorkorder,
} from '~constants/url.constants';

export const addNewElement = async ({data, layerKey}) => {
  const res = await Api.post(apiPostAddElement(layerKey), data);
  return res.data;
};

export const addNewTicketWorkorder = async ({data, ticketId}) => {
  console.log(
    '🚀 ~ file: layer.services.js ~ line 13 ~ addNewTicketWorkorder ~ data',
    data,
    ticketId,
  );
  const res = await Api.post(apiPostAddTicketWorkorder(ticketId), data);
  console.log(
    '🚀 ~ file: layer.services.js ~ line 15 ~ addNewTicketWorkorder ~ res',
    res,
  );
  return res.data;
};
