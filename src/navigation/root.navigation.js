import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import DrawerStack from '~navigation/drawer.navigation';

import LoginScreen from '~screens/Authentication/LoginScreen';
import SurveyMap from '~screens/Survey/SurveyMap';
import UnitList from '~screens/Survey/UnitList';
import UnitMap from '~screens/Survey/UnitMap';
import UnitForm from '~screens/Survey/UnitForm';

import {getIsUserLoggedIn} from '~data/selectors/auth.selectors';
import {screens} from '~constants/constants';
import ReviewScreen from '~screens/Survey/ReviewScreen';
import SurveyForm from '~screens/Survey/SurveyForm';

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
