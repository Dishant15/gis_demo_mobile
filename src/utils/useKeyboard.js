import {useEffect, useState} from 'react';
import {Keyboard, Dimensions} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {height} = Dimensions.get('window');

export const useKeyboard = () => {
  const {bottom, top} = useSafeAreaInsets();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [availableHeight, setAvailableHeight] = useState(height);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        const keyboardHeight = e.endCoordinates.height;
        setKeyboardVisible(true);
        setKeyboardHeight(keyboardHeight);
        setAvailableHeight(height - keyboardHeight - top - bottom);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return {isKeyboardVisible, availableHeight, keyboardHeight};
};
