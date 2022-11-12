import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Card, Subheading, Paragraph, Button, Avatar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import get from 'lodash/get';
import filter from 'lodash/filter';

import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';

import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';

import {layout, screens, colors, THEME_COLORS} from '~constants/constants';

import AcceptImg from '~assets/img/accept.png';
import CancelImg from '~assets/img/cancel.png';
import InprogressImg from '~assets/img/inprogress.png';

import {fetchTicketWorkorderDataThunk} from '~planning/data/ticket.services';
import {getPlanningTicketData} from '~planning/data/planningGis.selectors';
import {navigateTicketWorkorderToDetails} from '~planning/data/event.actions';

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
  const ticketData = useSelector(getPlanningTicketData);
  const {isLoading, work_orders, countByStatus} = ticketData;

  const [statusFilter, setStatusFilter] = useState(null);

  // fetch ticket details
  useEffect(() => {
    dispatch(fetchTicketWorkorderDataThunk(ticketId));
  }, [ticketId]);

  const refetch = useCallback(() => {
    dispatch(fetchTicketWorkorderDataThunk(ticketId));
  }, []);

  useRefreshOnFocus(refetch);

  const navigateToMap = useCallback(() => {
    navigation.navigate(screens.planningTicketMap);
  }, []);

  const navigateToWorkorderDetails = useCallback(
    (index, item) => () => {
      dispatch(navigateTicketWorkorderToDetails(item, navigation));
    },
    [],
  );

  const toggleStatus = useCallback(
    (isActive, newStatus) => () => {
      setStatusFilter(isActive ? null : newStatus);
      // dispatch(setFilteredworkorderList(isActive ? null : newStatus));
    },
    [],
  );

  const filteredList = useMemo(() => {
    if (statusFilter) {
      return filter(work_orders, ['status', statusFilter]);
    } else {
      return work_orders;
    }
  }, [work_orders, statusFilter]);

  const isSubmitted = statusFilter === 'S';
  const isVerified = statusFilter === 'V';
  const isRejected = statusFilter === 'R';

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader
        title={get(ticketData, 'name', '')}
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
          const {layer_key, status, remark, work_order_type} = item;

          return (
            <Pressable
              style={styles.cardItem}
              onPress={navigateToWorkorderDetails(index, item)}>
              <View style={styles.content}>
                <Card.Title
                  style={styles.cardTitle}
                  title={layer_key}
                  left={props => <StatusAvatar status={status} />}
                />
                <Paragraph>Workorder Status - {work_order_type}</Paragraph>
                {!!remark ? <Paragraph>Remarks - {remark}</Paragraph> : null}
              </View>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  size={22}
                  name="chevron-right"
                  color={'#767676'}
                />
              </View>
            </Pressable>
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

const StatusAvatar = ({status}) => {
  if (status === 'V') {
    return <Avatar.Image size={40} source={AcceptImg} />;
  } else if (status === 'R') {
    return <Avatar.Image size={40} source={CancelImg} />;
  } else if (status === 'S') {
    return <Avatar.Image size={40} source={InprogressImg} />;
  }
  return null;
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
    // borderRadius: 4,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
});

export default TicketWorkorderScreen;
