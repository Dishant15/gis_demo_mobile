import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import get from 'lodash/get';

import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';
import ShowAssociatedElements from '~planning/GisMap/components/ShowAssociatedElements';
import ElementList from '~planning/GisMap/components/ElementList';

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
      return <ElementDetailsTable layerKey={layerKey} />;
    case PLANNING_EVENT.showAssociatedElements:
      return <ShowAssociatedElements />;
    case PLANNING_EVENT.listElementsOnMap:
      return <ElementList />;
    default:
      return null;
  }
};

export default memo(GisEventScreen);
