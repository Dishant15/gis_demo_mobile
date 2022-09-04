import React from 'react';
import {View, StyleSheet} from 'react-native';
import {noop} from 'lodash';

import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '~constants/constants';

const CustomModal = ({children, handleClose = noop}) => {
  const {bottom} = useSafeAreaInsets();

  return (
    <Modal
      useNativeDriver={true}
      animationIn="slideInUp"
      animationOut="slideInDown"
      isVisible={true}
      hideModalContentWhileAnimating
      onSwipeComplete={handleClose}
      swipeDirection="down"
      // Flexs to the bottom. Commented out so it centers
      style={styles.modalWrapper}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}>
      <View
        style={[styles.modalContainer, {paddingBottom: Math.max(bottom, 30)}]}>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
export default CustomModal;
