import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {StatusBar} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import DrawerStack from '~navigation/drawer.navigation';
import {PlanningStack} from './planningStack.navigation';

import LoginScreen from '~Authentication/screens/LoginScreen';
import SurveyMap from '~GeoServey/screens/SurveyMap';
import UnitList from '~GeoServey/screens/UnitList';
import UnitMap from '~GeoServey/screens/UnitMap';
import UnitForm from '~GeoServey/screens/UnitForm';
import ReviewScreen from '~GeoServey/screens/ReviewScreen';
import SurveyForm from '~GeoServey/screens/SurveyForm';
import WorkorderScreen from '~ticket/screens/WorkorderScreen';
import TicketWorkorder from '~planningTicket/screen/TicketWorkorderScreen';
import LocationProvider from '~Common/LocationProvider';
import ChangePasswordScreen from '~Authentication/screens/ChangePasswordScreen';

import {getIsUserLoggedIn} from '~Authentication/data/auth.selectors';
import {screens} from '~constants/constants';
import VersionUpdateProvider from '~Common/VersionUpdateProvider';

const Stack = createStackNavigator();

const options = {
  headerShown: false,
};

/**
 * Main navigation component
 *
 * Based on isUserLoggedIn flag app and auth navigation screens will be
 * added to stack
 *
 * By default it wil show login screen
 *
 * Nested navigator components
 *    drawer.navigation
 *
 * Parent:
 *    App
 * Renders:
 *    LocationProvider - above navigation stack
 *    DrawerStack
 *    SurveyMap
 *    SurveyForm
 *    UnitList
 *    UnitMap
 *    UnitForm
 *    ReviewScreen
 *    LoginScreen
 */
const RootNavigation = () => {
  const isUserLoggedIn = useSelector(getIsUserLoggedIn);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      {isUserLoggedIn ? (
        <LocationProvider>
          <VersionUpdateProvider>
            <Stack.Navigator>
              <Stack.Screen
                name={screens.drawerStack}
                component={DrawerStack}
                options={options}
              />
              <Stack.Screen
                name={screens.workorderScreen}
                component={WorkorderScreen}
                options={options}
              />
              <Stack.Screen
                name={screens.surveyMap}
                component={SurveyMap}
                options={options}
              />
              <Stack.Screen
                name={screens.surveyForm}
                component={SurveyForm}
                options={options}
              />
              <Stack.Screen
                name={screens.unitList}
                component={UnitList}
                options={options}
              />
              <Stack.Screen
                name={screens.unitMap}
                component={UnitMap}
                options={options}
              />
              <Stack.Screen
                name={screens.unitForm}
                component={UnitForm}
                options={options}
              />
              <Stack.Screen
                name={screens.reviewScreen}
                component={ReviewScreen}
                options={options}
              />
              {/* planning */}
              <Stack.Screen
                name={screens.planningTicketWorkorder}
                component={TicketWorkorder}
                options={options}
              />
              <Stack.Screen
                name={screens.planningStack}
                component={PlanningStack}
                options={options}
              />
              <Stack.Screen
                name={screens.changePasswordScreen}
                component={ChangePasswordScreen}
                options={options}
              />
            </Stack.Navigator>
          </VersionUpdateProvider>
        </LocationProvider>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name={screens.loginScreen}
            component={LoginScreen}
            options={options}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default RootNavigation;
