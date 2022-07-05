import React from 'react';
import {View, FlatList, StyleSheet, Dimensions} from 'react-native';
import {
  Title,
  Subheading,
  Paragraph,
  Card,
  Chip,
  Divider,
  Headline,
  Button,
} from 'react-native-paper';
import {useQuery} from 'react-query';
import {get, size} from 'lodash';
import {format} from 'date-fns';

import Loader from '~Common/Loader';
import {colors, layout, screens} from '~constants/constants';

import {fetchDashboardData, fetchTicketList} from './data/services';
import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';

const {width} = Dimensions.get('screen');
const CARD_WIDTH = width / 2 - 18;
/**
 * Parent:
 *    drawer.navigation
 */
const DashboardScreen = ({navigation}) => {
  const {isLoading, data, refetch} = useQuery('ticketList', fetchTicketList);
  const {
    isLoading: loadingDashboard,
    data: dashboardData,
    refetch: refetchDashboardData,
  } = useQuery('dashboardData', fetchDashboardData);

  useRefreshOnFocus(refetch);
  useRefreshOnFocus(refetchDashboardData);

  const navigateToWorkorder = id => () => {
    navigation.navigate(screens.workorderScreen, {ticketId: id});
  };

  const navigateSurveyTicketList = () => {
    navigation.navigate(screens.surveyTicketList);
  };

  const navigateNetworkList = () => {
    navigation.navigate(screens.networkScreen);
  };

  const navigateClientList = () => {
    navigation.navigate(screens.clientScreen);
  };

  return (
    <View style={[layout.container, layout.relative, layout.listContainer]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={data}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <>
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
            <Headline style={styles.listHeaderStyle}>My Tickets</Headline>
          </>
        )}
        renderItem={({item}) => {
          const {
            name,
            unique_id,
            ticket_type,
            status,
            network_type,
            due_date,
            created_on,
            remarks,
            region,
          } = item;
          let networkTypeDisplay = '';
          if (network_type === 'B') {
            networkTypeDisplay = 'As Build';
          } else if (network_type === 'P') {
            networkTypeDisplay = 'As Planned';
          }
          let ticketTypeDisplay = '';
          if (ticket_type === 'S') {
            ticketTypeDisplay = 'Survey';
          } else if (ticket_type === 'P') {
            ticketTypeDisplay = 'Planning';
          } else if (ticket_type === 'C') {
            ticketTypeDisplay = 'Client';
          }
          let statusDisplay = '';
          let statusColor = '';
          if (status === 'A') {
            statusColor = '#ed6c02';
            statusDisplay = 'Active';
          } else if (status === 'I') {
            statusColor = '#d32f2f';
            statusDisplay = 'In Active';
          } else if (status === 'C') {
            statusColor = '#2e7d32';
            statusDisplay = 'Completed';
          }
          return (
            <Card
              elevation={2}
              onPress={navigateToWorkorder(item.id)}
              style={styles.cardItem}>
              <Card.Content>
                <View style={styles.cardWrapper}>
                  <View>
                    <Title style={styles.name}>{name}</Title>
                    <Paragraph>Region: {get(region, 'name', '')}</Paragraph>
                  </View>
                  <Subheading style={styles.cardUniqueId}>
                    #{unique_id}
                  </Subheading>
                </View>
                <View style={styles.cardRow}>
                  <Subheading style={styles.label}>Ticket Type</Subheading>
                  <Subheading>:</Subheading>
                  <Subheading style={styles.value}>
                    {ticketTypeDisplay}
                  </Subheading>
                </View>
                <View style={styles.cardRow}>
                  <Subheading style={styles.label}>Created On</Subheading>
                  <Subheading>:</Subheading>
                  <Subheading style={styles.value}>
                    {format(new Date(created_on), 'dd-MM-yyyy')}
                  </Subheading>
                </View>
                <View style={styles.cardRow}>
                  <Subheading style={styles.label}>Due Date</Subheading>
                  <Subheading>:</Subheading>
                  <Subheading style={styles.value}>
                    {format(new Date(due_date), 'dd-MM-yyyy')}
                  </Subheading>
                </View>
                <View style={styles.chipContainer}>
                  <Chip
                    textStyle={styles.chipTextStyle}
                    style={[styles.chipStyle, {backgroundColor: statusColor}]}>
                    {statusDisplay}
                  </Chip>
                  <Subheading>{networkTypeDisplay}</Subheading>
                </View>
                {remarks ? (
                  <>
                    <Divider style={styles.dividerStyle} />
                    <View>
                      <Subheading>Remarks</Subheading>
                      <Paragraph style={styles.primeColot}>{remarks}</Paragraph>
                    </View>
                  </>
                ) : null}
              </Card.Content>
            </Card>
          );
        }}
        onRefresh={refetch}
        refreshing={!!(isLoading && size(data))}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={[layout.container, layout.center]}>
              <Subheading>No ticket assigned yet.</Subheading>
            </View>
          )
        }
      />
      {isLoading || loadingDashboard ? <Loader /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
    flexGrow: 1,
  },
  itemWrapper: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
    borderBottomColor: colors.separator,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardItem: {
    marginBottom: 14,
  },
  cardUniqueId: {
    paddingStart: 4,
    flexShrink: 1,
    // textDecorationLine: 'underline',
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  name: {
    flex: 2,
  },
  label: {
    flex: 1,
    color: colors.primeFontColor,
    fontWeight: '600',
  },
  value: {
    flex: 1.2,
    paddingLeft: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipStyle: {
    marginVertical: 12,
    justifyContent: 'center',
  },
  chipTextStyle: {
    color: colors.white,
    textAlign: 'center',
    alignSelf: 'center',
  },
  dividerStyle: {
    marginTop: 8,
    marginBottom: 12,
  },
  primeColot: {
    color: colors.primeFontColor,
  },
  listHeaderStyle: {
    paddingBottom: 12,
    paddingLeft: 12,
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
