import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector} from 'react-redux';

import BackHeader from '~Common/components/Header/BackHeader';
import {layout} from '~constants/constants';
import {fetchSurveyWoDetailsThunk} from '~planning/data/ticket.services';
import {
  getPlanningMapState,
  getSurveyWorkorderDetails,
} from '~planning/data/planningGis.selectors';
import Loader from '~Common/Loader';
import ReviewScreen from './ReviewScreen';
import SurveyForm from './SurveyForm';

const SurveyDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const mapState = useSelector(getPlanningMapState);
  const surveyWorkorder = useSelector(getSurveyWorkorderDetails);

  const layerKey = mapState.layerKey;
  const elementId = mapState.data.elementId;
  const {isLoading, screenType} = surveyWorkorder;

  useEffect(() => {
    dispatch(fetchSurveyWoDetailsThunk({layerKey, elementId}));
  }, [layerKey, elementId]);

  let content = null;
  if (isLoading) {
    content = <Loader />;
  }
  //
  else if (screenType) {
    switch (screenType) {
      case 1:
        content = <SurveyForm />;
        break;
      case 2:
        content = <SurveyForm />;
        break;
      case 3:
        content = <ReviewScreen />;
        break;
      case 4:
        content = (
          <View>
            <Text>Could not fetch data. try again.</Text>
          </View>
        );
        break;
      default:
        break;
    }
  }

  return (
    <View style={layout.container}>
      <BackHeader title={'Survey Form'} onGoBack={navigation.goBack} />
      {content}
    </View>
  );
};

export default SurveyDetails;
