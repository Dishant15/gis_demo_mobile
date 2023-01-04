import React, {useCallback, useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Title} from 'react-native-paper';

import size from 'lodash/size';

import {CustomBottomPopup} from '~Common/CustomPopup';
import Checkbox from '~Common/components/Checkbox';
import Header from '~planning/ActionBar/components/Header';

import {
  getMapHighlighted,
  getPlanningMapFilters,
  getPlanningMapStateEvent,
  getTicketMapHighlighted,
} from '~planning/data/planningGis.selectors';
import {
  resetFilters,
  resetMapHighlight,
  resetTicketMapHighlight,
  setFilter,
} from '~planning/data/planningGis.reducer';
import {selectElementsOnMapClick} from '~planning/data/event.actions';
import {LAYER_STATUS_OPTIONS} from '../layers/common/configuration';
import {colors} from '~constants/constants';
import {PLANNING_EVENT} from '../utils';

// increament as per how many btns added below this ActionBar
const ACTION_BUTTON_SIZE = 84;

/**
 * Parent:
 *    PlanningScreen
 */
const MapActionBar = () => {
  const dispatch = useDispatch();
  const mapStateEvent = useSelector(getPlanningMapStateEvent);
  const mapHighlight = useSelector(getMapHighlighted);
  const ticketMapHighlight = useSelector(getTicketMapHighlighted);

  const [showFilter, setShowFilter] = useState(false);
  const {bottom} = useSafeAreaInsets();
  const {status} = useSelector(getPlanningMapFilters);

  const handleShowFilter = useCallback(() => setShowFilter(true), []);
  const handleHideFilter = useCallback(() => setShowFilter(false), []);

  const handleResetHighlight = useCallback(() => {
    dispatch(resetMapHighlight());
  }, []);

  const handleResetTicketHighlight = useCallback(() => {
    dispatch(resetTicketMapHighlight());
  }, []);

  return (
    <>
      <View
        style={[
          styles.actionWrapper,
          {
            bottom: Math.max(
              bottom + ACTION_BUTTON_SIZE * 3.7,
              ACTION_BUTTON_SIZE * 3.7,
            ),
          },
        ]}>
        <TouchableOpacity
          style={[styles.action]}
          onPress={() => dispatch(selectElementsOnMapClick)}>
          <MaterialIcons
            size={30}
            name="touch-app"
            color={
              mapStateEvent === PLANNING_EVENT.selectElementsOnMapClick
                ? colors.secondaryMain
                : colors.primaryFontColor
            }
          />
        </TouchableOpacity>
        {!!size(mapHighlight) ? (
          <TouchableOpacity
            style={[styles.action]}
            onPress={handleResetHighlight}>
            <MaterialCommunityIcons
              size={30}
              name="stop-circle"
              color={colors.secondaryMain}
            />
          </TouchableOpacity>
        ) : null}
        {!!size(ticketMapHighlight) ? (
          <TouchableOpacity
            style={[styles.action]}
            onPress={handleResetTicketHighlight}>
            <MaterialCommunityIcons
              size={30}
              name="stop-circle"
              color={colors.secondaryMain}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={[styles.action]} onPress={handleShowFilter}>
          <MaterialIcons
            size={30}
            name="filter-alt"
            color={status ? colors.secondaryMain : colors.primaryFontColor}
          />
        </TouchableOpacity>
      </View>
      {showFilter ? (
        <FilterBlock onClose={handleHideFilter} status={status} />
      ) : null}
    </>
  );
};

const FilterBlock = ({onClose, status}) => {
  const [currStatus, setCurrStatus] = useState(status);
  const dispatch = useDispatch();
  // set redux filter to internal state
  useEffect(() => {
    setCurrStatus(status);
  }, [status]);

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    onClose();
  }, []);

  const handleApply = useCallback(() => {
    if (currStatus) {
      dispatch(
        setFilter({
          filterKey: 'status',
          filterValue: currStatus,
        }),
      );
    }
    onClose();
  }, [currStatus]);

  return (
    <CustomBottomPopup justifyContent="flex-end" handleClose={onClose}>
      <View style={styles.container}>
        <Header text="Filters" icon="filter-alt" onClose={onClose} />
        <ScrollView contentContainerStyle={styles.wrapper}>
          <Title>Status</Title>
          {LAYER_STATUS_OPTIONS.map(ops => {
            return (
              <Checkbox
                key={ops.value}
                style={styles.checkbox}
                checked={currStatus === ops.value}
                label={ops.label}
                onChange={() => setCurrStatus(ops.value)}
              />
            );
          })}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={handleReset}>
              <Button mode="outlined" color={colors.error}>
                Reset
              </Button>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply}>
              <Button mode="outlined" color={colors.secondaryMain}>
                Apply
              </Button>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </CustomBottomPopup>
  );
};

const styles = StyleSheet.create({
  actionWrapper: {
    position: 'absolute',
    right: 11,
    zIndex: 1,
  },
  action: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // model design
  container: {
    // height: '100%',
  },
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 30,
    paddingTop: 6,
  },
  checkbox: {
    paddingVertical: 6,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
});

export default MapActionBar;
