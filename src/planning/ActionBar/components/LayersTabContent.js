import React, {useCallback, useState} from 'react';
import {View, Pressable, StyleSheet, ScrollView} from 'react-native';

import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {get, noop, size} from 'lodash';

import {Button, Text, Divider, Subheading, Title} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';
import Header from './Header';

import {
  fetchLayerDataThunk,
  fetchLayerList,
} from '~planning/data/actionBar.services';
import {
  getLayerNetworkState,
  getLayerViewData,
} from '~planning/data/planningGis.selectors';
import {
  handleLayerSelect,
  removeLayerSelect,
  setActiveTab,
} from '~planning/data/planningState.reducer';
import {
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';
import {colors} from '~constants/constants';
import {PLANNING_EVENT} from '~planning/GisMap/utils';
import {setMapState} from '~planning/data/planningGis.reducer';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';

const LayersTabContent = ({hideModal}) => {
  /**
   * Render list of elements user can view on map
   * User can click and get data of layers
   * handle layer data loading
   *
   * Parent
   *  ActionBar
   */

  const {isLoading, data: layerCofigs = []} = useQuery(
    'planningLayerConfigs',
    fetchLayerList,
    {
      staleTime: Infinity,
    },
  );
  const regionIdList = useSelector(getSelectedRegionIds);
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);
  const dispatch = useDispatch();

  const handleFullDataRefresh = useCallback(() => {
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(fetchLayerDataThunk({regionIdList, layerKey: currLayerKey}));
    }
  }, [regionIdList, selectedLayerKeys]);

  return (
    <View style={styles.container}>
      {isLoading ? <Loader /> : null}
      <Header text="GIS LAYERS" icon="layers" onClose={hideModal} />
      <View style={styles.titleWrapper}>
        <Title style={styles.title}>Select Layers</Title>
        <Button
          color={colors.success}
          mode="outlined"
          onPress={handleFullDataRefresh}
          icon="sync">
          Refresh
        </Button>
      </View>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {layerCofigs.map(layer => {
          return (
            <LayerTab
              key={layer.layer_key}
              layerConfig={layer}
              regionIdList={regionIdList}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const LayerTab = ({layerConfig, regionIdList}) => {
  const {layer_key, name} = layerConfig;

  const dispatch = useDispatch();
  const [isExpanded, setExpanded] = useState(false);
  const layerNetState = useSelector(getLayerNetworkState(layer_key));

  const isLoading = get(layerNetState, 'isLoading', false);
  const isSelected = get(layerNetState, 'isSelected', false);
  const isFetched = get(layerNetState, 'isFetched', false);
  const count = get(layerNetState, 'count', 0);

  const handleExpandToggle = useCallback(() => {
    setExpanded(expanded => !expanded);
  }, [setExpanded]);

  const onLayerClick = () => {
    if (isLoading) return;
    if (!size(regionIdList)) {
      // show error notification to select regions first
      showToast(
        'Please select region to narrow down your search of elements.',
        TOAST_TYPE.ERROR,
      );
      dispatch(setActiveTab(0));
      return;
    }
    // add / remove current layer to selectedLayers
    if (isSelected) {
      dispatch(removeLayerSelect(layer_key));
    } else {
      dispatch(handleLayerSelect(layer_key));
      // if data for this layer not fetched fire api to get data
      if (!isFetched) {
        dispatch(fetchLayerDataThunk({regionIdList, layerKey: layer_key}));
      }
    }
  };

  return (
    <View>
      <View style={styles.itemWrapper}>
        <Pressable
          style={[styles.expandIcon, {opacity: isFetched ? 1 : 0.3}]}
          onPress={isFetched ? handleExpandToggle : noop}>
          <MaterialIcons
            size={30}
            name={isExpanded ? 'expand-less' : 'expand-more'}
            color={colors.primaryFontColor}
          />
        </Pressable>
        <Pressable style={styles.itemContent} onPress={onLayerClick}>
          <Subheading>
            {name} {isFetched ? `(${count})` : ''}
          </Subheading>
          {isLoading ? (
            <Button loading color={colors.secondaryMain} />
          ) : isSelected ? (
            <MaterialIcons
              size={22}
              name={'check-box'}
              color={colors.secondaryMain}
              style={styles.icon}
            />
          ) : null}
        </Pressable>
      </View>

      <Divider />

      {isExpanded ? <ElementList layerKey={layer_key} /> : null}
    </View>
  );
};

const ElementList = ({layerKey}) => {
  const dispatch = useDispatch();
  // get list of elements for current key
  const {viewData = []} = useSelector(getLayerViewData(layerKey));

  const handleElementClick = useCallback(
    elementId => () => {
      dispatch(setActiveTab(null));
      dispatch(
        setMapState({
          event: PLANNING_EVENT.showElementDetails,
          layerKey,
          data: {elementId},
        }),
      );
    },
    [layerKey],
  );

  return (
    <>
      {viewData.map(element => {
        const {id, name} = element;
        return (
          <Pressable key={id} onPress={handleElementClick(id)}>
            <View style={styles.subItemWrapper}>
              <Text>{name}</Text>
              <MaterialIcons
                size={22}
                name={'my-location'}
                color={colors.primeFontColor}
                style={styles.icon}
              />
            </View>
            <Divider />
          </Pressable>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 10,
  },
  expandIcon: {
    justifyContent: 'center',
    width: 34,
  },
  icon: {
    width: 30,
    justifyContent: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  title: {
    color: colors.primaryMain,
    textAlign: 'center',
  },
  subItemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 34,
  },
});

export default LayersTabContent;
