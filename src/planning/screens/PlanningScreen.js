import React from 'react';

import {View, StatusBar} from 'react-native';

import {layout} from '~constants/constants';

import GisMap from '~planning/GisMap';
import ActionBar from '~planning/ActionBar';

const PlanningScreen = () => {
  return (
    <View style={[layout.container, layout.relative]}>
      <StatusBar barStyle="dark-content" />
      <ActionBar />
      <GisMap />
    </View>
  );
};

export default PlanningScreen;
