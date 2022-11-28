import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import BackHeader from '~Common/components/Header/BackHeader';
import {Title, Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  onElementListItemClick,
  openElementDetails,
} from '~planning/data/planning.actions';

import {getPlanningMapStateData} from '~planning/data/planningGis.selectors';
import {colors, layout, THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings} from '../utils';

const ElementList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {elementList} = useSelector(getPlanningMapStateData);

  const handleShowOnMap = useCallback(
    (elementId, layerKey) => () => {
      dispatch(onElementListItemClick(elementId, layerKey, navigation));
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

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Element List" onGoBack={navigation.goBack} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={elementList}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => {
          const {layerKey, name, network_id, id} = item;
          const Icon = LayerKeyMappings[layerKey]['getViewOptions'](item).icon;

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
                  onPress={handleShowDetails(id, layerKey)}>
                  <Subheading numberOfLines={3} ellipsizeMode="tail">
                    {name}
                  </Subheading>
                  <Caption numberOfLines={3} ellipsizeMode="tail">
                    #{network_id}
                  </Caption>
                </Pressable>
                <View style={styles.actionDivider} />
                <Pressable
                  style={styles.actionWrapper}
                  onPress={handleShowOnMap(id, layerKey)}>
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
        }}
        ListEmptyComponent={
          <View style={[layout.center, layout.container]}>
            <Title style={layout.textCenter}>
              No element available arround selected area
            </Title>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 4,
    paddingBottom: 60,
    flexGrow: 1,
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
});

export default ElementList;
