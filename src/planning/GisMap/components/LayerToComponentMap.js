import {get} from 'lodash';
import React from 'react';
import {useSelector} from 'react-redux';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {LayerKeyGisMapping, LayerKeyMappings, PLANNING_EVENT} from '../utils';

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

/**
 * render gis based layers on GisMap as events are fired
 *
 * Renders
 *  {LayerKey} -> covert event -> LayerKeyMapping -> LayerBased Gis component
 */
export const LayerGisEventComponent = React.memo(() => {
  const mapState = useSelector(getPlanningMapState);

  if (!!mapState.event) {
    // May not handle updates for all events so handle null events
    const ElementComp = get(
      LayerKeyGisMapping,
      `${mapState.layerKey}.${mapState.event}`,
      null,
    );
    if (ElementComp) return <ElementComp key={mapState.layerKey} />;
  }
  return null;
});
