import {StyleSheet} from 'react-native';

export const screens = {
  drawerStack: 'drawerStack',
  homeStack: 'homeStack',

  loginScreen: 'loginScreen',
  dashboardScreen: 'dashboardScreen',

  surveyScreen: 'surveyScreen',
  surveyDetails: 'surveyDetails',
  surveyForm: 'surveyForm',

  unitList: 'unitList',
  unitMap: 'unitMap',
  unitForm: 'unitForm',

  networkScreen: 'networkScreen',
  clientScreen: 'clientScreen',
  planningScreen: 'planningScreen',
};

export const fonts = {
  fontBold: 'Poppins-Bold',
  fontMedium: 'Poppins-Medium',
  fontRegular: 'Poppins-Regular',
  font2Bold: 'Roboto-Bold',
  font2Medium: 'Roboto-Medium',
  font2Regular: 'Roboto-Regular',
};

export const colors = {
  black: '#000',
  white: '#fff',

  mainBgColor: 'rgb(247, 247, 247)',
  primaryFontColor: '#404040',
  darkGreyColor: '#707070',
};

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginVertical: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// AHMEDABAD CENTER
export const INIT_MAP_LOCATION = {
  longitudeDelta: 0.0462949275970459,
  latitude: 23.051741843623137,
  longitude: 72.54943616688251,
  latitudeDelta: 0.09218772082917326,
};
