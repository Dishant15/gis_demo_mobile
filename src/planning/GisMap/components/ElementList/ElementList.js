import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, Pressable, BackHandler} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Title, Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';

import BackHeader from '~Common/components/Header/BackHeader';
import Loader from '~Common/Loader';
import SearchBox from '~Common/SearchBox';

import {colors, layout, THEME_COLORS} from '~constants/constants';
import {useElementListHook} from './useElementList';
import {LayerKeyMappings} from '~planning/GisMap/utils';
import {setMapState} from '~planning/data/planningGis.reducer';

const ElementList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    elementList,
    isAssociationList,
    isEditLoading,
    searchedKey,
    handleShowOnMap,
    handleShowDetails,
    handleShowPopup,
    handleElementListFilter,
  } = useElementListHook();

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', customGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', customGoBack);
    }, []),
  );

  const customGoBack = () => {
    dispatch(setMapState({}));
    return false;
  };

  const handleGoBack = () => {
    dispatch(setMapState({}));
    navigation.goBack();
  };

  const handleSearch = useCallback(searchText => {
    handleElementListFilter(searchText);
  }, []);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Element List" onGoBack={handleGoBack} />
      <SearchBox onSearchPress={handleSearch} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={elementList}
        keyExtractor={item => String(searchedKey ? item.item.id : item.id)}
        renderItem={({item}) => {
          const element = searchedKey ? item.item : item;

          const {layerKey, name, network_id, id} = element;
          const Icon =
            LayerKeyMappings[layerKey]['getViewOptions'](element).icon;

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
                  onPress={
                    isAssociationList
                      ? handleShowPopup(element)
                      : handleShowDetails(element)
                  }>
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
      {isEditLoading ? <Loader /> : null}
    </View>
  );
};

export const styles = StyleSheet.create({
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
