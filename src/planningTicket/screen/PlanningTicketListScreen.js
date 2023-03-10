import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Title,
  Subheading,
  Paragraph,
  Card,
  Chip,
  Divider,
} from 'react-native-paper';
import {useQuery} from 'react-query';
import {format} from 'date-fns';
import {useDispatch} from 'react-redux';

import filter from 'lodash/filter';
import get from 'lodash/get';
import size from 'lodash/size';

import Loader from '~Common/Loader';

import {useRefreshOnFocus} from '~utils/useRefreshOnFocus';
import {fetchTicketList} from '~Dashboard/data/services';
import {onTicketClick} from '~planningTicket/data/planningTicket.action';

import {colors, layout} from '~constants/constants';

const PlanningTicketListScreen = props => {
  const dispatch = useDispatch();
  const {navigation} = props;

  const {isLoading, data, refetch} = useQuery(
    // ['ticketList', 'P'],
    ['ticketList', 'S'],
    fetchTicketList,
  );

  useRefreshOnFocus(refetch);

  const navigateToWorkorder = id => () => {
    dispatch(onTicketClick(navigation, id));
  };

  return (
    <View style={[layout.container, layout.relative]}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const {
            name,
            network_id,
            ticket_type,
            status,
            network_type,
            due_date,
            created_on,
            remarks,
            region,
            assignee,
          } = item;
          let networkTypeDisplay = '';
          if (network_type === 'L1') {
            networkTypeDisplay = 'L1 Design';
          } else if (network_type === 'L2') {
            networkTypeDisplay = 'L2 Design';
          } else if (network_type === 'RFS') {
            networkTypeDisplay = 'Ready For Service';
          } else {
            networkTypeDisplay = 'In Active';
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
                <Title style={styles.name}>{name}</Title>
                <Subheading style={styles.cardUniqueId}>
                  #{network_id}
                </Subheading>
                <Paragraph>Region: {get(region, 'name', '')}</Paragraph>
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
                {!!assignee ? (
                  <View style={styles.cardRow}>
                    <Subheading style={styles.label}>Assignee</Subheading>
                    <Subheading>:</Subheading>
                    <Subheading style={styles.value}>
                      {assignee.name}
                    </Subheading>
                  </View>
                ) : null}
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
      {isLoading ? <Loader /> : null}
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
    alignSelf: 'flex-end',
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
});
export default PlanningTicketListScreen;
