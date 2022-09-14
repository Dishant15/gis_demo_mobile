import React from 'react';
import {useSelector} from 'react-redux';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings} from '../utils';

/**
 * Show add edit popups with submit / cancel handlers
 * Change map state with DrawingManager
 * handle refs to new created and Edited featurs of map
 *
 * Set coordinates in formData once complete is clicked
 * Update map state in reducer once current event ends
 * Reset mapState once cancel in clicked
 *
 * Parent
 *  GisMap
 *
 * Renders
 *  {LayerKey} -> AddLayer (export from layers folder) -> AddMarkerLayer | AddPolygonLayer
 */
const GisMapEventLayer = React.memo(() => {
  const mapState = useSelector(getPlanningMapState);

  if (!!mapState.event) {
    return LayerKeyMappings[mapState.layerKey][mapState.event];
  }
  return null;
});

/**
 * render marker / polygon / polyline based on layer key and event on google map
 * should be direct child of map component
 *
 * Renders
 *  {LayerKey} -> ElementLayer (export from layers folder)
 */
export const GisMapElementLayer = React.memo(() => {
  const mapState = useSelector(getPlanningMapState);

  if (!!mapState.event) {
    const ElementComp = LayerKeyMappings[mapState.layerKey]['ElementLayer'];
    return <ElementComp key={mapState.layerKey} />;
  }
  return null;
});

export default GisMapEventLayer;
