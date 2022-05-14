import React from 'react';
import {View, FlatList} from 'react-native';
import {layout, screens} from '~constants/constants';
import {Card, Title, Paragraph} from 'react-native-paper';
import {useDispatch} from 'react-redux';

const AreaList = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const areaList = [
    {
      name: 'Area One',
      area: 'Science City, Thaltej, Ahmedabad, 380060',
    },
    {
      name: 'Area Two',
      area: 'Makarba, Ahmedabad South, 380051',
    },
  ];

  return (
    <View style={layout.container}>
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={areaList}
        renderItem={({item}) => {
          return (
            <Card
              style={{marginBottom: 12}}
              onPress={() => navigation.navigate(screens.surveyMap)}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>{item.area}</Paragraph>
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
};

export default AreaList;
