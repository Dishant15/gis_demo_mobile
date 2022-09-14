import React, {useCallback, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Modal} from 'react-native-paper';

import {isNull} from 'lodash';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import RegionTabContent from './components/RegionTabContent';
import LayersTabContent from './components/LayersTabContent';
import AddElementContent from './components/AddElementContent';
import {CustomBottomPopup} from '~Common/CustomPopup';

import {getActiveTab} from '~planning/data/planningState.selectors';
import {setActiveTab} from '~planning/data/planningState.reducer';
import {colors} from '~constants/constants';

const ActionBar = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const activeTab = useSelector(getActiveTab);

  const handleTabChange = useCallback(
    newValue => () => {
      dispatch(setActiveTab(newValue));
    },
    [],
  );

  const hideModal = useCallback(() => {
    dispatch(setActiveTab(null));
  }, []);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 0:
        return <RegionTabContent hideModal={hideModal} />;

      case 1:
        return <LayersTabContent hideModal={hideModal} />;

      case 2:
        return <AddElementContent hideModal={hideModal} />;

      default:
        return <Text>Invalid Tab Selection</Text>;
    }
  }, [activeTab]);

  return (
    <>
      <View
        style={[styles.actionWrapper, {bottom: Math.max(insets.bottom, 16)}]}>
        <TouchableOpacity style={[styles.action]} onPress={handleTabChange(0)}>
          <MaterialIcons
            size={30}
            name={'attractions'}
            color={colors.primaryFontColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.action]} onPress={handleTabChange(1)}>
          <MaterialIcons
            size={30}
            name={'layers'}
            color={colors.primaryFontColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.action]} onPress={handleTabChange(2)}>
          <MaterialIcons
            size={30}
            name={'add-location'}
            color={colors.primaryFontColor}
          />
        </TouchableOpacity>
      </View>
      {!isNull(activeTab) ? (
        <CustomBottomPopup justifyContent="flex-end" handleClose={hideModal}>
          {tabContent}
        </CustomBottomPopup>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  actionWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 1,
  },
  action: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ActionBar;
