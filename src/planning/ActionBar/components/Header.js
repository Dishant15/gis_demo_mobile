import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import {Title} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {noop} from 'lodash';

import {colors} from '~constants/constants';

/**
 * Parent
 *    AddElementContent
 *    LayersTabContent
 *    RegionTabContent
 */
const Header = ({text, icon, onClose = noop}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <MaterialIcons size={26} name={icon} color={colors.white} />
        <Title style={styles.text}>{text}</Title>
      </View>
      <Pressable style={styles.icon} onPress={onClose}>
        <MaterialIcons size={30} name={'close'} color={colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primaryMain,
    position: 'relative',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    color: colors.white,
    paddingHorizontal: 8,
  },
  icon: {
    paddingHorizontal: 8,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});

export default Header;
