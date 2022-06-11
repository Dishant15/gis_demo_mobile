import React from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {Title, Subheading, Paragraph} from 'react-native-paper';
import {useQuery} from 'react-query';
import {get, size} from 'lodash';

import Loader from '~Common/Loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, layout, screens} from '~constants/constants';
import {fetchTicketList} from '~Dashboard/data/services';

/**
 * Renders survey ticket list
 *
 * when user clicks on any area it will navigate to survey list of that area
 *
 * Parent
 *    drawer.navigation
 */
const SurveyTicketList = props => {
  const {navigation} = props;
  const {isLoading, data, refetch} = useQuery('ticketList', fetchTicketList);

  const navigateToWorkorder = id => () => {
    navigation.navigate(screens.workorderScreen, {ticketId: id});
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
            unique_id,
            ticket_type,
            status,
            network_type,
            due_date,
            remarks,
            region,
          } = item;
          return (
            <Pressable
              style={styles.itemWrapper}
              onPress={navigateToWorkorder(item.id)}>
              <View style={styles.content}>
                <Title>{unique_id}</Title>
                <Title>{name}</Title>
                <Paragraph>
                  {ticket_type} - {network_type}
                </Paragraph>
                <Paragraph>
                  {get(region, 'name', '')} {due_date}
                </Paragraph>
                <Paragraph>
                  {status} {remarks}
                </Paragraph>
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
});

export default SurveyTicketList;
