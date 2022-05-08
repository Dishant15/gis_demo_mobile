import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {useIsDrawerOpen} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '~constants/constants';

export const DrawerButton = () => {
  const isDrawerOpen = useIsDrawerOpen();
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.drawerBtnWrapper}
      onPress={navigation.toggleDrawer}>
      <MaterialCommunityIcons
        size={34}
        name={isDrawerOpen ? 'close' : 'menu'}
        color={colors.black}
        style={{textAlign: 'center'}}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  drawerBtnWrapper: {
    // width: 42,
    // height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
});
