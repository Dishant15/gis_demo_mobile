import {StyleSheet} from 'react-native';

export const screens = {
  drawerStack: 'drawerStack',
  homeStack: 'homeStack',

  loginScreen: 'loginScreen',
  dashboardScreen: 'dashboardScreen',

  areaList: 'areaList',
  surveyMap: 'surveyMap',
  surveyForm: 'surveyForm',
  surveyList: 'surveyList',

  unitList: 'unitList',
  unitMap: 'unitMap',
  unitForm: 'unitForm',
  reviewScreen: 'reviewScreen',

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
  blackWithOp: 'rgba(0,0,0,0.3)',

  mainBgColor: 'rgb(247, 247, 247)',
  primaryFontColor: '#404040',
  darkGreyColor: '#707070',

  primaryMain: '#1976d2',
  primaryMainDark: '#1565c0',
  secondaryMain: '#9c27b0',
  accentTextColor: '#ffffff',
  textColor: '#212121',
  error: '#d32f2f',

  separator: '#CCCCCC',
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
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  relative: {
    position: 'relative',
  },
});

// AHMEDABAD CENTER
export const INIT_MAP_LOCATION = {
  longitudeDelta: 0.0462949275970459,
  latitude: 23.051741843623137,
  longitude: 72.54943616688251,
  latitudeDelta: 0.09218772082917326,
};

export const SURVEY_TAG_LIST = [
  {label: 'Residential', value: 'residential'},
  {label: 'Commercial', value: 'commercial'},
  {label: 'Semi Commercial', value: 'semi_commercial'},
  {label: 'Government', value: 'government'},
  {label: 'Hospital', value: 'hospital'},
  {label: 'Educational', value: 'educational'},
];

export const SURVEY_TAG_OBJ = {
  residential: 'Residential',
  commercial: 'Commercial',
  semi_commercial: 'Semi Commercial',
  government: 'Government',
  hospital: 'Hospital',
  educational: 'Educational',
};

export const BroadbandProviders = [
  {
    label: 'GTPL',
    value: 'GTPL',
  },
  {
    label: 'JIO',
    value: 'JIO',
  },
  {
    label: 'Airtel',
    value: 'Airtel',
  },
];

export const TVProviders = [
  {
    label: 'GTPL',
    value: 'GTPL',
  },
  {
    label: 'DEN',
    value: 'DEN',
  },
  {
    label: 'IN CABLE',
    value: 'IN CABLE',
  },
];

export const SURVEY_TASK_STATUS = {
  O: {label: 'On Going', color: 'orange'},
  C: {label: 'Completed', color: 'green'},
  A: {label: 'Archived', color: 'grey'},
};
