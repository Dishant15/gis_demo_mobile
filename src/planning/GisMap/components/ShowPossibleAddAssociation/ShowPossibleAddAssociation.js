import React, {useCallback} from 'react';
import {View, BackHandler, StyleSheet} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import BackHeader from '~Common/components/Header/BackHeader';
import AddAssociationList from './AddAssociationList';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {openElementDetails} from '~planning/data/planning.actions';
import {layout} from '~constants/constants';
import {Title} from 'react-native-paper';

const ShowPossibleAddAssociation = () => {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleGoBack);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    }, []),
  );

  const dispatch = useDispatch();

  const {layerKey, data} = useSelector(getPlanningMapState);
  const {elementData, listOfLayers} = data;

  const handleGoBack = useCallback(() => {
    dispatch(openElementDetails({layerKey, elementId: data.elementData.id}));
    return true; // required for backHandler
  }, [layerKey, data]);

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title={`${elementData.name}`} onGoBack={handleGoBack} />
      <Title style={styles.wrapper}>Add Element</Title>
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
    padding: 12,
  },
});

export default ShowPossibleAddAssociation;
