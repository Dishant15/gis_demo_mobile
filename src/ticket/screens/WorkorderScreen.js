import {get, noop} from 'lodash';
import React, {useEffect, useCallback} from 'react';
import {useQuery} from 'react-query';
import {
  setFilteredSurveyList,
  setTaskData,
} from '~GeoServey/data/geoSurvey.reducer';
import {fetchTicketWorkorders} from '~ticket/data/services';

import {View, FlatList, StyleSheet, Pressable, Switch} from 'react-native';
import {
  Card,
  Title,
  Subheading,
  Paragraph,
  Chip,
  Button,
  Avatar,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {replace, size} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import BackHeader from '~Common/components/Header/BackHeader';

import {setReview, setSurveyData} from '~GeoServey/data/geoSurvey.reducer';
import {layout, screens, colors} from '~constants/constants';

import {
  getAppliedStatusFilter,
  getCountByStatus,
  getFilteredSurveyList,
} from '~GeoServey/data/geoSurvey.selectors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';
import Loader from '~Common/Loader';

import AcceptImg from '~assets/img/accept.png';
import CancelImg from '~assets/img/cancel.png';
import InprogressImg from '~assets/img/inprogress.png';

/**
 * Parent:
 *  Root navigation
 *
 * called on ticket click
 */
const WorkorderScreen = props => {
  const {navigation} = props;
  const ticketId = get(props, 'route.params.ticketId');
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const {isLoading, data, refetch} = useQuery(
    ['ticketWorkOrderList', ticketId],
    fetchTicketWorkorders,
    {
      initialData: {},
      onSuccess: res => {
        dispatch(setTaskData(res));
      },
    },
  );

  useRefreshOnFocus(refetch);

  // get survey list from redux store
  const surveyList = useSelector(getFilteredSurveyList);
  const statusFilter = useSelector(getAppliedStatusFilter);
  const countByStatus = useSelector(getCountByStatus);

  useEffect(() => {
    dispatch(setReview(false));
  }, []);

  const navigateToMap = useCallback(() => {
    dispatch(setSurveyData(null));
    dispatch(setReview(false));
    navigation.navigate(screens.surveyMap);
  }, []);

  const toggleStatus = useCallback(
    (isActive, newStatus) => () => {
      dispatch(setFilteredSurveyList(isActive ? null : newStatus));
    },
    [],
  );

  const isSubmitted = statusFilter === 'S';
  const isVerified = statusFilter === 'V';
  const isRejected = statusFilter === 'R';
  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Workorders" onGoBack={navigation.goBack} />
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
        data={surveyList}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          const {name, area, pincode, tags, status, remark} = item;

          return (
            <Pressable
              style={styles.cardItem}
              onPress={() => {
                dispatch(
                  setSurveyData({
                    surveyIndex: index,
                    surveyData: item,
                  }),
                );
                navigation.navigate(screens.reviewScreen);
              }}>
              <View style={styles.content}>
                <Card.Title
                  style={styles.cardTitle}
                  title={name}
                  left={props => <StatusAvatar status={status} />}
                />
                <Paragraph>
                  {area} - {pincode}
                </Paragraph>
                <Paragraph>Total Units - {size(item.units)}</Paragraph>
                {!!remark ? <Paragraph>Remarks - {remark}</Paragraph> : null}
                <View style={styles.chipWrapper}>
                  {tags.map(tag => (
                    <Chip
                      key={tag}
                      style={styles.chip}
                      textStyle={styles.chipTextStyle}>
                      {replace(tag, '_', ' ')}
                    </Chip>
                  ))}
                </View>
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
            <Subheading>Survey list is Empty</Subheading>
          </View>
        }
      />
      <Button
        style={[styles.buttonStyle, {marginBottom: insets.bottom || 12}]}
        contentStyle={layout.button}
        color={colors.black}
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

export default WorkorderScreen;
