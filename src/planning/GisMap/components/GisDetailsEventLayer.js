import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import ElementDetailsTable from './ElementDetailsTable';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {PLANNING_EVENT} from '../utils';

const GisDetailsEventLayer = () => {
  const {layerKey, event} = useSelector(getPlanningMapState);
  switch (event) {
    case PLANNING_EVENT.addElementForm:
      return null;
    case PLANNING_EVENT.editElementForm:
      return null;
    case PLANNING_EVENT.showElementDetails:
      // LookupError: App 'gis_layer' doesn't have a 'region' model.
      if (layerKey === 'region') return null;
      return <ElementDetailsTable layerKey={layerKey} />;

    default:
      return null;
  }
};

export default memo(GisDetailsEventLayer);
