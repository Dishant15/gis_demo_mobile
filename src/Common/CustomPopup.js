import React, {useCallback} from 'react';
import {View, StyleSheet, Pressable, BackHandler} from 'react-native';
import {noop} from 'lodash';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';

import {colors, layout} from '~constants/constants';

export const CustomBottomPopup = ({
  children,
  handleClose = noop,
  justifyContent = 'center',
  wrapperStyle = {},
}) => {
  const {bottom} = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleClose();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <View style={[styles.modal, {justifyContent}]}>
      <Pressable style={layout.box} onPress={handleClose} />
      <View
        style={[
          styles.modalContainer,
          {paddingBottom: Math.max(bottom, 0)},
          wrapperStyle,
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: colors.blackWithOp,
  },
  modalContainer: {
    backgroundColor: colors.white,
    maxHeight: '83%',
    minHeight: '40%',
  },
});
