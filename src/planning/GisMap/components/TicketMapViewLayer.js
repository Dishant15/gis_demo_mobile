import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';

import {Polyline, Polygon, Marker} from 'react-native-maps';
import MapMarker from '~Common/components/Map/MapMarker';
import HighlightedPolyline from '~Common/components/Map/HighlightedPolyline';

import {getPlanningTicketData} from '~planning/data/planningGis.selectors';

import {LayerKeyMappings} from '../utils';
import {FEATURE_TYPES, zIndexMapping} from '../layers/common/configuration';

const HIGHLIGHT_COLOR = '#446eca';

const TicketMapViewLayer = () => {
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
          const {id, layer_key, element, hidden, highlighted} = workOrder;
          if (hidden) return null;
          if (element.id) {
            const featureType = LayerKeyMappings[layer_key]['featureType'];
            const viewOptions =
              LayerKeyMappings[layer_key]['getViewOptions'](element);

            switch (featureType) {
              case FEATURE_TYPES.POINT:
                return (
                  <MapMarker
                    key={id}
                    {...element}
                    {...viewOptions}
                    coordinate={element.coordinates}
                    zIndex={zIndexMapping[layer_key]}>
                    <viewOptions.icon />
                  </MapMarker>
                );

              case FEATURE_TYPES.POLYGON:
                return (
                  <Fragment key={id}>
                    <Polygon
                      {...element}
                      {...viewOptions}
                      {...(highlighted
                        ? {
                            strokeOpacity: 0,
                            strokeWeight: 0,
                          }
                        : {})}
                      zIndex={
                        highlighted
                          ? zIndexMapping.highlighted
                          : zIndexMapping[layer_key]
                      }
                    />
                    {highlighted ? (
                      <HighlightedPolyline
                        coordinates={element.coordinates}
                        zIndex={zIndexMapping.highlighted}
                        strokeColor={HIGHLIGHT_COLOR}
                      />
                    ) : null}
                  </Fragment>
                );

              case FEATURE_TYPES.POLYLINE: {
                if (highlighted) {
                  return (
                    <HighlightedPolyline
                      key={id}
                      coordinates={element.coordinates}
                      zIndex={zIndexMapping.highlighted}
                      strokeColor={HIGHLIGHT_COLOR}
                    />
                  );
                } else {
                  return (
                    <Polyline
                      key={id}
                      {...element}
                      {...viewOptions}
                      zIndex={zIndexMapping[layer_key]}
                    />
                  );
                }
              }
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

export default TicketMapViewLayer;
