import React, {useCallback, useMemo, useState} from 'react';
import {View, FlatList, Pressable, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {difference, noop, groupBy, map, xor, orderBy, size} from 'lodash';

import {Button, Title, Divider, Subheading} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';
import Header from './Header';

import {
  fetchRegionList,
  fetchLayerDataThunk,
} from '~planning/data/actionBar.services';
import {
  getExpandedRegionIds,
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';
import {
  handleLayerSelect,
  handleRegionSelect,
  setActiveTab,
} from '~planning/data/planningState.reducer';
import {resetUnselectedLayerGisData} from '~planning/data/planningGis.reducer';

import {getFillColor} from '~utils/map.utils';
import {colors, layout} from '~constants/constants';

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

  const handleRegionSelectionComplete = useCallback(() => {
    const regionIdList = Array.from(selectedRegionSet);
    // can not go forward if region list empty
    if (!size(regionIdList)) return;
    // check if regions changed
    if (size(xor(regionIdList, selectedRegionIds))) {
      // set selected regions
      dispatch(handleRegionSelect(regionIdList));
      // add region in selectedLayerKeys if not
      if (selectedLayerKeys.indexOf('region') === -1) {
        dispatch(handleLayerSelect('region'));
      }
      // fetch data gis data for all region polygons
      dispatch(fetchLayerDataThunk({regionIdList, layerKey: 'region'}));
      // re fetch data for each selected layers
      for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
        const currLayerKey = selectedLayerKeys[l_ind];
        dispatch(fetchLayerDataThunk({regionIdList, layerKey: currLayerKey}));
      }
      dispatch(resetUnselectedLayerGisData(selectedLayerKeys));
    }
    dispatch(setActiveTab(null));
  }, [selectedRegionSet, selectedRegionIds, selectedLayerKeys]);

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
        data={regionList}
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
              handleRegionExpandClick={noop}
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

  return (
    <Pressable onPress={() => handleRegionClick(id)}>
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
      <Divider />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
});

export default RegionTabContent;
