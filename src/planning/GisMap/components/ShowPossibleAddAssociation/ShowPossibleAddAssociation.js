import React, {useCallback} from 'react';
import {View, BackHandler, StyleSheet} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Button, Title} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';
import AddAssociationList from './AddAssociationList';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {openElementDetails} from '~planning/data/planning.actions';
import {associateElementOnMapClick} from '~planning/data/event.actions';
import {layout} from '~constants/constants';

const ShowPossibleAddAssociation = () => {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    }, []),
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {layerKey, data} = useSelector(getPlanningMapState);
  const {elementData, listOfLayers} = data;

  const handleGoBack = useCallback(() => {
    dispatch(openElementDetails({layerKey, elementId: data.elementData.id}));
    return true; // required for backHandler
  }, [layerKey, data]);

  const handleAssociateExistingElementClick = useCallback(() => {
    // fire event to
    dispatch(
      associateElementOnMapClick({
        layerKey,
        elementData,
        listOfLayers,
        extraParent: {
          [layerKey]: [{...elementData}],
        },
        navigation,
      }),
    );
  }, [layerKey, elementData, listOfLayers]);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title={`${elementData.name}`} onGoBack={handleGoBack} />
      <View style={styles.titleWrapper}>
        <Title style={styles.wrapper}>Add Element</Title>
        <Button icon="plus" onPress={handleAssociateExistingElementClick}>
          Associate Existing
        </Button>
      </View>
      <AddAssociationList
        parentData={elementData}
        parentLayerKey={layerKey}
        listOfLayers={listOfLayers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 4,
  },
  titleWrapper: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ShowPossibleAddAssociation;
