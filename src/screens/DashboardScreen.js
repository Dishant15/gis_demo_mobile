import React from 'react';
import {View} from 'react-native';
import {layout} from '~constants/constants';
import {Headline} from 'react-native-paper';

const DashboardScreen = () => {
  return (
    <View style={[layout.container, layout.center]}>
      <Headline>Welcome</Headline>
      <Headline>to</Headline>
      <Headline>Network GIS</Headline>
    </View>
  );
};

export default DashboardScreen;
