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
        style={[
          styles.toastStyle,
          {
            borderLeftColor: colors.success,
          },
        ]}
        text2={null}
        text1NumberOfLines={null}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
  error: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={[
          styles.toastStyle,
          {
            borderLeftColor: colors.error,
          },
        ]}
        text2={null}
        text1NumberOfLines={null}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
  info: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={[
          styles.toastStyle,
          {
            borderLeftColor: colors.info,
          },
        ]}
        text2={null}
        text1NumberOfLines={null}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
  warning: ({text1Style, ...restProps}) => {
    return (
      <BaseToast
        {...restProps}
        text1Style={[text1Style, styles.text1Style]}
        style={[
          styles.toastStyle,
          {
            borderLeftColor: colors.warning,
          },
        ]}
        text2={null}
        text1NumberOfLines={null}
        onTrailingIconPress={() => Toast.hide()}
      />
    );
  },
};

export const TOAST_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};
/**
 * type => 'success | error | info | warning'
 * @returns
 */
export const showToast = (message, type = 'error', timeout = 3000) => {
  if (size(message) === 0) return;
  if (Toast.show) {
    Toast.show({
      text1: typeof message !== 'string' ? JSON.stringify(message) : message,
      position: 'bottom',
      visibilityTime: timeout,
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
    paddingVertical: 6,
  },
  toastStyle: {
    height: 'auto',
    minHeight: 60,
  },
});
