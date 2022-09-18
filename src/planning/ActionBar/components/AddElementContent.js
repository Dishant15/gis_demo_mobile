import React, {useMemo, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {filter, get, size} from 'lodash';
import {Subheading, Divider} from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';
import Header from './Header';
import ElementConfigList from './ElementConfigList';

import {fetchLayerListDetails} from '~planning/data/actionBar.services';
import {
  setMapState,
  setTicketWorkOrderId,
} from '~planning/data/planningGis.reducer';
import {setActiveTab} from '~planning/data/planningState.reducer';
import {
  selectConfiguration,
  setLayerConfigurations,
} from '~planning/data/planningState.reducer';
import {
  getPlanningMapState,
  getSelectedConfigurations,
} from '~planning/data/planningGis.selectors';
import {
  getElementTypeFromLayerKey,
  LayerKeyMappings,
  PLANNING_EVENT,
  TICKET_WORKORDER_TYPE,
} from '~planning/GisMap/utils';

import {ICONS} from '~utils/icons';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {colors, layout} from '~constants/constants';
import {getSelectedPlanningTicket} from '~planningTicket/data/planningTicket.selector';

/**
 * Parent:
 *    ActionBar
 */
const AddElementContent = ({hideModal}) => {
  const {isLoading, data} = useQuery(
    'planningLayerConfigsDetails',
    fetchLayerListDetails,
    {
      staleTime: Infinity,
      onSuccess: layerConfData => {
        // res shape same as layerConfigs bellow
        if (!!size(layerConfData)) {
          for (let lc_ind = 0; lc_ind < layerConfData.length; lc_ind++) {
            const {layer_key, is_configurable, configuration} =
              layerConfData[lc_ind];
            if (is_configurable) {
              // if layerConfData is there set layer configs in redux
              dispatch(
                setLayerConfigurations({
                  layerKey: layer_key,
                  configurationList: configuration,
                }),
              );
              // select default configs to show first
              dispatch(
                selectConfiguration({
                  layerKey: layer_key,
                  configuration: configuration[0],
                }),
              );
            }
          }
        }
      },
    },
  );

  const dispatch = useDispatch();
  // if popup open : layerKey of selected configs, null if closed
  const [layerConfigKey, setLayerConfigKey] = useState(null);
  const {event} = useSelector(getPlanningMapState);
  const selectedConfigurations = useSelector(getSelectedConfigurations);
  const ticketId = useSelector(getSelectedPlanningTicket);

  // shape: [ { layer_key, name, is_configurable, can_add, can_edit,
  //              configuration: [ **list of layer wise configs] }, ... ]
  const layerCofigs = useMemo(() => {
    return filter(data, ['can_add', true]);
  }, [data]);

  const handleAddElementClick = useCallback(
    layerKey => () => {
      // show error if one event already running
      if (event) {
        showToast(
          'Please complete current operation before starting new',
          TOAST_TYPE.INFO,
        );
        return;
      }
      // start event if no other event running
      dispatch(
        setMapState({
          event: PLANNING_EVENT.addElement,
          layerKey,
          enableMapInterection: true,
          elementType: getElementTypeFromLayerKey(layerKey),
        }),
      );
      if (ticketId) {
        dispatch(setTicketWorkOrderId(TICKET_WORKORDER_TYPE.ADD));
      }
      dispatch(setActiveTab(null));
    },
    [event, ticketId],
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
      <View>
        {isLoading ? <Loader /> : null}
        <Header text="ADD ELEMENT" icon="add-location" onClose={hideModal} />
        <ScrollView style={styles.container}>
          {layerCofigs.map(config => {
            const {layer_key, name, is_configurable, configuration} = config;
            // get icon
            let Icon;
            if (is_configurable) {
              let currConfig = get(selectedConfigurations, layer_key, false);
              if (!currConfig) currConfig = configuration[0];
              // configurable layers will have getIcon function
              Icon = LayerKeyMappings[layer_key]['Icon'](currConfig);
            } else {
              Icon = LayerKeyMappings[layer_key]['Icon']();
            }

            return (
              <View key={layer_key}>
                <View style={styles.elementContent}>
                  <Pressable
                    style={styles.elementTitleContent}
                    onPress={handleAddElementClick(layer_key)}>
                    <Icon width={26} />
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
      </View>
    );
  } else {
    return (
      <View>
        {isLoading ? <Loader /> : null}
        <Header text="ADD ELEMENT" icon="add-location" onClose={hideModal} />
        <View style={styles.container}>
          {isLoading ? null : (
            <Subheading style={layout.textCenter}>
              No elements created yet.
            </Subheading>
          )}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
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

export default AddElementContent;
