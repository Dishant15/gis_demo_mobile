import React from 'react';
import {StyleSheet} from 'react-native';

import {size} from 'lodash';
import Toast, {BaseToast} from 'react-native-toast-message';
import {colors, fonts} from '~constants/constants';
import {scale} from 'react-native-size-matters';

export const toastConfig = {
  success: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={{
          borderLeftColor: 'green',
        }}
        text2={null}
        text1NumberOfLines={3}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
  error: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={{
          borderLeftColor: 'red',
        }}
        text2={null}
        text1NumberOfLines={3}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
  info: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={{
          borderLeftColor: 'orange',
        }}
        text2={null}
        text1NumberOfLines={3}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
};

export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};
/**
 * type => 'success | error | info'
 * @returns
 */
export const showToast = (message, type = 'error') => {
  if (size(message) === 0) return;
  if (Toast.show) {
    Toast.show({
      text1: typeof message !== 'string' ? JSON.stringify(message) : message,
      position: 'bottom',
      visibilityTime: 3000,
      type,
    });
  }
};

const styles = StyleSheet.create({
  text1Style: {
    fontSize: scale(12),
    color: colors.textColor,
    fontFamily: fonts.fontRegular,
    fontWeight: 'normal',
  },
});
