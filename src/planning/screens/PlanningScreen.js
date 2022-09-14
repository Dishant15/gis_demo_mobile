import React, {useEffect} from 'react';
import {View, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';
import {LayerEventComponent} from '~planning/GisMap/components/LayerToComponentMap';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout} from '~constants/constants';

const PlanningScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setMapState({}));
    };
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <StatusBar barStyle="dark-content" />
      <LayerEventComponent />
      <ActionBar />
      <GisMap />
    </View>
  );
};

export default PlanningScreen;
