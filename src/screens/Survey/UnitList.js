import React, {useCallback} from 'react';
import {View, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Card, Title, Paragraph} from 'react-native-paper';

import {getGeoSurveyUnitList} from '~data/selectors/geoSurvey.selectors';
import {layout, screens} from '~constants/constants';
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
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={units}
        renderItem={({item, index}) => {
          return (
            <Card style={{marginBottom: 12}} onPress={handleUnitSelect(index)}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>{item.category}</Paragraph>
              </Card.Content>
            </Card>
          );
        }}
        ListHeaderComponent={
          <Card onPress={handleAddUnit}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Unit</Title>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
};

export default UnitList;
