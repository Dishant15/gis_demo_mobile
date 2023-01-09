import React, {useCallback, useMemo} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Text} from 'react-native-paper';

import get from 'lodash/get';
import find from 'lodash/find';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {hideElement, setMapState} from '~planning/data/planningGis.reducer';
import {
  getPlanningMapStateData,
  getPlanningTicketData,
  getPlanningTicketWorkOrderId,
} from '~planning/data/planningGis.selectors';
import {
  onPointShowOnMap,
  onPolygonShowOnMap,
} from '~planning/data/planning.actions';

import {THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {coordsToLatLongMap} from '~utils/map.utils';
import {
  onEditElementGeometry,
  showAssociatiationList,
  showElementPortDetails,
  showPossibleAddAssociatiation,
} from '~planning/data/event.actions';
import {FEATURE_TYPES} from '../../layers/common/configuration';
import {checkUserPermission} from '~Authentication/data/auth.selectors';

const TableActions = ({layerKey, elemData, onEditDataConverter}) => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const ticketData = useSelector(getPlanningTicketData);
  const workOrderId = useSelector(getPlanningTicketWorkOrderId);
  const {elementId} = useSelector(getPlanningMapStateData);
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`),
  );
  const isVerifiedWorkorder = useMemo(() => {
    const currWorkorder = find(ticketData.work_orders, ['id', workOrderId]);
    const verified = get(currWorkorder, 'status') === 'V';
    return Boolean(ticketData?.id && verified);
  }, [ticketData, workOrderId]);

  // User can not edit region on mobile application
  const hasEditPermission =
    layerKey !== 'region' && hasLayerEditPermission && !isVerifiedWorkorder;

  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
  const extraControls = get(
    LayerKeyMappings,
    [layerKey, 'elementTableExtraControls'],
    [],
  );

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
        },
        featureType,
        navigation,
      ),
    );
    dispatch(
      hideElement({
        layerKey,
        elementId: elemData.id,
        isTicket: !!ticketData?.id,
      }),
    );
  }, [dispatch, layerKey, elemData, featureType, ticketData]);

  const handleShowOnMap = useCallback(() => {
    const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);
    switch (featureType) {
      case FEATURE_TYPES.POINT:
        dispatch(
          onPointShowOnMap(
            elemData.coordinates,
            elemData.id,
            layerKey,
            navigation,
          ),
        );
        break;
      case FEATURE_TYPES.POLYGON:
      case FEATURE_TYPES.POLYLINE:
      case FEATURE_TYPES.MULTI_POLYGON:
        dispatch(
          onPolygonShowOnMap(
            elemData.coordinates,
            elemData.id,
            layerKey,
            navigation,
          ),
        );
        break;
      default:
        break;
    }
  }, [dispatch, layerKey, elemData]);

  return (
    <View style={{paddingBottom: Math.max(bottom, 0)}}>
      <View style={styles.squreButtonWrapper}>
        {hasEditPermission ? (
          <>
            <IconButton
              iconName="edit"
              label="Details"
              onPress={handleEditDetails}
            />
            <IconButton
              iconName="edit-location"
              label="Location"
              onPress={handleEditLocation}
            />
          </>
        ) : null}
        {layerKey === 'region' ? null : (
          <IconButton
            iconName="language"
            label="Map"
            onPress={handleShowOnMap}
          />
        )}
        {extraControls.map(({control, data}) => {
          switch (control) {
            case 'connections':
              return (
                <IconButton
                  key={control}
                  iconName="cable-data"
                  label={'Connections'}
                  onPress={() =>
                    dispatch(
                      setMapState({
                        event: PLANNING_EVENT.showElementConnections,
                        layerKey,
                        data: {
                          elementId: elemData.id,
                          elementGeometry: elemData.coordinates,
                        },
                      }),
                    )
                  }
                  IconComponent={MaterialCommunityIcons}
                />
              );
            case 'add_associations':
              return (
                <IconButton
                  key={control}
                  iconName="plus"
                  label={'Add\nAssociated\nElements'}
                  onPress={() =>
                    dispatch(
                      showPossibleAddAssociatiation({
                        layerKey,
                        elementData: elemData,
                        listOfLayers: data,
                      }),
                    )
                  }
                  IconComponent={MaterialCommunityIcons}
                />
              );
            case 'association_list':
              return (
                <IconButton
                  key={control}
                  iconName="lan"
                  label={'Show\nAssociations'}
                  onPress={() =>
                    dispatch(
                      showAssociatiationList({
                        layerKey,
                        elementId: elemData.id,
                      }),
                    )
                  }
                  IconComponent={MaterialCommunityIcons}
                />
              );
            case 'ports':
              return (
                <IconButton
                  key={control}
                  iconName="settings-input-composite"
                  label={'Show\nPort Details'}
                  onPress={() =>
                    dispatch(
                      showElementPortDetails({
                        layerKey,
                        elementId: elemData.id,
                      }),
                    )
                  }
                  IconComponent={MaterialIcons}
                />
              );
            default:
              return null;
          }
        })}
      </View>
    </View>
  );
};

export const IconButton = ({
  onPress,
  iconName,
  label,
  IconComponent = MaterialIcons,
}) => {
  return (
    <View style={styles.squreButtonContent}>
      <Pressable style={styles.squreButton} onPress={onPress}>
        <IconComponent
          size={22}
          name={iconName}
          color={THEME_COLORS.secondary.main}
        />
      </Pressable>
      <Text style={styles.squreButtonText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    padding: 12,
  },
  squreButtonText: {
    color: THEME_COLORS.secondary.main,
    paddingTop: 6,
    paddingBottom: 4,
    textAlign: 'center',
  },
});

export default TableActions;
