import React from 'react';
import {View, StatusBar} from 'react-native';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';
import GisEventCard from '~planning/GisMap/components/GisEventCard';
import MapActionBar from '~planning/GisMap/components/MapActionBar';

import {layout} from '~constants/constants';

const PlanningScreen = props => {
  return (
    <View style={[layout.container, layout.relative]}>
      <StatusBar barStyle="dark-content" />
      <ActionBar />
      <MapActionBar />
      <GisMap />
      <GisEventCard />
    </View>
  );
};

export default PlanningScreen;
