import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {View, StatusBar} from 'react-native';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';
import GisMapEventLayer from '~planning/GisMap/components/GisMapEventLayer';

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
      <GisMapEventLayer />
      <ActionBar />
      <GisMap />
    </View>
  );
};

export default PlanningScreen;
