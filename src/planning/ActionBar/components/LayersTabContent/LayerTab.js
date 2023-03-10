import React, {useCallback, useState, Fragment} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import get from 'lodash/get';
import noop from 'lodash/noop';
import size from 'lodash/size';

import {Button, Text, Divider, Subheading} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {fetchLayerDataThunk} from '~planning/data/actionBar.services';
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
  onLayerTabElementList,
  openElementDetails,
} from '~planning/data/planning.actions';
import {colors, screens, THEME_COLORS} from '~constants/constants';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {LayerKeyMappings} from '~planning/GisMap/utils';

const LayerTab = ({layerConfig, regionIdList}) => {
  /**
   * Render each tab of a layer key
   * Handle layer on click
   * Handle layer collapsible expand
   * Show list of elements on expand
   */
  const {layer_key, name} = layerConfig;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isExpanded, setExpanded] = useState(false);
  const layerNetState = useSelector(getLayerNetworkState(layer_key));

  const isLoading = get(layerNetState, 'isLoading', false);
  const isSelected = get(layerNetState, 'isSelected', false);
  const isFetched = get(layerNetState, 'isFetched', false);
  const isCached = get(layerNetState, 'isCached', false);
  const count = get(layerNetState, 'count', 0);

  // get icon
  const getViewOptions = get(LayerKeyMappings, [layer_key, 'getViewOptions']);
  const Icon = getViewOptions ? getViewOptions({}).icon : Fragment;

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

  const handleSearchClick = useCallback(() => {
    dispatch(onLayerTabElementList(layer_key, navigation));
  }, [layer_key]);

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
        <Pressable style={styles.itemContentWrapper} onPress={onLayerClick}>
          <View style={styles.iconBox}>
            <Icon size={20} />
          </View>
          <View style={styles.itemContent}>
            <Subheading
              style={isCached ? {color: THEME_COLORS.error.main} : {}}>
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
          </View>
        </Pressable>
      </View>

      <Divider />

      {isExpanded ? (
        <View style={styles.searchWrapper}>
          <Button
            mode="outlined"
            icon="magnify"
            color={THEME_COLORS.secondary.main}
            style={styles.searchBtnBorder}
            onPress={handleSearchClick}>
            search
          </Button>
        </View>
      ) : null}
      {/* {isExpanded ? <ElementList layerKey={layer_key} /> : null} */}
    </View>
  );
};

const ElementList = ({layerKey}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // get list of elements for current key
  const viewData = useSelector(getLayerViewData(layerKey));

  const handleElementClick = useCallback(
    elementId => () => {
      dispatch(setActiveTab(null));
      dispatch(
        openElementDetails({
          layerKey,
          elementId,
        }),
      );
      navigation.navigate(screens.gisEventScreen);
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
                name="format-list-bulleted"
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
  itemContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    minHeight: 58,
  },
  expandIcon: {
    justifyContent: 'center',
    width: 34,
  },
  iconBox: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blackWithOp,
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
  searchWrapper: {
    paddingHorizontal: '10%',
    paddingVertical: 12,
  },
  searchBtnBorder: {
    borderColor: THEME_COLORS.secondary.main,
  },
});

export default LayerTab;
