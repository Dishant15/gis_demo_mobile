import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';

import {Divider, IconButton, Subheading, Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import get from 'lodash/get';

import Loader from '~Common/Loader';

import {colors, THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings} from '~planning/GisMap/utils';

const TableContent = ({elemData, isLoading, layerKey}) => {
  const rowDefs = get(LayerKeyMappings, [layerKey, 'elementTableFields'], []);
  return (
    <>
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
    </>
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

export default TableContent;
