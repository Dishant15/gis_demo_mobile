import React, {useMemo, useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';

import {filter, isNull, size} from 'lodash';
import {Subheading, Paragraph} from 'react-native-paper';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from '~Common/Loader';
import Header from './Header';

import {fetchLayerListDetails} from '~planning/data/actionBar.services';
import {setMapState} from '~planning/data/planningGis.reducer';
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
  PLANNING_EVENT,
} from '~planning/GisMap/utils';

import {ICONS} from '~utils/icons';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {colors, layout} from '~constants/constants';

const {width} = Dimensions.get('window');
const itemWidth = (width - 24) / 3;

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
  const [layerConfigPopup, setLayerConfigPopup] = useState(null);
  const {event} = useSelector(getPlanningMapState);
  const selectedConfigurations = useSelector(getSelectedConfigurations);

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
      // SUGGESTED_UPDATES ---- check ticket id, if ticket id is there, add work_order_type="A" into mapState.data
      dispatch(setActiveTab(null));
    },
    [event],
  );

  const handleLayerConfigPopupShow = useCallback(
    layerKey => e => {
      // if (e) e.stopPropagation();
      // show popover for selected layer
      setLayerConfigPopup(layerKey);
    },
    [],
  );

  const handleLayerConfigPopupHide = useCallback(() => {
    setLayerConfigPopup(null);
  }, []);

  if (layerCofigs.length) {
    return (
      <View>
        {isLoading ? <Loader /> : null}
        <Header text="ADD ELEMENT" icon="add-location" onClose={hideModal} />
        <View style={styles.container}>
          <View style={styles.grid}>
            {layerCofigs.map(config => {
              const {layer_key, name, is_configurable, configuration} = config;

              let SvgComp = ICONS(config.layer_key);
              SvgComp = isNull(SvgComp) ? <></> : <SvgComp width={30} />;
              return (
                <Pressable
                  style={[
                    layout.relative,
                    {width: itemWidth, height: itemWidth, padding: 8},
                  ]}
                  key={layer_key}
                  onPress={handleAddElementClick(layer_key)}>
                  <View style={styles.gridItem}>
                    {SvgComp}
                    <Paragraph style={layout.textCenter}>{name}</Paragraph>
                  </View>
                  {is_configurable ? (
                    <Pressable
                      style={styles.setting}
                      onPress={handleLayerConfigPopupShow(layer_key)}>
                      <MaterialIcons
                        size={22}
                        name={'settings'}
                        color={colors.primaryFontColor}
                      />
                    </Pressable>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  gridItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  title: {
    color: colors.primaryMain,
    textAlign: 'center',
  },
  setting: {
    padding: 8,
    position: 'absolute',
    right: 8,
    top: 8,
  },
});

export default AddElementContent;
