import React from 'react';
import {useSelector} from 'react-redux';
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
        {/* <Polygon
        path={area_pocket.coordinates}
        options={{
          strokeColor: "#88B14B",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#88B14B",
          fillOpacity: 0.3,
          clickable: false,
          draggable: false,
          editable: false,
          zIndex: 1,
        }}
      /> */}
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
