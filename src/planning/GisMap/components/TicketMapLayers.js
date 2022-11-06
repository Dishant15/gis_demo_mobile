import React from 'react';
import {useSelector} from 'react-redux';

import {Polygon} from 'react-native-maps';

import {getPlanningTicketData} from '~planning/data/planningGis.selectors';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';

import {LayerKeyMappings} from '../utils';

const TicketMapLayers = () => {
  const ticketId = useSelector(getSelectedPlanningTicket);
  const {
    work_orders = [],
    area_pocket,
    isHidden,
  } = useSelector(getPlanningTicketData);

  if (ticketId && !isHidden) {
    return (
      <>
        {!!area_pocket?.coordinates ? (
          <Polygon
            coordinates={area_pocket.coordinates}
            strokeWidth={2}
            strokeColor="#88B14BCC"
            fillColor="#88B14B4D"
          />
        ) : null}
        {work_orders.map(workOrder => {
          const {id, layer_key, element} = workOrder;
          if (element.id) {
            const GeometryComponent = LayerKeyMappings[layer_key]['Geometry'];
            return <GeometryComponent key={id} {...element} />;
          }
        })}
      </>
    );
  }

  return null;
};

export default TicketMapLayers;
