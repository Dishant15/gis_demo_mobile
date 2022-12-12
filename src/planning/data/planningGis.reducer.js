import {createSlice} from '@reduxjs/toolkit';
import get from 'lodash/get';
import has from 'lodash/has';
import size from 'lodash/size';
import difference from 'lodash/difference';
import cloneDeep from 'lodash/cloneDeep';
import countBy from 'lodash/countBy';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import isNumber from 'lodash/isNumber';

import {fetchLayerDataThunk} from './actionBar.services';
import {handleLayerSelect, removeLayerSelect} from './planningState.reducer';
import {convertLayerServerData} from '../GisMap/utils';
import {fetchTicketWorkorderDataThunk} from './ticket.services';
import {coordsToLatLongMap} from '~utils/map.utils';
import {logout} from '~Authentication/data/auth.reducer';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '~Common/components/Map/map.constants';

const defaultLayerNetworkState = {
  isLoading: false,
  isFetched: false,
  isError: false,
  isSelected: false,
  count: 0,
};

const initialState = {
  filters: {
    status: null,
  },
  // shape : { layer-key: { ...defaultLayerNetworkState } }
  layerNetworkState: {},
  // shape : { layer-key: [ {...Gis data, ...}, ...] }
  masterGisData: {},
  // filtered gis data, same as masterGisData
  layerData: {},
  /**
   * shape: {
   *    event: "addElement" | "editElement",
   *    data: { **Edit / init form data },
   *    layerKey,
   *    geometry: null | {} | [{},{},...]
   * }
   */
  mapState: {},
  mapPosition: {
    center: DEFAULT_MAP_CENTER,
    zoom: DEFAULT_MAP_ZOOM,
  },
  // shape { layerKey, elementId }
  mapHighlight: {},
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
    // payload : { filterKey, filterValue }
    setFilter: (state, {payload}) => {
      const {filterKey, filterValue} = payload;
      // filter layerData based on filter value
      let filteredGisLayerData = {};
      // filter elements by status
      if (filterKey === 'status') {
        // get keys of layerData
        const layerKeyList = Object.keys(state.masterGisData);
        // loop over layerKeys
        for (let lkInd = 0; lkInd < layerKeyList.length; lkInd++) {
          const currLayerKey = layerKeyList[lkInd];
          // filter list of elements of each layer key
          filteredGisLayerData[currLayerKey] = filter(
            state.masterGisData[currLayerKey],
            ['status', filterValue],
          );
        }
      }
      // update states
      state.layerData = filteredGisLayerData;
      state.filters[filterKey] = filterValue;
    },
    resetFilters: state => {
      state.layerData = cloneDeep(state.masterGisData);
      state.filters = initialState.filters;
    },
    // payload: ticketId ( Number ) | null
    setTicketId: (state, {payload}) => {
      state.ticketId = payload;
    },
    // payload: { layerKey, elementId, isTicket }
    hideElement: (state, {payload}) => {
      const {layerKey, elementId, isTicket} = payload;
      // hide current element from layerData
      const elemLayerDataInd = findIndex(state.layerData[layerKey], [
        'id',
        elementId,
      ]);
      if (elemLayerDataInd !== -1) {
        state.layerData[layerKey][elemLayerDataInd].hidden = true;
      }
      if (isTicket) {
        const workorderCurrIndex = findIndex(
          state.ticketData.work_orders,
          item => item.layer_key === layerKey && item.element.id === elementId,
        );
        if (workorderCurrIndex !== -1) {
          state.ticketData.work_orders[workorderCurrIndex].hidden = true;
        }
      }
    },
    // payload: { layerKey, elementId, isTicket }
    unHideElement: (state, {payload}) => {
      const {layerKey, elementId, isTicket} = payload;
      // hide current element from layerData
      const elemLayerDataInd = findIndex(state.layerData[layerKey], [
        'id',
        elementId,
      ]);
      if (elemLayerDataInd !== -1) {
        state.layerData[layerKey][elemLayerDataInd].hidden = false;
      }
      if (isTicket) {
        const workorderCurrIndex = findIndex(
          state.ticketData.work_orders,
          item => item.layer_key === layerKey && item.element.id === elementId,
        );
        if (workorderCurrIndex !== -1) {
          state.ticketData.work_orders[workorderCurrIndex].hidden = false;
        }
      }
    },
    // payload : { event, layerKey, data }
    setMapState: (state, {payload}) => {
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
    setMapPosition: (state, {payload}) => {
      // can not be partial as web
      state.mapPosition = {...payload};
    },
    setMapHighlight: (state, {payload}) => {
      // check previously any element is highlighted or not
      if (state.mapHighlight.layerKey) {
        // revert highlight current element from layerData
        const prevElemLayerDataInd = findIndex(
          state.layerData[state.mapHighlight.layerKey],
          ['id', state.mapHighlight.elementId],
        );
        if (prevElemLayerDataInd !== -1) {
          state.layerData[state.mapHighlight.layerKey][
            prevElemLayerDataInd
          ].highlighted = false;
        }
      }
      // highlight current element from layerData
      const elemLayerDataInd = findIndex(state.layerData[payload.layerKey], [
        'id',
        payload.elementId,
      ]);
      if (elemLayerDataInd !== -1) {
        state.layerData[payload.layerKey][elemLayerDataInd].highlighted = true;
      }
      state.mapHighlight = {...payload};
    },
    resetMapHighlight: state => {
      // revert highlight and reset mapHighlight
      const elemLayerDataInd = findIndex(
        state.layerData[state.mapHighlight.layerKey],
        ['id', state.mapHighlight.elementId],
      );
      if (elemLayerDataInd !== -1) {
        state.layerData[state.mapHighlight.layerKey][
          elemLayerDataInd
        ].highlighted = false;
      }
      state.mapHighlight = {};
    },
    setTicketMapHighlight: (state, {payload}) => {
      // payload: ticket-wo id
      // check previous ticket element is highlighted or not
      if (isNumber(state.ticketData.ticketHighlightedWo)) {
        const workorderInd = findIndex(state.ticketData.work_orders, [
          'id',
          state.ticketData.ticketHighlightedWo,
        ]);
        if (workorderInd !== -1) {
          state.ticketData.work_orders[workorderInd].highlighted = false;
        }
      }
      // highlight current ticket wo
      const workorderInd = findIndex(state.ticketData.work_orders, [
        'id',
        payload,
      ]);
      if (workorderInd !== -1) {
        state.ticketData.work_orders[workorderInd].highlighted = true;
        state.ticketData.ticketHighlightedWo = payload;
      }
    },
    resetTicketMapHighlight: state => {
      const workorderInd = findIndex(state.ticketData.work_orders, [
        'id',
        state.ticketData.ticketHighlightedWo,
      ]);
      if (workorderInd !== -1) {
        state.ticketData.work_orders[workorderInd].highlighted = false;
        state.ticketData.ticketHighlightedWo = undefined;
      }
    },
    // reset ticker data if user visit planning map from drawer
    resetTicketData: state => {
      state.mapState = {};
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
        state.masterGisData[layerKey] = [];
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
      const convertedLayerGisData = cloneDeep(
        convertLayerServerData(layerKey, action.payload),
      );
      state.masterGisData[layerKey] = convertedLayerGisData;
      state.layerData[layerKey] = convertedLayerGisData;
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
  setMapPosition,
  setFilter,
  resetFilters,
  hideElement,
  unHideElement,
  setMapHighlight,
  resetMapHighlight,
  setTicketMapHighlight,
  resetTicketMapHighlight,
} = planningGisSlice.actions;
export default planningGisSlice.reducer;
