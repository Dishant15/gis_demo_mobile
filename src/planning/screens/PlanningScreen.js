import React, {useEffect} from 'react';
import {View, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';
import GisEventCard from '~planning/GisMap/components/GisEventCard';

import {setMapState} from '~planning/data/planningGis.reducer';
import {layout} from '~constants/constants';

const PlanningScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setMapState({}));
    };
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <StatusBar barStyle="dark-content" />
      <ActionBar />
      <GisMap />
      <GisEventCard />
    </View>
  );
};

export default PlanningScreen;
