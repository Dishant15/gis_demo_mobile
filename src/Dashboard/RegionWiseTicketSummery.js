import React, {useCallback, useMemo, useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {
  Subheading,
  Card,
  Text,
  Headline,
  Title,
  ActivityIndicator,
} from 'react-native-paper';

import {useQuery} from 'react-query';

import get from 'lodash/get';
import size from 'lodash/size';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import difference from 'lodash/difference';
import orderBy from 'lodash/orderBy';
import noop from 'lodash/noop';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {fetchDashSurveySummery} from './data/services';
import {colors, THEME_COLORS} from '~constants/constants';

const RegionWiseTicketSummery = () => {
  const {data: regionSummeryData, isLoading} = useQuery(
    'surveySummery',
    fetchDashSurveySummery,
    {
      staleTime: 5 * 60000, // 5 minutes
    },
  );

  const [expandedRegions, setExpandedRegions] = useState(new Set([]));

  const [regionGroupData, baseRegionList] = useMemo(() => {
    const regionInputList = regionSummeryData || [];
    // group data by parent
    let resultGroupData = groupBy(regionInputList, 'parent');
    // get list of parent keys
    const keyList = Object.keys(resultGroupData).map(k => {
      if (k === 'null') return null;
      return Number(k);
    });
    // get all the parent key list that is not in regionInputList ; e.x. null, or other
    // get list of ids
    const idList = map(regionInputList, 'id');
    // get difference on keyList and idList
    const mergeList = difference(keyList, idList);
    // concat list of all groups with unknown parents that is our base layer
    let baseRegionList = [];
    for (let mListInd = 0; mListInd < mergeList.length; mListInd++) {
      const rId = mergeList[mListInd];
      baseRegionList = baseRegionList.concat(resultGroupData[String(rId)]);
    }
    // order by layer
    baseRegionList = orderBy(
      baseRegionList,
      [region => region.name.toLowerCase()],
      ['asc'],
    );
    // return cancat list as first base list to render
    return [resultGroupData, baseRegionList];
  }, [regionSummeryData]);

  const handleRegionExpandClick = useCallback(
    regId => () => {
      setExpandedRegions(regionSet => {
        let newSet = new Set(regionSet);
        if (newSet.has(regId)) {
          newSet.delete(regId);
        } else {
          newSet.add(regId);
        }
        return newSet;
      });
    },
    [setExpandedRegions],
  );

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Title style={styles.title1}>Survey Summary overview</Title>
        <ActivityIndicator
          animating={true}
          color={colors.darkGreyColor}
          size="large"
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Title style={styles.title1}>Survey Summary overview</Title>
      {baseRegionList.map(region => {
        return (
          <RegionSummeryItem
            key={region.id}
            region={region}
            regionGroupData={regionGroupData}
            expandedRegions={expandedRegions}
            handleRegionExpandClick={handleRegionExpandClick}
          />
        );
      })}
    </View>
  );
};

const RegionSummeryItem = ({
  region,
  regionGroupData,
  expandedRegions,
  handleRegionExpandClick,
}) => {
  const {id, name, ticket_count} = region;

  // check if childs are open
  const regionChilds = useMemo(() => {
    return orderBy(
      get(regionGroupData, id, []),
      [region => region.name.toLowerCase()],
      ['asc'],
    );
  }, [regionGroupData, id]);
  const hasChildren = !!size(regionChilds);
  const isExpanded = hasChildren && expandedRegions.has(id);

  const opacity = hasChildren ? 1 : 0.5;

  return (
    <>
      <Card elevation={2} key={region.id} style={styles.itemWrapper}>
        <Card.Content style={styles.itemContent}>
          <View
            style={[styles.borderLeft, isExpanded ? styles.highlight : {}]}
          />
          <Pressable
            style={[styles.expandIcon, {opacity}]}
            onPress={hasChildren ? handleRegionExpandClick(id) : noop}>
            <MaterialIcons
              size={30}
              name={isExpanded ? 'expand-less' : 'expand-more'}
              color={colors.primaryFontColor}
            />
          </Pressable>
          <Subheading style={[styles.name, {opacity}]}>{name}</Subheading>
          <Headline style={styles.ticketCount}>{ticket_count}</Headline>
        </Card.Content>
      </Card>
      {isExpanded
        ? regionChilds.map(regionChild => {
            return (
              <RegionSummeryItem
                key={regionChild.id}
                region={regionChild}
                regionGroupData={regionGroupData}
                expandedRegions={expandedRegions}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })
        : null}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 60,
  },
  title1: {
    paddingBottom: 10,
  },
  itemWrapper: {
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    justifyContent: 'center',
    width: 42,
    paddingLeft: 6,
  },
  name: {
    flex: 1,
  },
  ticketCount: {
    color: THEME_COLORS.primary.main,
  },
  borderLeft: {height: '100%', width: 3},
  highlight: {backgroundColor: colors.black},
});

export default RegionWiseTicketSummery;
