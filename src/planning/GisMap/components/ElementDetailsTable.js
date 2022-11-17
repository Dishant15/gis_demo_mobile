import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {
  Button,
  Chip,
  Divider,
  IconButton,
  Subheading,
} from 'react-native-paper';

import get from 'lodash/get';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Loader from '~Common/Loader';
import BackHeader from '~Common/components/Header/BackHeader';

import {fetchElementDetails} from '~planning/data/layer.services';
import {setMapState} from '~planning/data/planningGis.reducer';
import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';

import {colors, layout} from '~constants/constants';
import {LayerKeyMappings, PLANNING_EVENT} from '~planning/GisMap/utils';
import {coordsToLatLongMap} from '~utils/map.utils';
import {navigateEventScreenToMap} from '~planning/data/event.actions';
import {FEATURE_TYPES} from '../layers/common/configuration';
import {checkUserPermission} from '~Authentication/data/auth.selectors';

const ElementDetailsTable = ({layerKey, onEditDataConverter}) => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {elementId} = useSelector(getPlanningMapStateData);
  const hasLayerEditPermission = useSelector(
    checkUserPermission(`${layerKey}_edit`),
  );
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

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [dispatch]);

  const handleEditDetails = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementForm,
        layerKey,
        data: onEditDataConverter ? onEditDataConverter(elemData) : elemData,
      }),
    );
  }, [dispatch, layerKey, elemData, onEditDataConverter]);

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
      navigateEventScreenToMap(
        {
          event: PLANNING_EVENT.editElementGeometry,
          layerKey,
          // pass elem data to update edit icon / style based on configs
          data: {
            ...elemData,
            elementId: elemData.id,
            coordinates: elemData.coordinates,
          },
          geometry,
          enableMapInterection: true,
        },
        navigation,
      ),
    );
  }, [dispatch, layerKey, elemData, featureType]);

  return (
    <View style={styles.container}>
      <BackHeader title="Element Details" onGoBack={handleBack} />
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
                elemStatus === 'V'
                  ? colors.success
                  : elemStatus === 'P'
                  ? colors.warning
                  : colors.error;
              ValueCell = (
                <View style={styles.tableValue}>
                  <Chip
                    style={{
                      backgroundColor: color,
                      width: 140,
                    }}
                    selected
                    selectedColor={colors.white}>
                    {get(elemData, `${field}_display`)}
                  </Chip>
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
        <View
          style={[
            styles.actionWrapper,
            {paddingBottom: Math.max(bottom + 12, 12)},
          ]}>
          <Button
            style={[layout.button, styles.btn1]}
            contentStyle={styles.btnContent}
            color={colors.secondaryMain}
            mode="outlined"
            onPress={handleEditDetails}>
            Details
          </Button>
          <Button
            style={[layout.button, styles.btn2]}
            contentStyle={styles.btnContent}
            color={colors.secondaryMain}
            mode="outlined"
            onPress={handleEditLocation}>
            Location
          </Button>
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
});

export default ElementDetailsTable;
