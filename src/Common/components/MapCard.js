import React, {useCallback} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Paragraph, Title} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {colors, THEME_COLORS} from '~constants/constants';
import {useDispatch} from 'react-redux';
import {goBackFromPlanningScreen} from '~planning/data/event.actions';

const MapCard = ({
  showBackIcon = true,
  title = '',
  subTitle = '',
  actionContent = null,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', customGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', customGoBack);
    }, []),
  );

  const customGoBack = () => {
    dispatch(goBackFromPlanningScreen(navigation));
    return true;
  };

  return (
    <View style={[styles.card, {top: Math.max(top, 14)}]}>
      <View style={styles.titleWrapper}>
        {showBackIcon ? (
          <TouchableOpacity style={styles.iconWrapper} onPress={customGoBack}>
            <MaterialIcons
              size={24}
              name={'arrow-back-ios'}
              color={colors.white}
            />
          </TouchableOpacity>
        ) : null}
        <Title numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Title>
      </View>
      {!!subTitle ? <Paragraph>{subTitle}</Paragraph> : null}
      <View style={styles.actionWrapper}>
        {actionContent}
        {/* {primaryAction}
        {secondaryAction ? (
          <>
            <View style={styles.actionGap} />
            {secondaryAction}
          </>
        ) : null} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    backgroundColor: THEME_COLORS.primary.main,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  iconWrapper: {
    height: 36,
    justifyContent: 'center',
  },
  actionWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  actionGap: {
    marginLeft: 8,
  },
});

export default MapCard;
