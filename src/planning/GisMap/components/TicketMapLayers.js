import React from 'react';
import {useSelector} from 'react-redux';
import {getPlanningTicketData} from '~planning/data/planningGis.selectors';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';
import {LayerKeyMappings} from '../utils';

const TicketMapLayers = () => {
  const ticketId = useSelector(getSelectedPlanningTicket);
  const {work_orders = [], isHidden} = useSelector(getPlanningTicketData);

  if (ticketId && !isHidden) {
    return work_orders.map(workOrder => {
      const {id, layer_key, element} = workOrder;
      if (element.id) {
        const GeometryComponent = LayerKeyMappings[layer_key]['Geometry'];
        return <GeometryComponent key={id} {...element} />;
      }
    });
  }
  return null;
};

export default TicketMapLayers;
