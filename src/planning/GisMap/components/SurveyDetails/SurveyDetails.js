import React, {useCallback, useEffect} from 'react';
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
import {STEPS_CONFIG} from './configuration';

const SurveyDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const mapState = useSelector(getPlanningMapState);
  const surveyWorkorder = useSelector(getSurveyWorkorderDetails);

  const layerKey = mapState.layerKey;
  const elementId = mapState.data.elementId;
  const currentStep = mapState.currentStep;

  const {isLoading, screenType} = surveyWorkorder;

  useEffect(() => {
    dispatch(fetchSurveyWoDetailsThunk({layerKey, elementId}));
  }, [layerKey, elementId]);

  let content = null;
  let title = '';

  const getSurveyTitle = () => {
    switch (currentStep) {
      case 1:
        return STEPS_CONFIG[0].sections[0].title;
      case 2:
        return STEPS_CONFIG[1].sections[0].title;
      case 3:
        return STEPS_CONFIG[2].sections[0].title;
      case 4:
        return STEPS_CONFIG[3].sections[0].title;
      default:
        return 'Survey Details';
    }
  };

  if (isLoading) {
    content = <Loader />;
  }
  //
  else if (screenType) {
    switch (screenType) {
      case 1:
        content = <SurveyForm />;
        title = getSurveyTitle();
        break;
      case 2:
        content = <SurveyForm />;
        title = getSurveyTitle();
        break;
      case 3:
        content = <ReviewScreen />;
        title = 'Survey Details';
        break;
      case 4:
        content = (
          <View>
            <Text>Could not fetch data. try again.</Text>
          </View>
        );
        title = 'Survey Details';
        break;
      default:
        title = 'Survey Details';
        break;
    }
  }

  return (
    <View style={layout.container}>
      <BackHeader title={title} onGoBack={navigation.goBack} />
      {content}
    </View>
  );
};

export default SurveyDetails;
