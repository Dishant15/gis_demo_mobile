import React, {useCallback} from 'react';
import {View, Pressable, StyleSheet, BackHandler, FlatList} from 'react-native';
import {useQuery, useMutation} from 'react-query';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import some from 'lodash/some';

import {Title, Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';

import {
  addElementConnection,
  fetchElementConnections,
} from '~planning/data/layer.services';
import {setMapState} from '~planning/data/planningGis.reducer';
import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {onElementListItemClick} from '~planning/data/planning.actions';
import {fetchLayerDataThunk} from '~planning/data/actionBar.services';

import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {colors, layout, THEME_COLORS} from '~constants/constants';

/**
 * Parent:
 *    GisEventScreen
 */
const AddElementConnection = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const {elementId, layerKey, elementList} = useSelector(
    getPlanningMapStateData,
  );

  const {
    data: existingConnections,
    isFetching: connectionsLoading,
    refetch,
  } = useQuery(
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

  const {mutate: updateConnectionMutation, isLoading: isUpdating} = useMutation(
    addElementConnection,
    {
      onSuccess: res => {
        // refetch cable layer gis data
        dispatch(
          fetchLayerDataThunk({
            regionIdList: selectedRegionIds,
            layerKey: 'p_cable',
          }),
        );
        // success notification
        showToast(
          'Element to table connection was updated successfully',
          TOAST_TYPE.SUCCESS,
        );
        refetch();
      },
      onError: err => {
        showToast('Connection update failed', TOAST_TYPE.ERROR);
        console.log(err);
      },
    },
  );

  const handleShowOnMap = useCallback(
    (elementId, layerKey) => () => {
      dispatch(onElementListItemClick(elementId, layerKey, navigation));
    },
    [],
  );

  const handleConnect = useCallback(
    (cableId, cable_end) => () => {
      // required data = cable id, cable end
      // element id, element layer key
      const data = {
        connection: {
          element_id: elementId,
          element_layer_key: layerKey,
          cable_end,
        },
      };
      updateConnectionMutation({data, cableId});
    },
    [elementId, layerKey],
  );

  const handleRemove = useCallback(
    (cableId, cable_end) => () => {
      // required data = cable id, cable end
      // element id, element layer key
      const data = {
        connection: {
          cable_end,
          is_delete: true,
        },
      };
      updateConnectionMutation({data, cableId});
    },
    [elementId, layerKey],
  );

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Add Connection" onGoBack={handleGoBack} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={elementList}
        keyExtractor={(item, index) => String(index)}
        renderItem={({item}) => {
          console.log(
            '🚀 ~ file: AddElementConnection.js:76 ~ AddElementConnection ~ item',
            item,
          );
          const {id, name, cable_end, network_id, layerKey} = item;
          // check if same layer_key, id data in existingConnections
          const isConnected = some(existingConnections, ['element.id', id]);
          // ||
          // // if user just connected one of the cable, get that from state
          // indexOf(newConnection, id) !== -1;
          // if true than disable connect btn
          const Icon = LayerKeyMappings[layerKey]['getViewOptions'](item).icon;

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
                    {name}{' '}
                    <Caption numberOfLines={3} ellipsizeMode="tail">
                      {`(${cable_end} End)`}
                    </Caption>
                  </Subheading>
                  <Caption numberOfLines={3} ellipsizeMode="tail">
                    #{network_id}
                  </Caption>
                </View>

                <Pressable
                  style={styles.actionWrapper}
                  onPress={handleShowOnMap(id, layerKey)}>
                  <View style={styles.squreButton}>
                    <MaterialIcons
                      size={28}
                      name="language"
                      color={THEME_COLORS.action.active}
                    />
                  </View>
                </Pressable>
                {isConnected ? (
                  <Pressable
                    style={styles.actionWrapper}
                    onPress={handleRemove(id, cable_end)}>
                    <View style={styles.squreButton}>
                      <MaterialIcons
                        size={28}
                        name="delete-outline"
                        color={THEME_COLORS.action.active}
                      />
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.actionWrapper}
                    onPress={handleConnect(id, cable_end)}>
                    <View style={styles.squreButton}>
                      <MaterialIcons
                        size={28}
                        name="add-circle-outline"
                        color={THEME_COLORS.action.active}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
              <Divider style={styles.divider} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Title style={layout.textCenter}>
              No near by elements for connect
            </Title>
          </View>
        }
      />
      {connectionsLoading || isUpdating ? <Loader /> : null}
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
  actionWrapper: {
    height: 60,
    padding: 5,
    alignItems: 'center',
  },
  squreButton: {
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: colors.dividerColor,
  },
  rightContent: {
    paddingLeft: 6,
    alignItems: 'center',
  },
  bottomWrapper: {
    padding: 12,
  },
});

export default AddElementConnection;
