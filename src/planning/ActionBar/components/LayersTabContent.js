import React, {useCallback, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';

import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {get, noop} from 'lodash';

import {Button, Text, Title, Divider, Subheading} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';

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
} from '~planning/data/planningState.reducer';
import {getSelectedRegionIds} from '~planning/data/planningState.selectors';
import {colors} from '~constants/constants';

const regionLayerConfig = {
  layer_key: 'region',
  name: 'Regions',
  can_edit: false,
  can_add: false,
};

const LayersTabContent = () => {
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
      select: data => {
        return [regionLayerConfig, ...data];
      },
    },
  );
  const regionIdList = useSelector(getSelectedRegionIds);

  return (
    <View style={styles.container}>
      {isLoading ? <Loader /> : null}
      <Title style={styles.title}>GIS Layers</Title>
      {layerCofigs.map(layer => {
        return (
          <LayerTab
            key={layer.layer_key}
            layerConfig={layer}
            regionIdList={regionIdList}
          />
        );
      })}
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
            name={'expand-more'}
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
  // get list of elements for current key
  const {viewData = []} = useSelector(getLayerViewData(layerKey));

  return (
    <>
      {viewData.map(element => {
        const {id, name} = element;
        return (
          <View key={id}>
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
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    height: '100%',
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
