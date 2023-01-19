import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Keyboard} from 'react-native';

import map from 'lodash/map';

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

  const [filteredElementList, setFilteredElementList] = useState(elementList);
  const elementListSearch = new Fuse(elementList, {
    keys: ['name'],
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

  const handleElementListFilter = useCallback(
    searchText => {
      if (searchText) {
        setFilteredElementList(
          map(elementListSearch.search(searchText), 'item'),
        );
      } else {
        setFilteredElementList(elementList);
      }
      Keyboard.dismiss();
    },
    [elementList, elementListSearch],
  );

  return {
    elementLayerKey,
    elementList: filteredElementList,
    handleShowOnMap,
    handleShowDetails,
    handleElementListFilter,
  };
};
