import replace from 'lodash/replace';

export const FIBER_COLOR_CODE_HEX_MAPPING = {
  blue: '#0142f2',
  orange: '#f37b02',
  green: '#01a51d',
  brown: '#833f00',
  slate: '#7d7d7d',
  white: '#FFF',
  red: '#f42300',
  black: '#000',
  yellow: '#f2d302',
  violet: '#9973ff',
  rose: '#ffbab8',
  aqua: '#65c4ff',
};

export const transformCablePortData = (portList = []) => {
  let portNameWiseData = {};
  for (let index = 0; index < portList.length; index++) {
    const port = portList[index];

    let portName = replace(port.name, '.I', '').replace('.O', '');
    if (!portNameWiseData[portName]) {
      portNameWiseData[portName] = port;
      portNameWiseData[portName]['common_name'] = portName;
    }
    if (port.is_input) {
      portNameWiseData[portName]['conn__to_A_end'] = port.element_unique_id;
    }
    if (!port.is_input) {
      portNameWiseData[portName]['conn__to_B_end'] = port.element_unique_id;
    }
  }
  return Object.values(portNameWiseData);
};

export const cableTableConfig = [
  {
    label: 'Sr No',
    key: 'sr_no',
  },
  {
    label: 'Name',
    key: 'common_name',
  },
  {
    label: 'Status',
    key: 'status_display',
  },
  {
    label: 'Tube Color',
    key: 'tube_color',
    type: 'color',
  },
  {
    label: 'Ribbon',
    key: 'ribbon',
  },
  {
    label: 'Fiber Color',
    key: 'fiber_color',
    type: 'color',
  },
  {
    label: 'A End',
    key: 'conn__to_A_end',
    type: 'port_number',
  },
  {
    label: 'B End',
    key: 'conn__to_B_end',
    type: 'port_number',
  },
];

export const oltTableConfig = [
  {
    label: 'Sr No',
    key: 'sr_no',
  },
  {
    label: 'Port',
    key: 'name',
  },
  {
    label: 'Status',
    key: 'status_display',
  },
  {
    label: 'Card',
    key: 'card',
  },
  {
    label: 'Port Type',
    key: 'port_type_display',
  },
  {
    label: 'Capacity (Gb/s)',
    key: 'capacity',
  },
  {
    label: 'Connection',
    key: 'connected_to',
    type: 'port_number',
  },
];

export const splitterTableConfig = [
  {
    label: 'Sr No',
    key: 'sr_no',
  },
  {
    label: 'Port',
    key: 'name',
  },
  {
    label: 'Status',
    key: 'status_display',
  },
  {
    label: 'Connection',
    key: 'connected_to',
    type: 'port_number',
  },
];
