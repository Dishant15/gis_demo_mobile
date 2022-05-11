import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Title, Paragraph, Button} from 'react-native-paper';

import BackHeader from '~components/Header/BackHeader';

import {getGeoSurveyUnitList} from '~data/selectors/geoSurvey.selectors';
import {layout, screens, colors} from '~constants/constants';
import {addUnit, selectUnit} from '~data/reducers/geoSurvey.reducer';

const UnitList = props => {
  const {navigation} = props;
  const units = useSelector(getGeoSurveyUnitList);
  const dispatch = useDispatch();

  const handleAddUnit = useCallback(() => {
    dispatch(addUnit());
    navigation.navigate(screens.unitMap);
  }, []);

  const handleUnitSelect = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  return (
    <View style={layout.container}>
      <BackHeader title="Survey units" onGoBack={navigation.goBack} />
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
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
            onPress={handleAddUnit}
            style={{
              marginVertical: 12,
            }}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Unit</Title>
            </Card.Content>
          </Card>
        }
        ListFooterComponent={
          <Button
            style={{
              marginVertical: 30,
            }}
            contentStyle={layout.button}
            color={colors.black}
            uppercase
            mode="contained"
            onPress={() => navigation.navigate(screens.reviewScreen)}>
            Review
          </Button>
        }
      />
    </View>
  );
};

export default UnitList;
