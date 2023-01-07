import React from 'react';
import {useSelector} from 'react-redux';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings} from '../utils';

/**
 * Parent
 *  GisMap
 *
 * Renders
 *  {LayerKey} -> AddLayer (export from layers folder) -> AddMarkerLayer | AddPolygonLayer
 */
export const LayerEventComponent = React.memo(() => {
  const mapState = useSelector(getPlanningMapState);

  if (!!mapState.event) {
    return LayerKeyMappings[mapState.layerKey][mapState.event];
  }
  return null;
});
