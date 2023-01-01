import React, {useMemo, useState, useCallback} from 'react';
import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {Subheading, Divider} from 'react-native-paper';

import filter from 'lodash/filter';
import get from 'lodash/get';
import size from 'lodash/size';
import includes from 'lodash/includes';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ElementConfigList from '~planning/ActionBar/components/ElementConfigList';
import Loader from '~Common/Loader';

import {fetchLayerListDetails} from '~planning/data/actionBar.services';
import {
  getPlanningMapState,
  getSelectedConfigurations,
} from '~planning/data/planningGis.selectors';
import {LayerKeyMappings} from '~planning/GisMap/utils';
import {onFetchLayerListDetailsSuccess} from '~planning/data/planning.actions';

import {colors, layout} from '~constants/constants';

const AddAssociationList = ({listOfLayers, parentData, parentLayerKey}) => {
  const {isLoading, data} = useQuery(
    'planningLayerConfigsDetails',
    fetchLayerListDetails,
    {
      staleTime: Infinity,
      onSuccess: layerConfData => {
        dispatch(onFetchLayerListDetailsSuccess(layerConfData));
      },
    },
  );
  const dispatch = useDispatch();
  // if popup open : layerKey of selected configs, null if closed
  const [layerConfigKey, setLayerConfigKey] = useState(null);
  const {event} = useSelector(getPlanningMapState);
  const selectedConfigurations = useSelector(getSelectedConfigurations);

  // shape: [ { layer_key, name, is_configurable, can_add, can_edit,
  //              configuration: [ **list of layer wise configs] }, ... ]
  const layerCofigs = useMemo(() => {
    return filter(data, item => {
      if (item.can_add && includes(listOfLayers, item.layer_key)) {
        return item;
      }
    });
  }, [data]);

  const handleAddElementClick = useCallback(
    layerKey => () => {},
    [parentLayerKey, parentData],
  );

  const handleLayerConfigShow = useCallback(
    layerKey => () => {
      setLayerConfigKey(layerKey);
    },
    [],
  );

  const handleLayerConfigHide = useCallback(() => {
    setLayerConfigKey(null);
  }, []);

  if (layerCofigs.length) {
    return (
      <ScrollView contentContainerStyle={styles.wrapper}>
        {layerCofigs.map(config => {
          const {
            layer_key,
            name,
            is_configurable,
            configuration,
            can_add_on_mobile,
          } = config;
          // do not show
          if (!can_add_on_mobile) return null;
          // get icon
          let Icon;
          const getViewOptions = get(LayerKeyMappings, [
            layer_key,
            'getViewOptions',
          ]);
          if (is_configurable) {
            let currConfig = get(selectedConfigurations, layer_key, false);
            if (!currConfig) currConfig = get(configuration, '0', {});
            // configurable layers will have getIcon function
            Icon = getViewOptions ? getViewOptions(currConfig).icon : null;
          } else {
            Icon = getViewOptions ? getViewOptions().icon : null;
          }

          return (
            <View key={layer_key}>
              <View style={styles.elementContent}>
                <Pressable
                  style={styles.elementTitleContent}
                  onPress={handleAddElementClick(layer_key)}>
                  {Icon ? <Icon width={26} /> : null}
                  <Subheading style={styles.title}>{name}</Subheading>
                </Pressable>
                {is_configurable ? (
                  <Pressable
                    style={styles.iconWrap}
                    onPress={handleLayerConfigShow(layer_key)}>
                    <MaterialIcons
                      size={22}
                      name={'settings'}
                      color={colors.primaryFontColor}
                    />
                  </Pressable>
                ) : null}
              </View>
              <Divider />

              {layer_key === layerConfigKey ? (
                <ElementConfigList
                  onClose={handleLayerConfigHide}
                  layerKey={layerConfigKey}
                />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    );
  } else if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Loader />
      </View>
    );
  } else {
    return (
      <View style={styles.wrapper}>
        <Subheading style={layout.textCenter}>
          There are no elements you can add to network !!
        </Subheading>
      </View>
    );
  }
};

export default AddAssociationList;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  elementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
