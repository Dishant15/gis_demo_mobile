import {createSlice} from '@reduxjs/toolkit';
import get from 'lodash/get';
import has from 'lodash/has';
import size from 'lodash/size';
import difference from 'lodash/difference';
import cloneDeep from 'lodash/cloneDeep';
import countBy from 'lodash/countBy';
import findIndex from 'lodash/findIndex';
import isNumber from 'lodash/isNumber';

import {polygon} from '@turf/turf';

import {fetchLayerDataThunk} from './actionBar.services';
import {handleLayerSelect, removeLayerSelect} from './planningState.reducer';
import {filterGisDataByPolygon, filterLayerData} from './planning.utils';
import {convertLayerServerData, LayerKeyNameMapping} from '../GisMap/utils';
import {
  fetchSurveyTicketWorkorderDataThunk,
  fetchSurveyWoDetailsThunk,
  fetchTicketDetailsThunk,
  fetchTicketWorkorderDataThunk,
} from './ticket.services';
import {
  coordsToLatLongMap,
  getMapBoundsFromRegion,
  latLongMapToCoords,
} from '~utils/map.utils';
import {logout} from '~Authentication/data/auth.reducer';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
} from '~Common/components/Map/map.constants';
import {showToast, TOAST_TYPE} from '~utils/toast.utils';
import {INIT_FORM_DATA} from '~planning/GisMap/components/SurveyDetails/configuration';

// if layer data elements go above this size data will be stored in cache first
const MAX_ALLOWED_DATA_COUNT = 200;
// shape : { layer-key: [ {...Gis data, ...}, ...] }
// same as masterGisData | layerData
export const LAYER_GIS_CACHE = {};

const defaultLayerNetworkState = {
  isLoading: false,
  isFetched: false,
  // when layer size is too big put it into cache rather than reducer
  isCached: false,
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
  // coords of 4 corners [latlon1,latlon2,latlon3,latlon4]
  mapBounds: getMapBoundsFromRegion(DEFAULT_MAP_CENTER),
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
  // survey ticket details
  surveyTicketData: {
    isLoading: false,
    isFetched: false,
    isError: false,
  },
  surveyTicketWorkorder: {
    isLoading: false,
    isFetched: false,
    isError: false,
    list: [],
  },
  surveyWorkorder: {
    isLoading: false,
    isFetched: false,
    isError: false,
    // 1: add form, 2: edit form, 3: review, 4: error
    screenType: null,
  },
};

const planningGisSlice = createSlice({
  name: 'planningGis',
  initialState,
  reducers: {
    // payload : { filterKey, filterValue }
    setFilter: (state, {payload}) => {
      const {filterKey, filterValue} = payload;

      state.filters[filterKey] = filterValue;
      // get keys of layerData
      const layerKeyList = Object.keys(state.masterGisData);
      // loop over layerKeys
      for (let lkInd = 0; lkInd < layerKeyList.length; lkInd++) {
        const currLayerKey = layerKeyList[lkInd];
        state.layerData[currLayerKey] = filterLayerData(
          filterKey,
          filterValue,
          state.layerData[currLayerKey],
        );
      }
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
    setMapBounds: (state, {payload}) => {
      const {region, zoom} = payload;
      const mapBounds = getMapBoundsFromRegion(region);
      state.mapBounds = mapBounds;

      const selectedLayerKeys = [];
      for (const key in state.layerNetworkState) {
        if (Object.hasOwnProperty.call(state.layerNetworkState, key)) {
          const currLayer = state.layerNetworkState[key];
          if (currLayer.isSelected) {
            selectedLayerKeys.push(key);
          }
        }
      }

      const filterPolygon = polygon([latLongMapToCoords(mapBounds)]);
      // loop over LAYER_GIS_CACHE and update masterGisData with filterPolygon
      const filteredData = filterGisDataByPolygon({
        filterPolygon,
        gisData: LAYER_GIS_CACHE,
        // whitelist only selected layers
        whiteList: selectedLayerKeys,
        groupByLayerKey: true,
      });

      for (const key in filteredData) {
        if (Object.hasOwnProperty.call(filteredData, key)) {
          const filteredLayerCount = size(filteredData[key]);
          if (filteredLayerCount > MAX_ALLOWED_DATA_COUNT) {
            showToast(
              `Zoom in on map to see ${LayerKeyNameMapping[key]} elements`,
              TOAST_TYPE.ERROR,
            );
            state.masterGisData[key] = [];
            state.layerData[key] = [];
          } else {
            state.masterGisData[key] = filteredData[key];
            // apply filter if exist
            if (state.filters.status) {
              state.layerData[key] = filterLayerData(
                'status',
                state.filters.status,
                filteredData[key],
              );
            } else {
              state.layerData[key] = filteredData[key];
            }
          }
        }
      }

      if (state.mapHighlight.layerKey) {
        // highlight current element from layerData
        const elemLayerDataInd = findIndex(
          state.layerData[state.mapHighlight.layerKey],
          ['id', state.mapHighlight.elementId],
        );
        if (elemLayerDataInd !== -1) {
          state.layerData[state.mapHighlight.layerKey][
            elemLayerDataInd
          ].highlighted = true;
        }
      }
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
    setSurveyWoScreenType: (state, {payload}) => {
      state.surveyWorkorder.screenType = payload;
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
          isCached: false,
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
      const layerElemCount = size(action.payload);
      state.layerNetworkState[layerKey].count = layerElemCount;
      // put layer into cache if element count is too big
      const shouldCacheData = layerElemCount > MAX_ALLOWED_DATA_COUNT;
      state.layerNetworkState[layerKey].isCached = shouldCacheData;
      // convert payload coordinates into google coordinates data
      const convertedLayerGisData = cloneDeep(
        convertLayerServerData(layerKey, action.payload),
      );
      if (shouldCacheData) {
        // filter data by user viewport
        LAYER_GIS_CACHE[layerKey] = convertedLayerGisData;
        const filterPolygon = polygon([latLongMapToCoords(state.mapBounds)]);
        const filteredData = filterGisDataByPolygon({
          filterPolygon,
          gisData: LAYER_GIS_CACHE,
          whiteList: [layerKey],
          groupByLayerKey: true,
        });

        const filteredLayerCount = size(filteredData[layerKey]);
        if (filteredLayerCount > MAX_ALLOWED_DATA_COUNT) {
          showToast(
            `Zoom in on map to see ${LayerKeyNameMapping[layerKey]} elements`,
            TOAST_TYPE.ERROR,
          );
          state.masterGisData[layerKey] = [];
          state.layerData[layerKey] = [];
        } else {
          state.masterGisData[layerKey] = filteredData[layerKey];
          state.layerData[layerKey] = filteredData[layerKey];
        }
      } else {
        state.masterGisData[layerKey] = convertedLayerGisData;
        state.layerData[layerKey] = convertedLayerGisData;
      }

      // filter layerData based on existing filter value and update states
      if (state.filters.status) {
        state.layerData[layerKey] = filterLayerData(
          'status',
          state.filters.status,
          state.masterGisData[layerKey],
        );
      }
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
    [fetchSurveyTicketWorkorderDataThunk.pending]: (state, action) => {
      state.surveyTicketWorkorder.isLoading = true;
      state.surveyTicketWorkorder.isError = false;
    },
    [fetchSurveyTicketWorkorderDataThunk.rejected]: (state, action) => {
      state.surveyTicketWorkorder.isLoading = false;
      state.surveyTicketWorkorder.isError = true;
    },
    [fetchSurveyTicketWorkorderDataThunk.fulfilled]: (state, action) => {
      state.surveyTicketWorkorder.list = action.payload;
      state.surveyTicketWorkorder.isLoading = false;
      state.surveyTicketWorkorder.isError = false;
    },
    [fetchTicketDetailsThunk.pending]: (state, action) => {
      state.surveyTicketData.isLoading = true;
      state.surveyTicketData.isError = false;
    },
    [fetchTicketDetailsThunk.rejected]: (state, action) => {
      state.surveyTicketData.isLoading = false;
      state.surveyTicketData.isError = true;
    },
    [fetchTicketDetailsThunk.fulfilled]: (state, action) => {
      let ticketDetails = cloneDeep(action.payload);
      ticketDetails.area_pocket.coordinates = coordsToLatLongMap(
        ticketDetails.area_pocket.coordinates,
      );
      ticketDetails.area_pocket.center = coordsToLatLongMap([
        ticketDetails.area_pocket.center,
      ])[0];
      state.surveyTicketData = ticketDetails;
      state.surveyTicketData.isLoading = false;
      state.surveyTicketData.isError = false;
    },
    [fetchSurveyWoDetailsThunk.pending]: (state, action) => {
      state.surveyWorkorder.isLoading = true;
      state.surveyWorkorder.isError = false;
    },
    [fetchSurveyWoDetailsThunk.rejected]: (state, action) => {
      state.surveyWorkorder.isLoading = false;
      state.surveyWorkorder.isError = true;
      if (action.payload === 404) {
        // show add form
        state.surveyWorkorder.screenType = 1;
        state.mapState.currentStep = 1;
        state.mapState.data = {
          ...state.mapState.data,
          ...INIT_FORM_DATA,
        };
      } else {
        // error screen
        state.surveyWorkorder.screenType = 4;
      }
    },
    [fetchSurveyWoDetailsThunk.fulfilled]: (state, action) => {
      state.surveyWorkorder = action.payload;
      state.surveyWorkorder.isLoading = false;
      state.surveyWorkorder.isError = false;
      // review screen
      state.surveyWorkorder.screenType = 3;
      state.mapState.data = {
        ...state.mapState.data,
        ...action.payload,
      };
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
  setMapBounds,
  setSurveyWoScreenType,
} = planningGisSlice.actions;
export default planningGisSlice.reducer;
