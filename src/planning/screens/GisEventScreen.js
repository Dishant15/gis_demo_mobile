import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import get from 'lodash/get';

import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';
import ShowAssociatedElements from '~planning/GisMap/components/ShowAssociatedElements';
import ElementList from '~planning/GisMap/components/ElementList';
import ListElementConnections from '~planning/GisMap/layers/common/ListElementConnections';
import AddElementConnection from '~planning/GisMap/layers/common/AddElementConnection';
import ShowPossibleAddAssociation from '~planning/GisMap/components/ShowPossibleAddAssociation';
import ElementPortDetails from '~planning/GisMap/components/ElementPortDetails';
import LayerElementList from '~planning/GisMap/components/LayerElementList';

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

    case PLANNING_EVENT.showPossibleAddAssociatiation:
      return <ShowPossibleAddAssociation />;

    case PLANNING_EVENT.listElementsOnMap:
      return <ElementList />;

    case PLANNING_EVENT.layerElementsOnMap:
      return <LayerElementList />;

    case PLANNING_EVENT.showElementConnections:
      return <ListElementConnections layerKey={layerKey} />;

    case PLANNING_EVENT.addElementConnection:
      return <AddElementConnection />;

    case PLANNING_EVENT.showPortDetails:
      return <ElementPortDetails />;

    default:
      return null;
  }
};

export default memo(GisEventScreen);
