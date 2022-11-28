import React from 'react';
import {useSelector} from 'react-redux';
import {Polygon} from 'react-native-maps';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {PLANNING_EVENT} from '../utils';
import {zIndexMapping} from '../layers/common/configuration';
import {percentToHex} from '~utils/app.utils';

const GisMapSpecialLayer = () => {
  const {event, data} = useSelector(getPlanningMapState);

  if (event === PLANNING_EVENT.listElementsOnMap) {
    return (
      <Polygon
        strokeColor="#FFFF00"
        fillColor={'#FFFF00' + percentToHex(30)}
        strokeWidth={2}
        coordinates={data.filterCoords}
        zIndex={zIndexMapping.highlighted}
      />
    );
  } else {
    return null;
  }
};

export default GisMapSpecialLayer;
