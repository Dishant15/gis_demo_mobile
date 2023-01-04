import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import GisEventScreen from '~planning/screens/GisEventScreen';
import PlanningScreen from '~planning/screens/PlanningScreen';

import {screens} from '~constants/constants';

const Stack = createStackNavigator();

const options = {
  headerShown: false,
};

export const PlanningStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screens.planningScreen}
        component={PlanningScreen}
        options={options}
      />
      <Stack.Screen
        name={screens.gisEventScreen}
        component={GisEventScreen}
        options={options}
      />
    </Stack.Navigator>
  );
};
