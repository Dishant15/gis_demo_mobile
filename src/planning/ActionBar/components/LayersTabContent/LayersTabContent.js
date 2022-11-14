import React, {useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {Button, Title} from 'react-native-paper';
import Loader from '~Common/Loader';
import Header from '../Header';
import LayerTab from './LayerTab';

import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {
  getSelectedLayerKeys,
  getSelectedRegionIds,
} from '~planning/data/planningState.selectors';
import {
  fetchLayerDataThunk,
  fetchLayerList,
} from '~planning/data/actionBar.services';

import {colors} from '~constants/constants';

const LayersTabContent = ({hideModal}) => {
  /**
   * Render list of elements user can view on map
   * User can click and get data of layers
   * handle layer config data loading
   *
   * Parent
   *  ActionBar
   */
  const dispatch = useDispatch();
  const regionIdList = useSelector(getSelectedRegionIds);
  const selectedLayerKeys = useSelector(getSelectedLayerKeys);

  const {isLoading, data: layerCofigs = []} = useQuery(
    'planningLayerConfigs',
    fetchLayerList,
    {
      staleTime: Infinity,
    },
  );

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
          if (layer.hide_on_mobile) return null;
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
