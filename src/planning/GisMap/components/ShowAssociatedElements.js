import React, {useCallback, Fragment, useState} from 'react';
import {View, Pressable, StyleSheet, ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import size from 'lodash/size';

import {Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackHeader from '~Common/components/Header/BackHeader';

import {fetchElementAssociations} from '~planning/data/layer.services';
import {getPlanningMapState} from '~planning/data/planningGis.selectors';

import {
  onAssociatedElementShowOnMapClick,
  openElementDetails,
} from '~planning/data/planning.actions';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings} from '../utils';

const ShowAssociatedElements = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {layerKey, data} = useSelector(getPlanningMapState);
  const {elementId} = data;

  const {data: associations, isLoading} = useQuery(
    ['elementAssociations', layerKey, elementId],
    fetchElementAssociations,
  );

  const handleShowOnMap = useCallback(
    (element, layerKey) => () => {
      dispatch(
        onAssociatedElementShowOnMapClick(element, layerKey, navigation),
      );
    },
    [],
  );

  const handleShowDetails = useCallback(
    (elementId, layerKey) => () => {
      dispatch(
        openElementDetails({
          layerKey,
          elementId,
        }),
      );
    },
    [],
  );

  const groupedAssociations = groupBy(associations, 'layer_info.layer_key');

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Associated Elements" onGoBack={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {map(groupedAssociations, (item, key) => {
          return (
            <CollapsibleContent
              key={key}
              layerKey={key}
              data={item}
              handleShowOnMap={handleShowOnMap}
              handleShowDetails={handleShowDetails}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const CollapsibleContent = ({
  layerKey,
  data,
  handleShowOnMap,
  handleShowDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded(val => !val);
  }, [setIsExpanded]);

  // get icon
  const getViewOptions = get(LayerKeyMappings, [layerKey, 'getViewOptions']);
  const Icon = getViewOptions ? getViewOptions({}).icon : Fragment;

  return (
    <View>
      <Pressable style={styles.itemWrapper} onPress={toggleExpand}>
        <View style={styles.itemContentWrapper}>
          <View style={styles.iconBox}>
            <Icon size={20} />
          </View>
          <View style={styles.itemContent}>
            <Subheading>
              {get(data, '0.layer_info.name', '')} {`(${size(data)})`}
            </Subheading>
          </View>
        </View>
        <View style={styles.expandIcon}>
          <MaterialIcons
            size={30}
            name={isExpanded ? 'expand-less' : 'expand-more'}
            color={colors.primaryFontColor}
          />
        </View>
      </Pressable>

      <Divider />
      {isExpanded ? (
        <View style={styles.elementListWrapper}>
          {data.map(item => (
            <ElementItem
              item={item}
              handleShowOnMap={handleShowOnMap}
              handleShowDetails={handleShowDetails}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const ElementItem = ({item, handleShowOnMap, handleShowDetails}) => {
  const {element, layer_info} = item;
  const {layer_key} = layer_info;
  const Icon = LayerKeyMappings[layer_key]['getViewOptions'](element).icon;
  const networkId = get(element, 'network_id', '');

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconBlock}>
            <Icon size={30} />
          </View>
        </View>
        <Pressable
          style={styles.textWrapper}
          onPress={handleShowDetails(element.id, layer_key)}>
          <Subheading numberOfLines={3} ellipsizeMode="tail">
            {get(element, 'name', '')}
          </Subheading>
          <Caption numberOfLines={3} ellipsizeMode="tail">
            #{networkId}
          </Caption>
        </Pressable>
        <View style={styles.actionDivider} />
        <Pressable
          style={styles.actionWrapper}
          onPress={handleShowOnMap(element, layer_key)}>
          <View style={styles.squreButton}>
            <MaterialIcons
              size={28}
              name="language"
              color={THEME_COLORS.action.active}
            />
          </View>
        </Pressable>
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 4,
    paddingBottom: 60,
  },
  container: {
    paddingHorizontal: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
  },
  iconWrapper: {
    padding: 5,
  },
  iconBlock: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: colors.white,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingHorizontal: 6,
    // borderWidth: 1,
  },
  actionDivider: {
    backgroundColor: colors.dividerColor,
    width: StyleSheet.hairlineWidth,
  },
  actionWrapper: {
    height: 60,
    minWidth: 60,
    // borderWidth: 1,
    padding: 5,
    alignItems: 'center',
  },
  squreButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: colors.dividerColor,
  },

  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 12,
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
    width: 40,
  },
  iconBox: {
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  elementListWrapper: {
    paddingTop: 6,
  },
});
export default ShowAssociatedElements;
