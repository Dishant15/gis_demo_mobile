import {getSelectedLayerKeys} from './planningState.selectors';
import {
  handleLayerSelect,
  handleRegionSelect,
  resetPlanningState,
} from './planningState.reducer';
import {fetchLayerDataThunk} from './actionBar.services';
import {
  resetPlanningGisData,
  resetUnselectedLayerGisData,
} from './planningGis.reducer';

export const onRegionSelectionUpdate =
  updatedRegionIdList => (dispatch, getState) => {
    const storeState = getState();
    const selectedLayerKeys = getSelectedLayerKeys(storeState);

    // set selected regions
    dispatch(handleRegionSelect(updatedRegionIdList));
    // add region in selectedLayerKeys if not
    if (selectedLayerKeys.indexOf('region') === -1) {
      dispatch(handleLayerSelect('region'));
    }
    // fetch gis data for all region polygons
    dispatch(
      fetchLayerDataThunk({
        regionIdList: updatedRegionIdList,
        layerKey: 'region',
      }),
    );
    // re fetch data for each selected layers
    for (let l_ind = 0; l_ind < selectedLayerKeys.length; l_ind++) {
      const currLayerKey = selectedLayerKeys[l_ind];
      dispatch(
        fetchLayerDataThunk({
          regionIdList: updatedRegionIdList,
          layerKey: currLayerKey,
        }),
      );
    }
    dispatch(resetUnselectedLayerGisData(selectedLayerKeys));
  };

export const clearPlanningData = dispatch => {
  dispatch(resetPlanningState());
  dispatch(resetPlanningGisData());
};
