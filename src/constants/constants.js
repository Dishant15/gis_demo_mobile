import {StyleSheet} from 'react-native';

export const screens = {
  drawerStack: 'drawerStack',
  homeStack: 'homeStack',

  loginScreen: 'loginScreen',
  dashboardScreen: 'dashboardScreen',
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
  button: {
    height: 50,
  },
  textInput: {
    marginVertical: 4,
  },
});
