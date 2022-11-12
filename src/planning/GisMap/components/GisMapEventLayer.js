import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {PLANNING_EVENT} from '../utils';

const GisMapEventLayer = () => {
  const {layerKey, event} = useSelector(getPlanningMapState);

  switch (event) {
    case PLANNING_EVENT.addElementGeometry:
      return null;
    case PLANNING_EVENT.editElementGeometry:
      return null;
    default:
      return null;
  }
};

export default memo(GisMapEventLayer);
