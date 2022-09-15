import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors} from '~constants/constants';

const MapTitleBox = () => {
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.backWrapper, {top: Math.max(top, 14)}]}>
        <Pressable style={styles.iconWrapper} onPress={navigation.goBack}>
          <MaterialIcons
            size={26}
            name={'arrow-back'}
            color={colors.primaryFontColor}
          />
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backWrapper: {
    paddingLeft: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  iconWrapper: {
    height: 44,
    width: 44,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default MapTitleBox;
