import React, {useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Title, Paragraph, Button} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';

import {getGeoSurveyUnitList} from '~GeoServey/data/geoSurvey.selectors';
import {layout, screens, colors} from '~constants/constants';
import {selectUnit} from '~GeoServey/data/geoSurvey.reducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
              <Card
                style={{marginBottom: 12}}
                onPress={handleUnitSelect(index)}>
                <Card.Content>
                  <Title>{item.name}</Title>
                  <Paragraph>{item.category}</Paragraph>
                </Card.Content>
              </Card>
            );
          } else {
            return null;
          }
        }}
        ListHeaderComponent={
          <Card
            onPress={handleUnitSelect(-1)}
            style={{
              marginVertical: 12,
            }}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Unit</Title>
            </Card.Content>
          </Card>
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
});

export default UnitList;
