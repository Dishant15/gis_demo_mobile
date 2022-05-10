import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import DrawerStack from '~navigation/drawer.navigation';

import LoginScreen from '~screens/Authentication/LoginScreen';
import SurveyDetails from '~screens/Survey/SurveyDetails';
import SurveyForm from '~screens/Survey/SurveyFormScreen';
import UnitList from '~screens/Survey/UnitList';
import UnitDetails from '~screens/Survey/UnitDetails';
import UnitForm from '~screens/Survey/UnitForm';

import {getIsUserLoggedIn} from '~data/selectors/auth.selectors';
import {screens} from '~constants/constants';
import MarkerTypes from '~screens/Demo';

const Stack = createStackNavigator();

const options = {
  headerShown: false,
};

const RootNavigation = () => {
  const isUserLoggedIn = useSelector(getIsUserLoggedIn);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <Stack.Navigator>
        {isUserLoggedIn ? (
          <>
            <Stack.Screen
              name={screens.drawerStack}
              component={DrawerStack}
              options={options}
            />
            <Stack.Screen
              name={screens.surveyDetails}
              component={SurveyDetails}
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
              name={screens.unitDetails}
              component={UnitDetails}
              options={options}
            />
            <Stack.Screen
              name={screens.unitForm}
              component={UnitForm}
              options={options}
            />
            <Stack.Screen
              name={'demo'}
              component={MarkerTypes}
              options={options}
            />
            {/* same as unit list, details, form, review */}
          </>
        ) : (
          <Stack.Screen
            name={screens.loginScreen}
            component={LoginScreen}
            options={options}
          />
        )}
      </Stack.Navigator>
    </>
  );
};

export default RootNavigation;