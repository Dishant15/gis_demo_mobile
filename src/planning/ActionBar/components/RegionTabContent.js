import React, {useCallback, useMemo, useState} from 'react';
import {View, FlatList, Pressable, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {difference, noop, groupBy, map, xor, orderBy, size, get} from 'lodash';

import {Button, Title, Divider, Subheading} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';
import Header from './Header';

import {fetchRegionList} from '~planning/data/actionBar.services';
import {
  getExpandedRegionIds,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';
import {
  handleRegionExpand,
  setActiveTab,
} from '~planning/data/planningState.reducer';

import {getFillColor} from '~utils/map.utils';
import {colors, layout} from '~constants/constants';
import {onRegionSelectionUpdate} from '~planning/data/planning.actions';

const RegionTabContent = ({hideModal}) => {
  /**
   * Parent
   *  ActionBar
   */

  const {isLoading, data: regionList = []} = useQuery(
    'planningRegionList',
    fetchRegionList,
  );

  const dispatch = useDispatch();
  const selectedRegionIds = useSelector(getSelectedRegionIds);
  const expandedRegionIds = useSelector(getExpandedRegionIds);
  const [selectedRegionSet, setSelectedRegion] = useState(
    new Set(selectedRegionIds),
  );

  const [regionGroupData, baseRegionList] = useMemo(() => {
    // group data by parent
    let resultGroupData = groupBy(regionList, 'parent');
    // get list of parent keys
    const keyList = Object.keys(resultGroupData).map(k => {
      if (k === 'null') return null;
      return Number(k);
    });
    // get all the parent key list that is not in regionList ; e.x. null, or other
    // get list of ids
    const idList = map(regionList, 'id');
    // get difference on keyList and idList
    const mergeList = difference(keyList, idList);
    // concat list of all groups with unknown parents that is our base layer
    let baseRegionList = [];
    for (let mListInd = 0; mListInd < mergeList.length; mListInd++) {
      const rId = mergeList[mListInd];
      baseRegionList = baseRegionList.concat(resultGroupData[String(rId)]);
    }
    // order by layer
    baseRegionList = orderBy(baseRegionList, ['layer'], ['asc']);
    // return cancat list as first base list to render
    return [resultGroupData, baseRegionList];
  }, [regionList]);

  const handleRegionClick = useCallback(regionId => {
    setSelectedRegion(regionSet => {
      let newSet = new Set(regionSet);
      if (newSet.has(regionId)) {
        newSet.delete(regionId);
      } else {
        newSet.add(regionId);
      }
      return newSet;
    });
  }, []);

  const handleRegionSelectionComplete = useCallback(() => {
    const regionIdList = Array.from(selectedRegionSet);
    // can not go forward if region list empty
    if (!size(regionIdList)) return;
    // check if regions changed
    if (size(xor(regionIdList, selectedRegionIds))) {
      dispatch(onRegionSelectionUpdate(regionIdList));
    }
    // change tab to layers
    dispatch(setActiveTab(1));
  }, [selectedRegionSet, selectedRegionIds]);

  const handleRegionExpandClick = useCallback(regionId => {
    dispatch(handleRegionExpand(regionId));
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <Loader /> : null}
      <Header text="ADD ELEMENT" icon="attractions" onClose={hideModal} />
      <View style={styles.titleWrapper}>
        <Title style={styles.title}>Select Regions</Title>
        <Button
          color={colors.success}
          mode="outlined"
          disabled={!size(selectedRegionSet)}
          onPress={handleRegionSelectionComplete}
          icon="check">
          Done
        </Button>
      </View>
      <FlatList
        style={styles.list}
        data={baseRegionList}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <RegionListItem
              key={item.id}
              region={item}
              regionGroupData={regionGroupData}
              selectedRegion={selectedRegionSet}
              expandedRegions={expandedRegionIds}
              handleRegionClick={handleRegionClick}
              handleRegionExpandClick={handleRegionExpandClick}
            />
          );
        }}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={[layout.container, layout.center]}>
              <Subheading>No region data found.</Subheading>
            </View>
          )
        }
      />
    </View>
  );
};

const RegionListItem = ({
  region,
  regionGroupData,
  selectedRegion,
  expandedRegions,
  handleRegionClick,
  handleRegionExpandClick,
}) => {
  const {id, name, layer} = region;
  const color = getFillColor(layer);
  const isActive = selectedRegion.has(id);
  // check if childs are open
  const regionChilds = get(regionGroupData, id, []);
  const hasChildren = !!size(regionChilds);
  const isExpanded = hasChildren && expandedRegions.indexOf(id) > -1;
  const borderColorLeft = isExpanded ? color : null;

  return (
    <View
      style={{
        borderLeftWidth: 1,
        borderLeftColor: isExpanded ? borderColorLeft : colors.transparent,
      }}>
      <View style={styles.wrapper}>
        <Pressable
          style={[styles.expandIcon, {opacity: hasChildren ? 1 : 0.3}]}
          onPress={hasChildren ? () => handleRegionExpandClick(id) : noop}>
          <MaterialIcons
            size={30}
            name={isExpanded ? 'expand-less' : 'expand-more'}
            color={colors.primaryFontColor}
          />
        </Pressable>
        <Pressable
          style={styles.itemContent}
          onPress={() => handleRegionClick(id)}>
          <View style={styles.itemWrapper}>
            <Subheading style={[styles.itemText, {color}]}>{name}</Subheading>
            {isActive ? (
              <MaterialIcons
                size={22}
                name={'check-box'}
                color={colors.secondaryMain}
                style={styles.itemIcon}
              />
            ) : null}
          </View>
        </Pressable>
      </View>
      <Divider />
      {isExpanded
        ? regionChilds.map(regionChild => {
            return (
              <RegionListItem
                key={regionChild.id}
                region={regionChild}
                regionGroupData={regionGroupData}
                selectedRegion={selectedRegion}
                expandedRegions={expandedRegions}
                handleRegionClick={handleRegionClick}
                handleRegionExpandClick={handleRegionExpandClick}
              />
            );
          })
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  list: {
    height: '80%',
    paddingHorizontal: 12,
  },
  title: {
    color: colors.primaryMain,
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    paddingVertical: 8,
  },
  itemIcon: {
    width: 20,
  },
  expandIcon: {
    justifyContent: 'center',
    width: 34,
  },
  itemContent: {
    flex: 1,
  },
});

export default RegionTabContent;
