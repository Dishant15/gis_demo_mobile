import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {noop} from './app.utils';

/**
 * helper to refetch query when screen in focus
 * https://react-query.tanstack.com/react-native#refetch-on-app-focus
 */
export const useRefreshOnFocus = (refetch = noop) => {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );
};
