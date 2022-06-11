import React, {useMemo, useRef, useCallback, useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Polygon} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {size, get} from 'lodash';
import {Card, Button, Paragraph, Subheading, Title} from 'react-native-paper';

import BackHeader from '~Common/components/Header/BackHeader';
import {layout, screens, colors} from '~constants/constants';
import {
  getGeoSurveyFormData,
  getTicketId,
} from '~GeoServey/data/geoSurvey.selectors';
import {
  setReview,
  selectUnit,
  resetServeyData,
  deleteSurveyData,
  deleteUnitData,
} from '~GeoServey/data/geoSurvey.reducer';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {useMutation} from 'react-query';
import {deleteSurvey, deleteUnit} from '~GeoServey/data/geoSurvey.service';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {surveyDeleteSuccess, unitDeleteSuccess} from '~constants/messages';

const {width, height} = Dimensions.get('window');

/**
 * Parent:
 *    root.navigation
 */
const ReviewScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const mapRef = useRef();
  const formData = useSelector(getGeoSurveyFormData);
  const unitList = get(formData, 'units', []);
  const ticketId = useSelector(getTicketId);

  const [deletingUnitId, setDeletingUnitId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReview(true));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', navigateToSurveyList);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          navigateToSurveyList,
        );
    }, []),
  );

  const {mutate, isLoading: isSurveyDeleting} = useMutation(deleteSurvey, {
    onSuccess: (res, variables) => {
      navigateToSurveyList();
      dispatch(deleteSurveyData(variables));
      showToast(surveyDeleteSuccess(), TOAST_TYPE.SUCCESS);
    },
    onError: err => {
      showToast(err.message, TOAST_TYPE.ERROR);
    },
  });

  const {mutate: handleUnitDetele, isLoading: isUnitDeleting} = useMutation(
    deleteUnit,
    {
      onSuccess: (res, variables) => {
        // navigateToSurveyList();
        dispatch(deleteUnitData(variables));
        setDeletingUnitId(null);
        showToast(unitDeleteSuccess(), TOAST_TYPE.SUCCESS);
      },
      onError: err => {
        setDeletingUnitId(null);
        showToast(err.message, TOAST_TYPE.ERROR);
      },
    },
  );

  const unitMarkerList = useMemo(() => {
    const newList = [];
    for (let index = 0; index < unitList.length; index++) {
      if (size(get(unitList, [index, 'coordinates']))) {
        newList.push(unitList[index].coordinates);
      }
    }
    return newList;
  }, [unitList]);

  const navigateToSurveyList = useCallback(() => {
    console.log('am i here ??');
    navigation.navigate(screens.workorderScreen, {ticketId});
    dispatch(resetServeyData());
    return true; // required for backHandler
  }, []);

  const navigateToSurveyMap = useCallback(() => {
    navigation.navigate(screens.surveyMap);
  }, []);

  const navigateToSurveyForm = useCallback(() => {
    navigation.navigate(screens.surveyForm);
  }, []);

  const navigateToUnitMap = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  const resetReviewAndnavigateToUnitMap = useCallback(
    index => () => {
      dispatch(setReview(false));
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitMap);
    },
    [],
  );

  const navigateToUnitForm = useCallback(
    index => () => {
      dispatch(selectUnit(index));
      navigation.navigate(screens.unitForm);
    },
    [],
  );

  const onMapLayout = e => {
    mapRef.current.fitToCoordinates(formData.coordinates, {
      edgePadding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 12,
      },
      animated: true,
    });
  };

  if (!isFocused) return null;

  return (
    <View style={layout.container}>
      <BackHeader
        title={`${get(formData, 'name')}`}
        onGoBack={navigateToSurveyList}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: width,
            height: height / 2,
          }}
          initialRegion={{
            longitudeDelta: 0.06032254546880722,
            latitudeDelta: 0.0005546677,
            longitude: 72.56051184609532,
            latitude: 23.024334044995985,
          }}
          // zoomEnabled={false}
          // scrollEnabled={false}
          // pitchEnabled={false}
          // rotateEnabled={false}
          onMapReady={onMapLayout}
          onLayout={onMapLayout}>
          {unitMarkerList.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={marker}
                stopPropagation
                flat
                tracksInfoWindowChanges={false}
              />
            );
          })}
          {size(formData.coordinates) ? (
            <Polygon
              coordinates={formData.coordinates}
              strokeWidth={2}
              strokeColor={'#FFA701'}
              fillColor="#FFA70114"
            />
          ) : null}
        </MapView>
        <View style={styles.contentWrapper}>
          <Subheading style={styles.title}>Survey</Subheading>
          <Card elevation={0} style={styles.cardBorder}>
            <Card.Content>
              <Title>{get(formData, 'name')}</Title>
              <Paragraph>
                {get(formData, 'address')} {'\n'}
                {get(formData, 'area')}, {get(formData, 'city')},{' '}
                {get(formData, 'state')}, {get(formData, 'pincode')}
              </Paragraph>
            </Card.Content>
            <Card.Actions style={styles.cardActionWrapper}>
              <Button
                loading={isSurveyDeleting}
                icon="trash-can-outline"
                color={colors.error}
                style={styles.deleteBtnBg}
                onPress={() => mutate(formData.id)}
              />
              <View style={styles.cardRightAction}>
                <Button
                  icon="map-marker-path"
                  color={colors.secondaryMain}
                  style={styles.buttonBg}
                  onPress={navigateToSurveyMap}>
                  Map
                </Button>
                <Button
                  icon="form-select"
                  color={colors.secondaryMain}
                  style={styles.buttonBg}
                  onPress={navigateToSurveyForm}>
                  Details
                </Button>
              </View>
            </Card.Actions>
          </Card>
          {size(unitList) ? (
            <>
              <Subheading style={styles.title}>Units</Subheading>
              {unitList.map((unit, index) => {
                const {category} = unit;
                const isSDUCategory = category === 'S';
                const deleting = isUnitDeleting && unit.id === deletingUnitId;
                return (
                  <Card
                    elevation={0}
                    key={index}
                    style={[styles.cardBorder, styles.unitCard]}>
                    <Card.Content style={styles.cardContent}>
                      <Title>{get(unit, 'name')}</Title>
                      <Paragraph>
                        Category : {isSDUCategory ? 'SDU' : 'MDU'}
                      </Paragraph>
                      {isSDUCategory ? (
                        <Paragraph>
                          No. of units : {get(unit, 'total_home_pass')}
                        </Paragraph>
                      ) : (
                        <Paragraph>
                          Floors: {get(unit, 'floors')}
                          {'\n'}
                          House per floor : {get(unit, 'house_per_floor')}
                          {'\n'}
                          Total home pass : {get(unit, 'total_home_pass')}
                        </Paragraph>
                      )}
                    </Card.Content>
                    <Card.Actions style={styles.cardActionWrapper}>
                      <Button
                        loading={deleting}
                        icon="trash-can-outline"
                        color={colors.error}
                        style={styles.deleteBtnBg}
                        onPress={() => {
                          setDeletingUnitId(unit.id);
                          handleUnitDetele(unit.id);
                        }}
                      />
                      <View style={styles.cardRightAction}>
                        <Button
                          icon="map-marker-path"
                          color={colors.secondaryMain}
                          style={styles.buttonBg}
                          onPress={navigateToUnitMap(index)}>
                          Map
                        </Button>
                        <Button
                          icon="form-select"
                          color={colors.secondaryMain}
                          style={styles.buttonBg}
                          onPress={navigateToUnitForm(index)}>
                          Details
                        </Button>
                      </View>
                    </Card.Actions>
                  </Card>
                );
              })}
            </>
          ) : null}
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.submitBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="outlined"
              onPress={resetReviewAndnavigateToUnitMap(-1)}>
              Add Unit
            </Button>
            <Button
              style={styles.submitBtn}
              contentStyle={layout.button}
              color={colors.black}
              uppercase
              mode="contained"
              onPress={navigateToSurveyList}>
              Complete
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 12,
    paddingTop: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 4,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.77)',
  },
  subheadingStyle: {},
  buttonWrapper: {
    paddingTop: 28,
    paddingBottom: 46,
  },
  discardBtn: {
    flex: 1,
    marginRight: 6,
  },
  submitBtn: {
    flex: 1,
    marginBottom: 26,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: 0,
  },
  unitCard: {
    marginBottom: 28,
  },
  cardContent: {
    paddingTop: 8,
  },
  cardActionWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  buttonBg: {
    marginStart: 8,
    backgroundColor: 'rgba(185, 137, 25, 0.16)',
    flex: 1,
  },
  deleteBtnBg: {
    backgroundColor: colors.error + '29',
    flex: 1,
  },
});

export default ReviewScreen;
