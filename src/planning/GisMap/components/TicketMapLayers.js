import React from 'react';
import {useSelector} from 'react-redux';

import {Polyline, Polygon, Marker} from 'react-native-maps';

import {getPlanningTicketData} from '~planning/data/planningGis.selectors';

import {LayerKeyMappings} from '../utils';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';

const TicketMapLayers = () => {
  const {
    id: ticketId,
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
            const featureType = LayerKeyMappings[layer_key]['featureType'];
            const viewOptions =
              LayerKeyMappings[layer_key]['getViewOptions'](element);

            switch (featureType) {
              case FEATURE_TYPES.POINT:
                return (
                  <Marker
                    key={id}
                    {...element}
                    {...viewOptions}
                    coordinate={element.coordinates}
                    zIndex={zIndexMapping[layer_key]}>
                    <viewOptions.icon />
                  </Marker>
                );

              case FEATURE_TYPES.POLYGON:
                return (
                  <Polygon
                    key={id}
                    {...element}
                    {...viewOptions}
                    zIndex={zIndexMapping[layer_key]}
                  />
                );

              case FEATURE_TYPES.POLYLINE:
                return (
                  <Polyline
                    key={id}
                    {...element}
                    {...viewOptions}
                    zIndex={zIndexMapping[layer_key]}
                  />
                );
              default:
                return null;
            }
          }
        })}
      </>
    );
  }

  return null;
};

export default TicketMapLayers;
