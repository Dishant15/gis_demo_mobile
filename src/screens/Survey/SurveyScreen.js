import React from 'react';
import {View, FlatList} from 'react-native';
import {layout, screens} from '~constants/constants';
import {Card, Title, Paragraph} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {getSurveyList} from '~redux/selectors/surveyList.selectors';

const SurveyScreen = props => {
  const {navigation, route} = props;
  const surveyList = useSelector(getSurveyList);
  return (
    <View style={layout.container}>
      <FlatList
        contentContainerStyle={{padding: 12}}
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
        ListFooterComponent={
          <Card
            style={{marginBottom: 40}}
            onPress={() => navigation.navigate(screens.surveyDetails)}>
            <Card.Content>
              <Title style={{textAlign: 'center'}}>+ Add Survey</Title>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
};

export default SurveyScreen;
