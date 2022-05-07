import React from 'react';
import {Dimensions, View, Text} from 'react-native';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {screens} from '~constants/constants';
import DashboardScreen from '~screens/DashboardScreen';
import SurveyScreen from '~screens/Survey/SurveyScreen';
import NetworkScreen from '~screens/NetworkScreen';
import ClientScreen from '~screens/ClientScreen';
import PlanningScreen from '~screens/PlanningScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerType="front"
      drawerStyle={{
        width: Dimensions.get('screen').width * 0.8,
        maxWidth: 330,
      }}>
      <Drawer.Screen
        name={screens.dashboardScreen}
        component={DashboardScreen}
      />
      <Drawer.Screen name={screens.surveyScreen} component={SurveyScreen} />
      <Drawer.Screen name={screens.networkScreen} component={NetworkScreen} />
      <Drawer.Screen name={screens.clientScreen} component={ClientScreen} />
      <Drawer.Screen name={screens.planningScreen} component={PlanningScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
