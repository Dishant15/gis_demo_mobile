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
  surveyTicketList: 'surveyTicketList',
  workorderScreen: 'workorderScreen',

  unitList: 'unitList',
  unitMap: 'unitMap',
  unitForm: 'unitForm',
  reviewScreen: 'reviewScreen',

  planningTicketList: 'planningTicketList',
  planningTicketWorkorder: 'planningTicketWorkorder',

  planningStack: 'planningStack',
  drawerPlanningStack: 'drawerPlanningStack',
  planningScreen: 'planningScreen',
  gisEventScreen: 'gisEventScreen',

  networkScreen: 'networkScreen',
  clientScreen: 'clientScreen',
  profileScreen: 'profileScreen',
  changePasswordScreen: 'changePasswordScreen',
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
  offWhite: 'rgb(239, 239, 239)',
  blackWithOp: 'rgba(0,0,0,0.3)',
  primeFontColor: 'rgba(0, 0, 0, 0.6)',
  disabledBackground: '#d1d1d1',
  disabledText: '#8f8f8f',

  mainBgColor: 'rgb(247, 247, 247)',
  primaryFontColor: '#404040',
  darkGreyColor: '#707070',

  primaryMain: '#1976d2',
  primaryMainDark: '#1565c0',
  primaryMainLight: '#75ade4',
  secondaryMain: '#b98919',
  accentTextColor: '#ffffff',
  textColor: '#212121',

  error: '#e24c4b',
  warning: '#ffc005',
  success: '#4bae4f',
  info: '#0288d1',
  separator: '#CCCCCC',

  grey1: '#efefef',
  transparent: 'transparent',
  dividerColor: 'rgba(0, 0, 0, 0.12)',
  dividerColor2: 'rgba(0, 0, 0, 0.24)',
};

export const layout = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  listContainer: {
    backgroundColor: colors.grey1,
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130,
  },
  smallButtonMR: {
    marginRight: 6,
  },
  textInput: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relative: {
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  box: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
  relative: {
    position: 'relative',
  },
  mrl8: {
    marginLeft: 8,
  },
});

export const SURVEY_TAG_LIST = [
  {label: 'Residential', value: 'residential'},
  {label: 'Commercial', value: 'commercial'},
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

export const LOCALITY_OPTS = [
  {label: 'High', value: '1'},
  {label: 'Medium', value: '2'},
  {label: 'Average', value: '3'},
  {label: 'Poor', value: '4'},
];

/**
 * Common message over the app
 */

export const getRequiredFieldMessage = field => `${field} is required.`;

export const Z_INDEX = {
  FLOATING_CARDS: 1,
};

export const THEME_COLORS = {
  primary: {
    main: '#1881bc',
  },
  secondary: {
    main: '#b98919',
    contrastText: '#fff',
  },
  background: {
    default: '#efefef',
  },
  error: {
    main: '#e24c4b',
    contrastText: '#fff',
  },
  warning: {
    main: '#ffc005',
    contrastText: '#fff',
  },
  success: {
    main: '#4bae4f',
    contrastText: '#fff',
  },
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
  },
};

export const HOST_CONFIG = {
  NETGIS: {
    label: 'Gis Demo',
    value: 'http://64.227.132.147:8888',
  },
  GPSTECH: {
    label: 'Gis Demo 2',
    value: 'http://64.227.132.147:8888',
  },
};
