import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import get from 'lodash/get';

import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';

const GisEventScreen = props => {
  const {layerKey, event} = useSelector(getPlanningMapState);

  switch (event) {
    case PLANNING_EVENT.addElementForm:
      const OverrideAddForm = get(LayerKeyMappings, [
        layerKey,
        PLANNING_EVENT.addElementForm,
      ]);

      if (!!OverrideAddForm) return <OverrideAddForm />;
      return <GisLayerForm layerKey={layerKey} />;

    case PLANNING_EVENT.editElementForm:
      const OverrideEditForm = get(LayerKeyMappings, [
        layerKey,
        PLANNING_EVENT.addElementForm,
      ]);

      if (!!OverrideEditForm) return <OverrideEditForm />;
      return <GisLayerForm layerKey={layerKey} />;

    case PLANNING_EVENT.showElementDetails:
      // LookupError: App 'gis_layer' doesn't have a 'region' model.
      if (layerKey === 'region') return null;
      return <ElementDetailsTable layerKey={layerKey} />;

    default:
      return null;
  }
};

export default memo(GisEventScreen);