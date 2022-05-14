import React, {useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {layout, screens} from '~constants/constants';
import {Card, Title, Paragraph} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {setAreaIndex, setAreaList} from '~data/reducers/geoSurvey.reducer';
import DummyArea from './areaDummy.json';
import {getAreaList} from '~data/selectors/geoSurvey.selectors';
import {useFocusEffect} from '@react-navigation/native';

const AreaList = props => {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const areaList = useSelector(getAreaList);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setAreaList(DummyArea));
    }, []),
  );

  return (
    <View style={layout.container}>
      <FlatList
        contentContainerStyle={{padding: 12, paddingBottom: 40}}
        data={areaList}
        renderItem={({item, index}) => {
          return (
            <Card
              style={{marginBottom: 12}}
              onPress={() => {
                dispatch(setAreaIndex(index));
                navigation.navigate(screens.surveyMap);
              }}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>
                  {item.area} - {item.pincode}
                </Paragraph>
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
};

export default AreaList;
