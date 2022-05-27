import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Title, Paragraph, Button} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';

import {getGeoSurveyUnitList} from '~GeoServey/data/geoSurvey.selectors';
import {layout, screens, colors} from '~constants/constants';
import {selectUnit} from '~GeoServey/data/geoSurvey.reducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Parent:
 *    root.navigation
 */
const UnitList = props => {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const units = useSelector(getGeoSurveyUnitList);
  const dispatch = useDispatch();

  const handleUnitSelect = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  return (
    <View style={[layout.container, layout.relative]}>
      <BackHeader title="Survey units" onGoBack={navigation.goBack} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={units}
        renderItem={({item, index}) => {
          if (item.name) {
            return (
              <Pressable
                style={styles.itemWrapper}
                onPress={handleUnitSelect(index)}>
                <View style={styles.content}>
                  <Title>{item.name}</Title>
                  <Paragraph>
                    Category : {item.category === 'M' ? 'MDU' : 'SDU'}
                  </Paragraph>
                </View>
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons
                    size={22}
                    name="chevron-right"
                    color={'#767676'}
                  />
                </View>
              </Pressable>
            );
          } else {
            return null;
          }
        }}
        ListHeaderComponent={
          <Pressable onPress={handleUnitSelect(-1)} style={styles.addWrapper}>
            <Title style={{textAlign: 'center'}}>+ Add Unit</Title>
          </Pressable>
        }
      />
      <View style={styles.bottomWrapper}>
        <Button
          style={[styles.btn, {paddingBottom: Math.max(insets.bottom, 0)}]}
          contentStyle={layout.button}
          color={colors.black}
          uppercase
          mode="contained"
          onPress={() => navigation.navigate(screens.reviewScreen)}>
          Review
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 12,
    paddingBottom: 40,
  },
  bottomWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn: {
    borderRadius: 0,
    backgroundColor: colors.black,
  },
  itemWrapper: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
    borderBottomColor: colors.separator,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWrapper: {
    borderWidth: 1,
    borderColor: colors.separator,
    paddingVertical: 18,
  },
});

export default UnitList;
