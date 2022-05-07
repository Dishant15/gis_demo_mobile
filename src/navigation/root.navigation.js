import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import DrawerStack from '~navigation/drawer.navigation';
import {screens} from '~constants/constants';
import {useSelector} from 'react-redux';
import {getIsUserLoggedIn} from '~redux/selectors/auth.selectors';
import LoginScreen from '~screens/Authentication/LoginScreen';
import SurveyDetails from '~screens/Survey/SurveyDetails';
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
              name={screens.surveyDetails}
              component={SurveyDetails}
              options={options}
            />
            <Stack.Screen
              name={screens.surveyForm}
              component={SurveyForm}
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
