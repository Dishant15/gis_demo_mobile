import {StyleSheet} from 'react-native';
import {colors, THEME_COLORS} from '~constants/constants';

const styles = StyleSheet.create({
  markerWrapper: {
    borderWidth: 3,
    borderColor: THEME_COLORS.error.main,
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polylineIndicator: {
    borderWidth: 3,
    borderColor: THEME_COLORS.error.main,
    borderRadius: 16,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polylineIndicatorText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default styles;
