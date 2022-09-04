import React from 'react';
import {useSelector} from 'react-redux';

import MapView, {Polygon} from 'react-native-maps';

import {getFillColor} from '~utils/map.utils';
import {getLayerViewData} from '~planning/data/planningGis.selectors';

export const LAYER_KEY = 'region';

export const ViewLayer = () => {
  /**
   * Parent:
   *  GisMap > utils > getLayerCompFromKey
   */
  // get data of region layer
  const regionData = useSelector(getLayerViewData(LAYER_KEY));
  const regionList = regionData.viewData;

  return (
    <>
      {regionList.map(reg => {
        const {id, coordinates, layer} = reg;
        const color = getFillColor(layer);

        const multiPolygons = coordinates.map((polyCoord, ind) => {
          return (
            <Polygon
              key={ind}
              options={{
                fillOpacity: 0,
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                draggable: false,
                editable: false,
                geodesic: false,
                zIndex: 1,
              }}
              paths={polyCoord}
            />
          );
        });

        return <React.Fragment key={id}>{multiPolygons}</React.Fragment>;
      })}
    </>
  );
};
