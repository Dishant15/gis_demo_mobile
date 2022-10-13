import {noop} from 'lodash';
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {colors, THEME_COLORS} from '~constants/constants';

export const IconButton = ({
  icon = '',
  color = THEME_COLORS.primary.main,
  textColor = THEME_COLORS.error.contrastText,
  text = '',
  loading = false,
  disabled = false,
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.contained,
        style,
        {backgroundColor: disabled ? colors.disabledBackground : color},
      ]}
      onPress={disabled ? noop : onPress}>
      {loading ? (
        <ActivityIndicator
          animating
          size={15}
          color={disabled ? colors.disabledText : textColor}
        />
      ) : (
        <>
          {icon ? (
            <MaterialCommunityIcons
              size={18}
              name={icon}
              color={disabled ? colors.disabledText : textColor}
              style={styles.iconStyle}
            />
          ) : null}
          {text ? (
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1}
              style={[
                styles.text,
                {color: disabled ? colors.disabledText : textColor},
              ]}>
              {text}
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contained: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 9,
    marginHorizontal: 8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  iconStyle: {
    marginLeft: 12,
    marginRight: -4,
  },
});
