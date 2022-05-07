import React from 'react';
import {Dimensions, View, Text} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {screens} from '~constants/constants';
import Map from '~screens/Map';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerStyle={{
        width: Dimensions.get('screen').width * 0.8,
        maxWidth: 330,
      }}>
      <Drawer.Screen name={screens.dashboardScreen} component={Map} />
    </Drawer.Navigator>
  );
};

const DashboardScreen = () => {
  return (
    <View>
      <Text>DashboardScreen</Text>
    </View>
  );
};

export default DrawerNavigation;
