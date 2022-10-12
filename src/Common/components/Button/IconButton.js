import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {THEME_COLORS} from '~constants/constants';

export const IconButton = ({
  icon = '',
  color = THEME_COLORS.primary.main,
  textColor = '',
  text = '',
  style,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.contained, style, {backgroundColor: color}]}
      onPress={onPress}>
      <MaterialCommunityIcons
        size={18}
        name={icon}
        color={textColor}
        style={styles.iconStyle}
      />
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1}
        style={[styles.text, {color: textColor}]}>
        {text}
      </Text>
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
