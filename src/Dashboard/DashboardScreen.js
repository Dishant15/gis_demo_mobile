import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Subheading, Card, Headline, Title, Button} from 'react-native-paper';
import {useQuery} from 'react-query';

import {get, size} from 'lodash';

import Loader from '~Common/Loader';
import RegionWiseTicketSummery from './RegionWiseTicketSummery';

import {fetchDashboardData} from './data/services';
import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';

import {layout, screens} from '~constants/constants';

const {width} = Dimensions.get('screen');
const CARD_WIDTH = width / 2 - 18;
/**
 * Parent:
 *    drawer.navigation
 */
const DashboardScreen = ({navigation}) => {
  const {
    isLoading: loadingDashboard,
    data: dashboardData,
    refetch: refetchDashboardData,
  } = useQuery('dashboardData', fetchDashboardData);

  useRefreshOnFocus(refetchDashboardData);

  const navigateSurveyTicketList = () => {
    navigation.navigate(screens.planningTicketList);

    // navigation.navigate(screens.surveyTicketList);
  };

  const navigateNetworkList = () => {
    navigation.navigate(screens.planningTicketList);
  };

  const navigateClientList = () => {
    navigation.navigate(screens.clientScreen);
  };

  const refreshing = loadingDashboard && !size(dashboardData);
  return (
    <View style={[layout.container, layout.relative, layout.listContainer]}>
      <ScrollView
        style={styles.contentContainerStyle}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetchDashboardData}
          />
        }>
        <Title style={styles.title1}>Ticket statistics</Title>
        <View style={styles.squreCardContainer}>
          <Card
            elevation={2}
            onPress={navigateSurveyTicketList}
            style={styles.squreCard}>
            <Card.Content style={styles.content}>
              <View style={styles.squreCardWrapper}>
                <Subheading>Active Tickets</Subheading>
                <Headline style={styles.headline}>
                  {get(dashboardData, 'ticket_count', 0)}
                </Headline>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>View All</Button>
            </Card.Actions>
          </Card>
        </View>
        {/* <RegionWiseTicketSummery /> */}
      </ScrollView>
      {loadingDashboard ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  squreCard: {
    width: CARD_WIDTH,
    minHeight: CARD_WIDTH * 0.8,
  },
  squreCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    alignItems: 'stretch',
  },
  squreCardWrapper: {},
  headline: {
    fontSize: 42,
    lineHeight: 56,
  },
  title1: {
    paddingBottom: 8,
  },
});

export default DashboardScreen;
