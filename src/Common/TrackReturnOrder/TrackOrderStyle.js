import {StyleSheet} from 'react-native';
import {colors} from '~constants/constants';

const styles = StyleSheet.create({
  trackIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepsBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  stepTxt: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 7,
    color: colors.black,
  },
  heading: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 8,
    color: 'black',
  },
  stepsBox2: {
    paddingTop: 50,
    position: 'relative',
    // borderWidth: 1,
  },
  stepsSeparator: {
    paddingTop: 50,
    flex: 1,
    // borderWidth: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  trackWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 12,
    marginTop: 16,
  },
  fullLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 22,
  },
  circleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
});

export default styles;
