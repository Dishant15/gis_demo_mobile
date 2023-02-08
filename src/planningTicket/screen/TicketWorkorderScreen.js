import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  Subheading,
  Paragraph,
  Button,
  Caption,
  Divider,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import get from 'lodash/get';
import filter from 'lodash/filter';

import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';

import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';

import {layout, colors, THEME_COLORS, screens} from '~constants/constants';

import {
  fetchSurveyTicketWorkorderDataThunk,
  fetchTicketDetailsThunk,
} from '~planning/data/ticket.services';
import {
  getSurveyTicketWo,
  getTicketDetails,
} from '~planning/data/planningGis.selectors';
import {onViewMapClick} from '~planning/data/event.actions';
import {LayerKeyMappings, LayerKeyNameMapping} from '~planning/GisMap/utils';
import {
  onWorkOrderListItemClick,
  openElementDetails,
} from '~planning/data/planning.actions';
import {setTicketWorkOrderId} from '~planning/data/planningGis.reducer';

/**
 * Parent:
 *  Root navigation
 *
 * called on ticket click
 */
const TicketWorkorderScreen = props => {
  const {navigation} = props;
  const ticketId = get(props, 'route.params.ticketId');

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [statusFilter, setStatusFilter] = useState(null);

  const surveyTicketData = useSelector(getTicketDetails);
  const surveyTicketWorkorder = useSelector(getSurveyTicketWo);

  useEffect(() => {
    dispatch(fetchSurveyTicketWorkorderDataThunk(ticketId));
    dispatch(fetchTicketDetailsThunk(ticketId));
  }, [ticketId]);

  const refetch = useCallback(() => {
    dispatch(fetchSurveyTicketWorkorderDataThunk(ticketId));
    dispatch(fetchTicketDetailsThunk(ticketId));
  }, [ticketId]);

  useRefreshOnFocus(refetch);

  const navigateToMap = useCallback(() => {
    dispatch(onViewMapClick(navigation));
  }, []);

  const toggleStatus = useCallback(
    (isActive, newStatus) => () => {
      setStatusFilter(isActive ? null : newStatus);
    },
    [],
  );

  const handleShowOnMap = useCallback(
    (elementId, layerKey) => () => {
      dispatch(onWorkOrderListItemClick(elementId, layerKey, navigation));
    },
    [],
  );

  const handleShowDetails = useCallback(
    (workOrderId, elementId, layerKey) => () => {
      dispatch(setTicketWorkOrderId(workOrderId));
      dispatch(
        openElementDetails({
          layerKey,
          elementId,
        }),
      );
      navigation.navigate(screens.planningStack, {
        screen: screens.gisEventScreen,
      });
    },
    [],
  );

  const filteredList = useMemo(() => {
    if (statusFilter) {
      return filter(surveyTicketWorkorder.list, ['status', statusFilter]);
    } else {
      return surveyTicketWorkorder.list;
    }
  }, [surveyTicketWorkorder.list, statusFilter]);

  const isSubmitted = statusFilter === 'S';
  const isVerified = statusFilter === 'V';
  const isRejected = statusFilter === 'R';
  const countByStatus = {};

  const isLoading =
    surveyTicketData.isLoading || surveyTicketWorkorder.isLoading;

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader
        title={get(surveyTicketData, 'name', '')}
        onGoBack={navigation.goBack}
      />
      <View style={styles.filterWrapper}>
        <Pressable
          style={[styles.filterblock, isSubmitted && styles.filterSubmited]}
          onPress={toggleStatus(isSubmitted, 'S')}>
          <Paragraph
            style={[styles.filterblockText, isSubmitted && styles.filterWhite]}>
            Submited ({get(countByStatus, 'S', 0)})
          </Paragraph>
        </Pressable>
        <View style={styles.filterDivider} />
        <Pressable
          style={[styles.filterblock, isVerified && styles.filterVerified]}
          onPress={toggleStatus(isVerified, 'V')}>
          <Paragraph
            style={[styles.filterblockText, isVerified && styles.filterWhite]}>
            Verified ({get(countByStatus, 'V', 0)})
          </Paragraph>
        </Pressable>
        <View style={styles.filterDivider} />
        <Pressable
          style={[styles.filterblock, isRejected && styles.filterRejected]}
          onPress={toggleStatus(isRejected, 'R')}>
          <Paragraph
            style={[styles.filterblockText, isRejected && styles.filterWhite]}>
            Rejected ({get(countByStatus, 'R', 0)})
          </Paragraph>
        </Pressable>
      </View>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={filteredList}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const {
            id: workOrderId,
            element_id: elementId,
            layer_key,
            status,
            work_order_type,
          } = item;
          const Icon = LayerKeyMappings[layer_key]['getViewOptions'](item).icon;
          const name = LayerKeyNameMapping[layer_key];
          return (
            <View style={styles.container}>
              <View style={styles.wrapper}>
                <View
                  style={[
                    styles.networkStatus,
                    {
                      backgroundColor:
                        work_order_type === 'A'
                          ? colors.success
                          : colors.warning,
                    },
                  ]}
                />
                <View style={styles.itemIconWrapper}>
                  <View style={styles.iconBlock}>
                    <Icon size={30} />
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      {backgroundColor: getStatusColor(status)},
                    ]}
                  />
                </View>
                <Pressable
                  style={styles.textWrapper}
                  onPress={handleShowDetails(
                    workOrderId,
                    elementId,
                    layer_key,
                  )}>
                  <Subheading numberOfLines={3} ellipsizeMode="tail">
                    {name}
                  </Subheading>
                  <Caption numberOfLines={3} ellipsizeMode="tail">
                    #{'network_id'}
                  </Caption>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable
                  style={styles.actionWrapper}
                  onPress={handleShowOnMap(elementId, layer_key)}>
                  <View style={styles.squreButton}>
                    <MaterialIcons
                      size={28}
                      name="language"
                      color={THEME_COLORS.action.active}
                    />
                  </View>
                </Pressable>
              </View>
              <Divider style={styles.divider} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Subheading>Workorder list is Empty</Subheading>
          </View>
        }
      />
      <Button
        style={[styles.buttonStyle, {marginBottom: insets.bottom || 12}]}
        contentStyle={layout.button}
        color={THEME_COLORS.secondary.main}
        labelStyle={{
          color: THEME_COLORS.secondary.contrastText,
        }}
        uppercase
        mode="contained"
        icon={'map-marker-path'}
        onPress={navigateToMap}>
        View on map
      </Button>
      {isLoading ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    minHeight: 'auto',
    paddingLeft: 0,
    paddingBottom: 4,
  },
  cardItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
    borderBottomColor: colors.separator,
    borderBottomWidth: 1,
  },
  cardHeader: {
    marginVertical: 12,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10,
    marginTop: 8,
  },
  contentContainerStyle: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  buttonStyle: {
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterWrapper: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginBottom: 2,
  },
  filterblock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#f3f3f3',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  filterblockText: {
    color: 'rgba(0,0,0,.57)',
    paddingVertical: 10,
  },
  filterSubmited: {
    backgroundColor: colors.warning,
  },
  filterRejected: {
    backgroundColor: colors.error,
  },
  filterVerified: {
    backgroundColor: colors.success,
  },
  filterWhite: {
    color: colors.white,
  },
  filterDivider: {
    width: 1.1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  container: {
    // paddingHorizontal: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
  },
  itemIconWrapper: {
    padding: 5,
    position: 'relative',
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
    // borderWidth: 1,
  },
  actionDivider: {
    backgroundColor: colors.dividerColor,
    width: StyleSheet.hairlineWidth,
  },
  actionWrapper: {
    height: 60,
    minWidth: 50,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  squreButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: colors.dividerColor,
  },
  networkStatus: {
    width: 5,
    alignSelf: 'stretch',
    marginRight: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const getStatusColor = status => {
  switch (status) {
    case 'V':
      return colors.success;
    case 'R':
      return colors.error;
    case 'S':
      return colors.warning;
    default:
      return colors.secondaryMain;
  }
};

export default TicketWorkorderScreen;
