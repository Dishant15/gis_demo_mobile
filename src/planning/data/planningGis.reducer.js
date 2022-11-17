import {createSlice} from '@reduxjs/toolkit';
import get from 'lodash/get';
import has from 'lodash/has';
import size from 'lodash/size';
import difference from 'lodash/difference';
import cloneDeep from 'lodash/cloneDeep';
import countBy from 'lodash/countBy';
import findIndex from 'lodash/findIndex';

import {fetchLayerDataThunk} from './actionBar.services';
import {handleLayerSelect, removeLayerSelect} from './planningState.reducer';
import {convertLayerServerData, PLANNING_EVENT} from '../GisMap/utils';
import {fetchTicketWorkorderDataThunk} from './ticket.services';
import {coordsToLatLongMap} from '~utils/map.utils';
import {logout} from '~Authentication/data/auth.reducer';

const defaultLayerNetworkState = {
  isLoading: false,
  isFetched: false,
  isError: false,
  isSelected: false,
  count: 0,
};

const initialState = {
  // shape : { layer-key: { ...defaultLayerNetworkState } }
  layerNetworkState: {},
  // shape : { layer-key: [ {...Gis data, ...}, ...] }
  layerData: {},
  /**
   * shape: {
   *    event: "addElement" | "editElement",
   *    data: { **Edit / init form data },
   *    layerKey, enableMapInterection,
   *    geometry: null | {} | [{},{},...]
   * }
   */
  mapState: {},
  // ticket related fields
  // set ticker data when user click on ticket from PlanningTicket
  // at same time workOrderId will be reset
  ticketId: null,
  // fetch ticket data based on ticketId, when TicketWorkorderScreen called.
  // refetch ticker data when user add / edit element
  // shape : { **Network state, **ticket fields, area_pocket: {},
  //          work_orders: [ {**WorkOrder fields, element }, ... ] }
  ticketData: {
    isLoading: false,
    isFetched: false,
    isError: false,
    isHidden: false,
  },
  // set workorder id if user select ticket workorder
  workOrderId: null,
};

const planningGisSlice = createSlice({
  name: 'planningGis',
  initialState,
  reducers: {
    // payload: ticketId ( Number ) | null
    setTicketId: (state, {payload}) => {
      state.ticketId = payload;
    },
    // payload : { event, layerKey, data }
    setMapState: (state, {payload}) => {
      const currMapState = state.mapState;
      // if next event is editElementGeometry
      if (
        payload.event === PLANNING_EVENT.editElementGeometry &&
        currMapState.event !== payload.event
      ) {
        // hide current element from layerData
        const elemLayerDataInd = findIndex(state.layerData[payload.layerKey], [
          'id',
          payload.data.elementId,
        ]);
        if (elemLayerDataInd !== -1) {
          state.layerData[payload.layerKey][elemLayerDataInd] = {
            ...state.layerData[payload.layerKey][elemLayerDataInd],
            hidden: true,
          };
        }
      }
      // if current event is editElementGeometry
      if (
        currMapState.event === PLANNING_EVENT.editElementGeometry &&
        // next event is not same
        currMapState.event !== payload.event
      ) {
        // show current element from layerData
        const elemLayerDataInd = findIndex(
          state.layerData[currMapState.layerKey],
          ['id', currMapState.data.elementId],
        );
        if (elemLayerDataInd !== -1) {
          state.layerData[currMapState.layerKey][elemLayerDataInd] = {
            ...state.layerData[currMapState.layerKey][elemLayerDataInd],
            hidden: false,
          };
        }
      }
      state.mapState = {...payload};
    },
    // only used in mobile, update and hold temparay Coordinates changes
    updateMapStateCoordinates: (state, {payload}) => {
      state.mapState.geometry = payload;
    },
    updateMapStateDataErrPolygons: (state, {payload}) => {
      state.mapState.errPolygons = payload;
    },
    setTicketWorkOrderId: (state, {payload}) => {
      state.workOrderId = payload;
    },
    toggleTicketElements: state => {
      state.ticketData.isHidden = !state.ticketData.isHidden;
    },
    // payload => list of selected layerKey
    // when region changes remove data for all inactive layers, so user can fetch fresh on click
    resetUnselectedLayerGisData: (state, {payload}) => {
      const allNSLayerKeys = difference(
        Object.keys(state.layerNetworkState),
        payload,
      );
      for (let lk_ind = 0; lk_ind < allNSLayerKeys.length; lk_ind++) {
        const currNsKey = allNSLayerKeys[lk_ind];
        if (currNsKey !== 'region') {
          // reset data
          state.layerNetworkState[currNsKey] = {
            ...defaultLayerNetworkState,
          };
          state.layerData[currNsKey] = [];
        }
      }
    },
    // reset ticker data if user visit planning map from drawer
    resetTicketData: state => {
      state.ticketId = null;
      state.ticketData = {
        isLoading: false,
        isFetched: false,
        isError: false,
        isHidden: false,
      };
      state.workOrderId = null;
    },
  },
  extraReducers: {
    // payload : layerKey
    [handleLayerSelect]: (state, {payload}) => {
      if (has(state, ['layerNetworkState', payload])) {
        state.layerNetworkState[payload].isSelected = true;
      }
    },
    [removeLayerSelect]: (state, {payload}) => {
      if (has(state, ['layerNetworkState', payload])) {
        state.layerNetworkState[payload].isSelected = false;
      }
    },
    // start loading
    [fetchLayerDataThunk.pending]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      if (has(state, ['layerNetworkState', layerKey])) {
        state.layerNetworkState[layerKey].isLoading = true;
        state.layerNetworkState[layerKey].isSelected = true;
      } else {
        // initialise new layer
        state.layerNetworkState[layerKey] = {
          ...defaultLayerNetworkState,
          isLoading: true,
          isSelected: true,
        };
        state.layerData[layerKey] = [];
      }
    },
    // fetch success
    [fetchLayerDataThunk.fulfilled]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      state.layerNetworkState[layerKey].isLoading = false;
      state.layerNetworkState[layerKey].isFetched = true;
      state.layerNetworkState[layerKey].count = size(action.payload);
      // convert payload coordinates into google coordinates data
      state.layerData[layerKey] = convertLayerServerData(
        layerKey,
        action.payload,
      );
    },
    // handle error
    [fetchLayerDataThunk.rejected]: (state, action) => {
      const layerKey = get(action, 'meta.arg.layerKey', '');
      state.layerNetworkState[layerKey].isError = true;
    },
    [fetchTicketWorkorderDataThunk.pending]: (state, action) => {
      state.ticketData.isLoading = true;
      state.ticketData.isError = false;
    },
    [fetchTicketWorkorderDataThunk.rejected]: (state, action) => {
      state.ticketData.isLoading = false;
      state.ticketData.isFetched = true;
      state.ticketData.isError = true;
    },
    [fetchTicketWorkorderDataThunk.fulfilled]: (state, action) => {
      let ticketGisData = cloneDeep(action.payload);
      // convert ticket gis data into google coordinate data
      // convert ticket area, center
      ticketGisData.area_pocket.coordinates = coordsToLatLongMap(
        ticketGisData.area_pocket.coordinates,
      );
      ticketGisData.area_pocket.center = coordsToLatLongMap([
        ticketGisData.area_pocket.center,
      ])[0];
      // convert all workorder coordinate data
      for (
        let tg_ind = 0;
        tg_ind < ticketGisData.work_orders.length;
        tg_ind++
      ) {
        const currWO = ticketGisData.work_orders[tg_ind];
        if (currWO.element?.id) {
          // delete type WO may not have element
          currWO.element = convertLayerServerData(currWO.layer_key, [
            currWO.element,
          ])[0];
        }
      }
      state.ticketData = ticketGisData;
      state.ticketData.isLoading = false;
      state.ticketData.isFetched = true;
      state.ticketData.isError = false;
      state.ticketData.countByStatus = countBy(
        ticketGisData.work_orders,
        'status',
      );
    },
    [logout]: () => {
      return initialState;
    },
  },
});

export const {
  setTicketId,
  setMapState,
  updateMapStateCoordinates,
  resetUnselectedLayerGisData,
  setTicketWorkOrderId,
  toggleTicketElements,
  resetTicketData,
  updateMapStateDataErrPolygons,
} = planningGisSlice.actions;
export default planningGisSlice.reducer;
