import {useMutation} from 'react-query';
import {useDispatch} from 'react-redux';

import get from 'lodash/get';

import {validateElementGeometry} from '~planning/data/layer.services';
import {updateMapStateDataErrPolygons} from '~planning/data/planningGis.reducer';

import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {coordsToLatLongMap} from '~utils/map.utils';

/**
 * validate region intersects
 * on error set errPolyCoords into redux
 */
const useValidateGeometry = ({
  setErrPolygonAction = updateMapStateDataErrPolygons,
}) => {
  const dispatch = useDispatch();

  const {mutate: validateElement, isLoading: isValidationLoading} = useMutation(
    validateElementGeometry,
    {
      // reset errors on mutate
      onMutate: () => {
        dispatch(setErrPolygonAction(null));
      },
      onSuccess: res => {
        const softErrors = get(res, 'data.soft_errors');
        if (!!softErrors) {
          for (let seInd = 0; seInd < softErrors.length; seInd++) {
            const currError = softErrors[seInd];
            showToast(get(currError, 'contains.0'), TOAST_TYPE.INFO);
          }
        }
      },
      onError: err => {
        if (err.response.status === 400) {
          const errData = get(err, 'response.data', {});
          // is intersections error
          if (!!errData.intersects?.length) {
            // get and show error polygon
            let errPolyCoords = [];
            for (
              let int_ind = 0;
              int_ind < errData.intersects.length;
              int_ind++
            ) {
              const currIntersectCoords = errData.intersects[int_ind];

              const errCoordinates = coordsToLatLongMap(currIntersectCoords[0]);

              errPolyCoords.push(errCoordinates);
            }
            if (errPolyCoords.length && setErrPolygonAction) {
              dispatch(setErrPolygonAction(errPolyCoords));
            }
            showToast(
              'New geometry has incorrect intersection with adjacent geometries. Please correct the red area show on map.',
              TOAST_TYPE.ERROR,
            );
          } else if (!!errData.contains?.length) {
            showToast(get(errData, 'contains.0'), TOAST_TYPE.ERROR);
          }
        } else {
          // can be 500 error
          showToast(
            'Something went wrong at our side. Please try again after refreshing the page.',
            TOAST_TYPE.ERROR,
          );
        }
      },
    },
  );

  return {
    validateElementMutation: validateElement,
    isValidationLoading,
  };
};

export default useValidateGeometry;
