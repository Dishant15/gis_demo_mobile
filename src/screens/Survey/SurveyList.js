import React from 'react';
import {View, FlatList} from 'react-native';
import {layout, screens} from '~constants/constants';
import {Card, Title, Paragraph} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {resetSurveyData} from '~data/reducers/geoSurvey.reducer';

const SurveyList = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const surveyList = [
    {
      title: 'survey #1',
      address: 'Science City, Thaltej, Ahmedabad, 380060',
    },
    {
      title: 'survey #1',
      address: 'Makarba, Ahmedabad South, 380051',
    },
  ];

  return (
    <View style={layout.container}>
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={surveyList}
        renderItem={({item}) => {
          return (
            <Card style={{marginBottom: 12}}>
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.address}</Paragraph>
              </Card.Content>
            </Card>
          );
        }}
        ListHeaderComponent={
          <Card
            style={{marginBottom: 12}}
            onPress={() => {
              dispatch(resetSurveyData());
              navigation.navigate(screens.surveyDetails);
            }}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Survey</Title>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
};

export default SurveyList;
