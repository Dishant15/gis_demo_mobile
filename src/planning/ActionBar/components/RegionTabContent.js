import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, FlatList, Pressable} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {get, difference, noop, groupBy, map, xor, orderBy, size} from 'lodash';

import {Button} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {fetchRegionList} from '~planning/data/actionBar.services';
import {
  getExpandedRegionIds,
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';

import {getFillColor} from '~utils/map.utils';
import {colors} from '~constants/constants';

const RegionTabContent = () => {
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
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);
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

  return (
    <View>
      <View>
        <Text>Select Regions</Text>
        <Button
          // loading={isLoading}
          // contentStyle={layout.button}
          color={colors.success}
          mode="outlined"
          // onPress={handleSubmit(mutate)}
        >
          Done
        </Button>
      </View>
      <FlatList
        data={regionList}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <RegionListItem
              key={item.id}
              region={item}
              regionGroupData={regionGroupData}
              selectedRegion={selectedRegionSet}
              expandedRegions={expandedRegionIds}
              handleRegionClick={handleRegionClick}
              handleRegionExpandClick={noop}
            />
          );
        }}
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

  return (
    <Pressable onPress={() => handleRegionClick(id)}>
      <Text>{name}</Text>
      {isActive ? (
        <MaterialIcons
          size={14}
          name={'check-box'}
          color={colors.secondaryMain}
        />
      ) : null}
    </Pressable>
  );
};

export default RegionTabContent;
