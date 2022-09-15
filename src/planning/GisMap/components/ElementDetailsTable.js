import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';

import get from 'lodash/get';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {fetchElementDetails} from '~planning/data/layer.services';
import {setMapState} from '~planning/data/planningGis.reducer';
import {CustomBottomPopup} from '~Common/CustomPopup';
import Header from '~planning/ActionBar/components/Header';
import {Button, Chip, Divider, Subheading} from 'react-native-paper';
import {colors, layout} from '~constants/constants';
import Loader from '~Common/Loader';

const ElementDetailsTable = ({
  rowDefs,
  layerKey,
  elementId,
  onEditDataConverter,
}) => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const {data: elemData, isLoading} = useQuery(
    ['elementDetails', layerKey, elementId],
    fetchElementDetails,
  );

  const handleCloseDetails = useCallback(() => {
    dispatch(setMapState({}));
  }, [dispatch]);

  const handleEditDetails = useCallback(() => {
    console.log('press');
  }, []);

  const handleEditLocation = useCallback(() => {}, []);

  return (
    <CustomBottomPopup
      wrapperStyle={{
        height: '100%',
        maxHeight: '100%',
        paddingTop: Math.max(top, 0),
      }}
      handleClose={handleCloseDetails}>
      <Header text="Element Details" onClose={handleCloseDetails} />
      {isLoading ? <Loader /> : null}
      <FlatList
        data={rowDefs}
        keyExtractor={item => item.field}
        renderItem={({item, index}) => {
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
                      width: 110,
                    }}
                    selected
                    selectedColor={colors.white}>
                    {get(elemData, `${field}_display`)}
                  </Chip>
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
      <View style={styles.actionWrapper}>
        <Button
          style={[layout.button, styles.btn1]}
          contentStyle={styles.btnContent}
          color={colors.secondaryMain}
          mode="outlined"
          onPress={handleEditDetails}
          // icon="edit"
        >
          Details
        </Button>
        <Button
          style={[layout.button, styles.btn2]}
          contentStyle={styles.btnContent}
          color={colors.secondaryMain}
          mode="outlined"
          onPress={handleEditLocation}
          // icon="edit-location"
        >
          Location
        </Button>
      </View>
    </CustomBottomPopup>
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
