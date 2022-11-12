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
import {
  ELEMENT_TYPE,
  LayerKeyMappings,
  PLANNING_EVENT,
} from '~planning/GisMap/utils';
import {coordsToLatLongMap} from '~utils/map.utils';

const ElementDetailsTable = ({layerKey, onEditDataConverter}) => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const {elementId} = useSelector(getPlanningMapStateData);

  const {data: elemData, isLoading} = useQuery(
    ['elementDetails', layerKey, elementId],
    fetchElementDetails,
  );

  const rowDefs = get(LayerKeyMappings, [layerKey, 'elementTableFields'], []);
  const featureType = get(LayerKeyMappings, [layerKey, 'featureType']);

  const handleBack = useCallback(() => {
    dispatch(setMapState({}));
    navigation.goBack();
  }, [dispatch]);

  const handleEditDetails = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementDetails,
        layerKey,
        data: onEditDataConverter ? onEditDataConverter(elemData) : elemData,
      }),
    );
  }, [dispatch, layerKey, elemData, onEditDataConverter]);

  const handleEditLocation = useCallback(() => {
    dispatch(
      setMapState({
        event: PLANNING_EVENT.editElementLocation,
        layerKey,
        // pass elem data to update edit icon / style based on configs
        data: {
          ...elemData,
          elementId: elemData.id,
          coordinates: elemData.coordinates,
        },
        geometry:
          featureType === ELEMENT_TYPE.POLYLINE ||
          featureType === ELEMENT_TYPE.POLYGON
            ? coordsToLatLongMap(elemData.coordinates)
            : coordsToLatLongMap([elemData.coordinates])[0],
        enableMapInterection: true,
      }),
    );
  }, [dispatch, layerKey, elemData, featureType]);

  return (
    <View style={[layout.container, layout.relative]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
