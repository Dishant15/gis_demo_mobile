import React, {useCallback} from 'react';
import {View, FlatList, Pressable, BackHandler} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {Title, Subheading, Caption, Divider} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BackHeader from '~Common/components/Header/BackHeader';
import SearchBox from '~Common/SearchBox';

import {layout, THEME_COLORS} from '~constants/constants';
import {LayerKeyMappings} from '~planning/GisMap/utils';
import {setMapState} from '~planning/data/planningGis.reducer';
import {styles} from '../ElementList/ElementList';
import {useLayerElementList} from './useLayerElementList';

const LayerElementList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    elementLayerKey,
    elementList,
    searchedKey,
    handleShowOnMap,
    handleShowDetails,
    handleElementListFilter,
  } = useLayerElementList();

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

          const {name, network_id, id} = element;
          const Icon =
            LayerKeyMappings[elementLayerKey]['getViewOptions'](element).icon;

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
                  onPress={handleShowDetails(id, elementLayerKey)}>
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
                  onPress={handleShowOnMap(element, elementLayerKey)}>
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
            <Title style={layout.textCenter}>No element available</Title>
          </View>
        }
      />
    </View>
  );
};

export default LayerElementList;
