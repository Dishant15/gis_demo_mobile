import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Subheading, Card, Headline, Button} from 'react-native-paper';
import {useQuery} from 'react-query';

import {get, noop, size} from 'lodash';

import Loader from '~Common/Loader';

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
    navigation.navigate(screens.surveyTicketList);
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
        <View style={styles.squreCardContainer}>
          <Card
            elevation={2}
            onPress={navigateSurveyTicketList}
            style={styles.squreCard}>
            <Card.Content style={styles.content}>
              <View style={styles.squreCardWrapper}>
                <Subheading>Survey Tickets</Subheading>
                <Headline style={styles.headline}>
                  {get(dashboardData, 'survey_ticket_count', 0)}
                </Headline>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>View All</Button>
            </Card.Actions>
          </Card>
          <Card
            elevation={2}
            onPress={navigateNetworkList}
            style={styles.squreCard}>
            <Card.Content style={styles.content}>
              <View style={styles.squreCardWrapper}>
                <Subheading>Network Tickets</Subheading>
                <Headline style={styles.headline}>
                  {get(dashboardData, 'network_ticket_count', 0)}
                </Headline>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>View All</Button>
            </Card.Actions>
          </Card>
        </View>
        <View style={styles.squreCardContainer}>
          <Card
            elevation={2}
            onPress={navigateClientList}
            style={styles.squreCard}>
            <Card.Content style={styles.content}>
              <View style={styles.squreCardWrapper}>
                <Subheading>Client Tickets</Subheading>
                <Headline style={styles.headline}>
                  {get(dashboardData, 'client_ticket_count', 0)}
                </Headline>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>View All</Button>
            </Card.Actions>
          </Card>
        </View>
        {/* <DynamicForm
          formConfigs={FORM_CONFIGS}
          data={INITIAL_DATA}
          onSubmit={data => console.log(data)}
          onClose={noop}
          isLoading={false}
        /> */}
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
    height: CARD_WIDTH * 0.8,
  },
  squreCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  squreCardWrapper: {},
  headline: {
    fontSize: 42,
    lineHeight: 56,
  },
});

export default DashboardScreen;
