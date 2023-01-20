import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import Fuse from 'fuse.js';

import {getPlanningMapState} from '~planning/data/planningGis.selectors';
import {
  onLayerElementShowOnMapClick,
  openElementDetails,
} from '~planning/data/planning.actions';

export const useLayerElementList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {data: eventData} = useSelector(getPlanningMapState);
  const {elementList, elementLayerKey} = eventData;

  const [searchedKey, setSearchedKey] = useState('');
  const elementListSearch = new Fuse(elementList, {
    keys: ['name'],
    ignoreFieldNorm: true,
    fieldNormWeight: 0,
  });

  const handleShowOnMap = useCallback(
    (element, layerKey) => () => {
      dispatch(onLayerElementShowOnMapClick(element, layerKey, navigation));
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

  const handleElementListFilter = useCallback(searchText => {
    setSearchedKey(searchText);
  }, []);

  return {
    elementLayerKey,
    elementList: searchedKey
      ? elementListSearch.search(searchedKey)
      : elementList,
    searchedKey,
    handleShowOnMap,
    handleShowDetails,
    handleElementListFilter,
  };
};
