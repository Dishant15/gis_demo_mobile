import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, BackHandler, Pressable} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import get from 'lodash/get';

import {Title, Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Loader from '~Common/Loader';
import BackHeader from '~Common/components/Header/BackHeader';
import {IconButton} from '~planning/GisMap/components/ElementDetailsTable/TableActions';

import {fetchElementConnections} from '~planning/data/layer.services';
import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {setMapState} from '~planning/data/planningGis.reducer';
import {
  onElementAddConnectionEvent,
  onElementListItemClick,
} from '~planning/data/planning.actions';

import {colors, layout, THEME_COLORS} from '~constants/constants';

import SwipeRightAltIcon from '~assets/svg/swipe_right_alt.svg';
import SwipeLeftAltIcon from '~assets/svg/swipe_left_alt.svg';

/**
 * Parent:
 *    GisEventScreen
 */
const ListElementConnections = ({layerKey}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {bottom} = useSafeAreaInsets();

  const {elementId, elementGeometry} = useSelector(getPlanningMapStateData);

  const {data: elemConnectionData, isLoading} = useQuery(
    ['elementConnections', layerKey, elementId],
    fetchElementConnections,
  );

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    }, []),
  );

  const handleShowOnMap = useCallback(
    (elementId, layerKey) => () => {
      dispatch(onElementListItemClick(elementId, layerKey, navigation));
    },
    [],
  );

  const handleAddConnection = useCallback(() => {
    dispatch(
      onElementAddConnectionEvent({
        layerKey,
        elementGeometry,
        elementId,
      }),
    );
  }, [layerKey, elementGeometry, elementId]);

  const handleGoBack = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.showElementDetails,
        layerKey,
        data: {elementId},
      }),
    );
    return true; // required for backHandler
  }, [elementId, layerKey]);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Element Connections" onGoBack={handleGoBack} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={elemConnectionData}
        keyExtractor={(item, index) => String(index)}
        renderItem={({item}) => {
          const {element, layer_info} = item;
          const Icon =
            LayerKeyMappings[layer_info.layer_key]['getViewOptions'](
              element,
            ).icon;
          const EndIcon =
            element.cable_end === 'A' ? (
              <SwipeRightAltIcon width={30} height={30} />
            ) : (
              <SwipeLeftAltIcon width={30} height={30} />
            );
          return (
            <View style={styles.container}>
              <View style={styles.wrapper}>
                <View style={styles.iconWrapper}>
                  <View style={styles.iconBlock}>
                    <Icon size={30} />
                  </View>
                </View>

                <View style={styles.textWrapper}>
                  <Subheading numberOfLines={3} ellipsizeMode="tail">
                    {get(element, 'name', '')}
                  </Subheading>
                  <Caption numberOfLines={3} ellipsizeMode="tail">
                    #{get(element, 'network_id', '')}
                  </Caption>
                </View>

                <Pressable
                  style={styles.globIcon}
                  onPress={handleShowOnMap(element.id, layer_info.layer_key)}>
                  <MaterialIcons
                    size={28}
                    name="language"
                    color={THEME_COLORS.action.active}
                  />
                </Pressable>

                <View style={styles.rightContent}>
                  <Caption numberOfLines={3} ellipsizeMode="tail">
                    {element.cable_end} End
                  </Caption>
                  {EndIcon}
                </View>
              </View>
              <Divider style={styles.divider} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Title style={layout.textCenter}>No Connections</Title>
          </View>
        }
      />
      <View
        style={[styles.bottomWrapper, {paddingBottom: Math.max(bottom, 12)}]}>
        <IconButton
          iconName="add"
          label="Add Connection"
          onPress={handleAddConnection}
        />
      </View>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 4,
    paddingBottom: 60,
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 5,
  },
  iconBlock: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: colors.white,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingHorizontal: 6,
  },

  divider: {
    marginVertical: 8,
    backgroundColor: colors.dividerColor,
  },
  globIcon: {
    paddingHorizontal: 6,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  rightContent: {
    paddingLeft: 6,
    alignItems: 'center',
  },
  bottomWrapper: {
    padding: 12,
  },
});

export default ListElementConnections;
