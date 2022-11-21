import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {Divider, IconButton, Subheading, Text} from 'react-native-paper';

import get from 'lodash/get';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Loader from '~Common/Loader';
import BackHeader from '~Common/components/Header/BackHeader';

import {fetchElementDetails} from '~planning/data/layer.services';
import {setMapState} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapStateData,
  getPlanningTicketData,
} from '~planning/data/planningGis.selectors';

import {colors, THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {coordsToLatLongMap} from '~utils/map.utils';
import {
  onEditElementGeometry,
  onShowAreaOnMapPress,
  onShowMarkerOnMapPress,
} from '~planning/data/event.actions';
import {FEATURE_TYPES} from '../layers/common/configuration';
import {checkUserPermission} from '~Authentication/data/auth.selectors';

const ElementDetailsTable = ({layerKey, onEditDataConverter}) => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const ticketData = useSelector(getPlanningTicketData);
  const {elementId} = useSelector(getPlanningMapStateData);
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`),
  );
  // User can not edit region on mobile application
  const hasEditPermission = layerKey !== 'region' && hasLayerEditPermission;

  const {data: elemData, isLoading} = useQuery(
    ['elementDetails', layerKey, elementId],
    fetchElementDetails,
    {
      // assign same coordinates to geometry to handle data for gislayerform -> workorder add
      select: data => ({...data, geometry: data.coordinates}),
    },
  );

  const rowDefs = get(LayerKeyMappings, [layerKey, 'elementTableFields'], []);
  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);

  const handleEditDetails = useCallback(() => {
    let mapStateData = {
      event: PLANNING_EVENT.editElementForm,
      layerKey,
      data: onEditDataConverter ? onEditDataConverter(elemData) : elemData,
    };
    if (ticketData?.network_type) {
      mapStateData.data['status'] = ticketData.network_type;
    }
    dispatch(setMapState(mapStateData));
  }, [dispatch, layerKey, elemData, onEditDataConverter, ticketData]);

  const handleEditLocation = useCallback(() => {
    let geometry = null;
    if (
      featureType === FEATURE_TYPES.POLYLINE ||
      featureType === FEATURE_TYPES.POLYGON
    ) {
      geometry = coordsToLatLongMap(elemData.coordinates);
    } else {
      geometry = coordsToLatLongMap([elemData.coordinates])[0];
    }
    dispatch(
      onEditElementGeometry(
        {
          event: PLANNING_EVENT.editElementGeometry,
          layerKey,
          // pass elem data to update edit icon / style based on configs
          data: {
            ...elemData,
            elementId: elemData.id,
          },
          geometry,
          enableMapInterection: true,
        },
        featureType,
        navigation,
      ),
    );
  }, [dispatch, layerKey, elemData, featureType]);

  const handleShowOnMap = useCallback(() => {
    const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(onShowMarkerOnMapPress(elemData.coordinates, navigation));
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(onShowAreaOnMapPress(elemData.coordinates, navigation));
        break;
      default:
        break;
    }
  }, [dispatch, layerKey, elemData]);

  return (
    <View style={styles.container}>
      <BackHeader title="Element Details" onGoBack={navigation.goBack} />
      {isLoading ? <Loader /> : null}
      <FlatList
        data={rowDefs}
        keyExtractor={item => item.field}
        renderItem={({item}) => {
          const {label, field, type} = item;
          let ValueCell;

          switch (type) {
            case 'status':
              const elemStatus = get(elemData, field);
              const color =
                elemStatus === 'RFS'
                  ? colors.success
                  : elemStatus === 'L1' || elemStatus === 'L2'
                  ? colors.warning
                  : colors.error; // IA: In active

              ValueCell = (
                <View style={[styles.tableValue, {alignItems: 'flex-start'}]}>
                  <View
                    style={[
                      styles.chipWrapper,
                      {
                        backgroundColor: color,
                      },
                    ]}>
                    <MaterialIcons
                      size={16}
                      name="check"
                      color={colors.white}
                      style={styles.chipIcon}
                    />
                    <Text style={styles.chipText}>
                      {get(elemData, `${field}_display`)}
                    </Text>
                  </View>
                </View>
              );
              break;

            case 'boolean':
              const elemBoolData = get(elemData, field);
              ValueCell = (
                <View style={styles.tableValue}>
                  <IconButton
                    icon={elemBoolData ? 'check' : 'close'}
                    color={elemBoolData ? colors.success : colors.error}
                    size={20}
                  />
                </View>
              );
              break;

            default:
              ValueCell = (
                <Subheading style={styles.tableValue}>
                  {get(elemData, field, '--') || '--'}
                </Subheading>
              );
              break;
          }
          return (
            <>
              <View style={styles.tableRow}>
                <Subheading style={styles.tableLabel}>{label}</Subheading>
                {ValueCell}
              </View>
              <Divider />
            </>
          );
        }}
      />
      {hasEditPermission ? (
        <View style={{paddingBottom: Math.max(bottom, 0)}}>
          <View style={styles.squreButtonWrapper}>
            <View style={styles.squreButtonContent}>
              <Pressable style={styles.squreButton} onPress={handleEditDetails}>
                <MaterialIcons
                  size={22}
                  name="edit"
                  color={THEME_COLORS.secondary.main}
                />
              </Pressable>
              <Text style={styles.squreButtonText}>Details</Text>
            </View>
            <View style={styles.squreButtonContent}>
              <Pressable
                style={styles.squreButton}
                onPress={handleEditLocation}>
                <MaterialIcons
                  size={22}
                  name="edit-location"
                  color={THEME_COLORS.secondary.main}
                />
              </Pressable>
              <Text style={styles.squreButtonText}>Location</Text>
            </View>
            <View style={styles.squreButtonContent}>
              <Pressable style={styles.squreButton} onPress={handleShowOnMap}>
                <MaterialIcons
                  size={22}
                  name="language"
                  color={THEME_COLORS.secondary.main}
                />
              </Pressable>
              <Text style={styles.squreButtonText}>Map</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableLabel: {
    color: colors.primaryMain,
    flex: 1,
  },
  tableValue: {
    flex: 1.1,
  },
  actionWrapper: {
    padding: 12,
    flexDirection: 'row',
  },
  btn1: {
    flex: 1,
    marginRight: 6,
    borderColor: colors.secondaryMain,
    alignItems: 'stretch',
  },
  btn2: {
    flex: 1,
    marginLeft: 6,
    borderColor: colors.secondaryMain,
    alignItems: 'stretch',
  },
  btnContent: {
    width: '100%',
    height: '100%',
  },
  chipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: 16,
  },
  chipIcon: {
    padding: 4,
  },
  chipText: {
    minHeight: 24,
    lineHeight: 24,
    marginVertical: 4,
    color: colors.white,
  },
  squreButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  squreButton: {
    borderColor: THEME_COLORS.secondary.main,
    borderWidth: 1,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  squreButtonWrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 12,
  },
  squreButtonText: {
    color: THEME_COLORS.secondary.main,
    paddingTop: 6,
    paddingBottom: 4,
  },
});

export default ElementDetailsTable;
