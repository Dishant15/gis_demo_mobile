import React, {useCallback} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors, THEME_COLORS} from '~constants/constants';
import {useDispatch, useSelector} from 'react-redux';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';
import {getPlanningTicketData} from '~planning/data/planningGis.selectors';
import {get, isNull} from 'lodash';
import {Headline} from 'react-native-paper';
import {toggleTicketElements} from '~planning/data/planningGis.reducer';

const MapTitleBox = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {top} = useSafeAreaInsets();

  const ticketId = useSelector(getSelectedPlanningTicket);
  const ticketData = useSelector(getPlanningTicketData);

  const isHidden = get(ticketData, 'isHidden');
  const showPlanningTitle = !!get(route, 'params.fromPlanning');

  const handleToggle = useCallback(() => {
    dispatch(toggleTicketElements());
  }, []);

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
      {!isNull(ticketId) ? (
        <View style={[styles.contentWrapper, {top: Math.max(top, 14)}]}>
          <View style={styles.content}>
            <View style={styles.headerWrapper}>
              <Headline
                style={styles.headline}
                numberOfLines={1}
                ellipsizeMode="tail">
                {get(ticketData, 'name', '')}
              </Headline>
            </View>
          </View>
          <Pressable style={styles.iconWrapper} onPress={handleToggle}>
            <MaterialCommunityIcons
              size={26}
              name={isHidden ? 'eye-off' : 'eye'}
              color={colors.primaryFontColor}
            />
          </Pressable>
        </View>
      ) : null}
      {showPlanningTitle ? (
        <View
          style={[styles.contentWrapper, {top: Math.max(top, 14), right: 4}]}>
          <View style={styles.content}>
            <View style={[styles.headerWrapper, styles.planningTitle]}>
              <Headline
                style={styles.headline}
                numberOfLines={1}
                ellipsizeMode="tail">
                Planning
              </Headline>
            </View>
          </View>
        </View>
      ) : null}
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
  contentWrapper: {
    position: 'absolute',
    top: 14,
    left: 58,
    right: 14,
    flexDirection: 'row',
  },
  content: {
    paddingHorizontal: 8,
    flex: 1,
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
  headerWrapper: {
    backgroundColor: THEME_COLORS.secondary.main,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
  },
  planningTitle: {
    backgroundColor: colors.primaryMain,
  },
  headline: {
    color: THEME_COLORS.secondary.contrastText,
    textAlign: 'center',
  },
});

export default MapTitleBox;
