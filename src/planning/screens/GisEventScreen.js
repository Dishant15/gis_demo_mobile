import React, {memo, useCallback} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import get from 'lodash/get';

import {GisLayerForm} from '~planning/GisMap/components/GisLayerForm';
import ElementDetailsTable from '~planning/GisMap/components/ElementDetailsTable';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {goBackFromGisEventScreen} from '~planning/data/event.actions';

const GisEventScreen = props => {
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', customGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', customGoBack);
    }, []),
  );

  const {layerKey, event} = useSelector(getPlanningMapState);

  const customGoBack = () => {
    dispatch(goBackFromGisEventScreen(props.navigation));
    return true;
  };

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

    default:
      return null;
  }
};

export default memo(GisEventScreen);
