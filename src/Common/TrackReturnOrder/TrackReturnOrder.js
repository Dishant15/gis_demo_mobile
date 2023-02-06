import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import DashedLine from 'react-native-dashed-line';

import Circle from '~assets/svg/ic_unselected_circle.svg';
import SCircle from '~assets/svg/ic_selected_circle.svg';
import SmallCircle from '~assets/svg/ic_selected_circle_small.svg';
import Right from '~assets/svg/ic_right.svg';

import styles from './TrackOrderStyle';
import {colors} from '~constants/constants';

const TrackReturnOrder = props => {
  const {width} = useWindowDimensions();
  const {selectedIndex, stepDetail} = props;

  const SelectedLine = () => {
    return (
      <View style={{width: '100%'}}>
        <DashedLine
          dashLength={10}
          dashThickness={4}
          dashGap={6}
          dashColor={colors.success}
        />
      </View>
    );
  };

  const SelectedCircle = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Circle />
        <SCircle style={{position: 'absolute'}} />
        <Right style={{position: 'absolute'}} />
      </View>
    );
  };

  const CurrentCircle = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Circle />
        <SmallCircle style={{position: 'absolute'}} />
      </View>
    );
  };

  const Circle1 = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Circle />
    </View>
  );

  const stepsSize = stepDetail.length;
  const divWidth = stepsSize > 0 ? width / stepsSize : 1;

  return (
    <View style={styles.trackWrapper}>
      <View style={[styles.fullLine]}>
        <View
          style={{
            width: '100%',
            paddingStart: divWidth / 2,
            paddingEnd: divWidth / 2,
          }}>
          <SelectedLine />
        </View>
      </View>
      {stepsSize > 0 &&
        stepDetail.map((item, index) => {
          if (item.separator) {
            return (
              <View
                key={index}
                style={[styles.stepsSeparator, {width: divWidth - 12}]}
              />
            );
          }
          //
          else if (index < selectedIndex) {
            return (
              <View
                key={index}
                style={[styles.stepsBox2, {width: divWidth + 20}]}>
                <View style={[styles.circleWrapper]}>
                  <SelectedCircle />
                </View>
                <Text style={[styles.stepTxt]}>{item.title}</Text>
              </View>
            );
          }
          //
          else if (index == selectedIndex) {
            return (
              <View
                key={index}
                style={[styles.stepsBox2, {width: divWidth + 20}]}>
                <View style={[styles.circleWrapper]}>
                  <CurrentCircle />
                </View>
                <Text style={[styles.stepTxt]}>{item.title}</Text>
              </View>
            );
          }
          //
          else {
            return (
              <View
                key={index}
                style={[styles.stepsBox2, {width: divWidth + 20}]}>
                <View style={styles.circleWrapper}>
                  <Circle1 />
                </View>
                <Text style={styles.stepTxt}>{item.title}</Text>
              </View>
            );
          }
        })}
    </View>
  );
};

export default TrackReturnOrder;
