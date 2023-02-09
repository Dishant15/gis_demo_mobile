import {FIELD_TYPES} from '~Common/DynamicForm';

const YES_NO_OPTS = [
  {value: 'Y', label: 'Yes'},
  {value: 'N', label: 'No'},
];

const GOOD_BAD_OPTS = [
  {value: 'G', label: 'Good'},
  {value: 'B', label: 'Bad'},
];

const POP_OPTS = [
  {value: 'BL', label: 'Block'},
  {value: 'GP', label: 'GP'},
];

export const STEPS_TRACK = [
  {
    id: 1,
    title: 'Auto Address',
  },
  {id: 2, separator: true},
  {
    id: 3,
    title: 'PoP Survey Format',
  },
  {id: 4, separator: true},
  {
    id: 5,
    title: 'Civil & Electrical',
  },
  {id: 6, separator: true},
  {
    id: 7,
    title: 'Contact details',
  },
  {id: 8, separator: true},
  {
    id: 9,
    title: 'Upload Images',
  },
];

export const STEPS_CONFIG = [
  {
    sections: [
      {
        title: 'Auto Address',
        fieldConfigs: [
          {
            field_key: 'address',
            label: 'Address',
            field_type: FIELD_TYPES.TextArea,
          },
          {
            field_key: 'lat',
            label: 'Latitude',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'long',
            label: 'Longitude',
            field_type: FIELD_TYPES.Input,
          },
        ],
      },
    ],
    elementTableFields: [{label: 'Address', field: 'address', type: 'simple'}],
  },
  {
    sections: [
      {
        title: 'PoP Survey Format',
        fieldConfigs: [
          {
            field_key: 'package',
            label: 'Package (A/B/C/D)',
            field_type: FIELD_TYPES.ChipSelect,
            options: [
              {value: 'A', label: 'A'},
              {value: 'B', label: 'B'},
              {value: 'C', label: 'C'},
              {value: 'D', label: 'D'},
            ],
          },
          {
            field_key: 'msi_name',
            label: 'MSI/SI Name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'district_name',
            label: 'District Name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'district_code',
            label: 'District Code',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'block_name',
            label: 'Block Name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'block_code',
            label: 'Block Code',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'pop_name',
            label: 'POP Name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'pop_code',
            label: 'POP Code',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'pop_type',
            label: 'POP type (Block/Gp)',
            field_type: FIELD_TYPES.ChipSelect,
            options: POP_OPTS,
          },
          {
            field_key: 'installation_floor',
            label: 'Floor for installation',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'land_mark',
            label: 'Land mark',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'location_details',
            label: 'Location Details',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'connected_from',
            label: 'Block / GP connected from',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'connected_to',
            label: 'Block / GP connected to',
            field_type: FIELD_TYPES.Input,
          },
        ],
      },
    ],
    elementTableFields: [
      {label: 'Package (A/B/C/D)', field: 'package_display', type: 'simple'},
      {label: 'MSI/SI Name', field: 'msi_name', type: 'simple'},
      {label: 'District Name', field: 'district_name', type: 'simple'},
      {label: 'District Code', field: 'district_code', type: 'simple'},
      {label: 'Block Name', field: 'block_name', type: 'simple'},
      {label: 'Block Code', field: 'block_code', type: 'simple'},
      {label: 'POP Name', field: 'pop_name', type: 'simple'},
      {label: 'POP Code', field: 'pop_code', type: 'simple'},
      {
        label: 'POP type (Block/Gp)',
        field: 'pop_type_display',
        type: 'simple',
      },
      {
        label: 'Floor for installation',
        field: 'installation_floor',
        type: 'simple',
      },
      {label: 'Land mark', field: 'land_mark', type: 'simple'},
      {
        label: 'Location Details',
        field: 'location_details',
        type: 'simple',
      },
      {
        label: 'Block / GP connected from',
        field: 'connected_from',
        type: 'simple',
      },
      {
        label: 'Block / GP connected to',
        field: 'connected_to',
        type: 'simple',
      },
    ],
  },
  {
    sections: [
      {
        title: 'Civil & Electrical',
        fieldConfigs: [
          {
            field_key: 'building_condition',
            label: 'Building Condition',
            field_type: FIELD_TYPES.ChipSelect,
            options: GOOD_BAD_OPTS,
          },
          {
            field_key: 'ceil_condition',
            label: 'Rooftop/ceiling Condition',
            field_type: FIELD_TYPES.ChipSelect,
            options: GOOD_BAD_OPTS,
          },
          {
            field_key: 'pop_location_reachability',
            label: 'Pop location reachability',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
          {
            field_key: 'eb_service_connection_availability',
            label: 'Availability of EB service connection',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
          {
            field_key: 'regular_power_availability',
            label: 'Availability of regular power in day',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'input_voltage',
            label: 'Input Voltage',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'service_connection',
            label: 'Service connection / Customer number',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'total_contracted_load',
            label: 'Total contracted load',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'load_for_pop_room',
            label: 'Load Required for PoP room',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'incoming_eb_cable_size',
            label: 'Incoming EB cable size',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'main_door_entry_size',
            label: 'Size of main entry door to pop room',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'number_of_windows',
            label: 'Number of windows',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'space_availibility',
            label: 'Space availibility',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'seepage',
            label: 'Seepage',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
          {
            field_key: 'power_backup',
            label: 'Power backup (availibility of DG)',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
          {
            field_key: 'avail_swan_connectivity',
            label: 'Availibility of SWAN connectivity',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
          {
            field_key: 'dist_near_swan_pop',
            label: 'Distance from nearest SWAN Pop',
            field_type: FIELD_TYPES.Input,
          },
        ],
      },
    ],
    elementTableFields: [
      {
        label: 'Building Condition',
        field: 'building_condition_display',
        type: 'simple',
      },
      {
        label: 'Rooftop/ceiling Condition',
        field: 'ceil_condition_display',
        type: 'simple',
      },
      {
        label: 'Pop location reachability',
        field: 'pop_location_reachability_display',
        type: 'simple',
      },
      {
        label: 'Availability of EB service connection',
        field: 'eb_service_connection_availability_display',
        type: 'simple',
      },
      {
        label: 'Availability of regular power in day',
        field: 'regular_power_availability',
        type: 'simple',
      },
      {
        label: 'Input Voltage',
        field: 'input_voltage',
        type: 'simple',
      },
      {
        label: 'Service connection / Customer number',
        field: 'service_connection',
        type: 'simple',
      },
      {
        label: 'Total contracted load',
        field: 'total_contracted_load',
        type: 'simple',
      },
      {
        label: 'Load Required for PoP room',
        field: 'load_for_pop_room',
        type: 'simple',
      },
      {
        label: 'Incoming EB cable size',
        field: 'incoming_eb_cable_size',
        type: 'simple',
      },
      {
        label: 'Size of main entry door to pop room',
        field: 'main_door_entry_size',
        type: 'simple',
      },
      {
        label: 'Number of windows',
        field: 'number_of_windows',
        type: 'simple',
      },
      {
        label: 'Space availibility',
        field: 'space_availibility',
        type: 'simple',
      },
      {label: 'Seepage', field: 'seepage_display', type: 'simple'},
      {
        label: 'Power backup (availibility of DG)',
        field: 'power_backup_display',
        type: 'simple',
      },
      {
        label: 'Availibility of SWAN connectivity',
        field: 'avail_swan_connectivity_display',
        type: 'simple',
      },
      {
        label: 'Distance from nearest SWAN Pop',
        field: 'dist_near_swan_pop',
        type: 'simple',
      },
    ],
  },
  {
    sections: [
      {
        title: 'Contact details',
        fieldConfigs: [
          {
            field_key: 'contact_person_name',
            label: 'Contact person name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'designation',
            label: 'Designation',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'mobile_no',
            label: 'Mobile No',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'email_id',
            label: 'Email Id',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'alternate_name',
            label: 'Superior / Alternate name',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'alternate_designation',
            label: 'Designation',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'alternate_mobile_no',
            label: 'Mobile No',
            field_type: FIELD_TYPES.Input,
          },
          {
            field_key: 'alternate_email_id',
            label: 'Email Id',
            field_type: FIELD_TYPES.Input,
          },
        ],
      },
    ],
    elementTableFields: [
      {
        label: 'Contact person name',
        field: 'contact_person_name',
        type: 'simple',
      },
      {label: 'Designation', field: 'designation', type: 'simple'},
      {label: 'Mobile No', field: 'mobile_no', type: 'simple'},
      {label: 'Email Id', field: 'email_id', type: 'simple'},
      {
        label: 'Superior / Alternate name',
        field: 'alternate_name',
        type: 'simple',
      },
      {
        label: 'Designation',
        field: 'alternate_designation',
        type: 'simple',
      },
      {label: 'Mobile No', field: 'alternate_mobile_no', type: 'simple'},
      {label: 'Email Id', field: 'alternate_email_id', type: 'simple'},
    ],
  },
  {
    uploadImage: true,
    sections: [
      {
        title: 'Upload Images',
        fieldConfigs: [],
      },
    ],
    elementTableFields: [],
  },
];

export const INIT_FORM_DATA = {
  package: 'A',
  district_name: '',
  district_code: '',
  msi_name: '',
  block_code: '',
  pop_name: '',
  pop_code: '',
  pop_type: 'BL',
  installation_floor: '',
  land_mark: '',
  location_details: '',
  connected_from: '',
  connected_to: '',
  building_condition: 'G',
  ceil_condition: 'G',
  pop_location_reachability: 'N',
  eb_service_connection_availability: 'N',
  regular_power_availability: '',
  input_voltage: '',
  service_connection: '',
  total_contracted_load: '',
  load_for_pop_room: '',
  incoming_eb_cable_size: '',
  main_door_entry_size: '',
  number_of_windows: '',
  space_availibility: '',
  seepage: 'Y',
  power_backup: 'Y',
  avail_swan_connectivity: 'Y',
  dist_near_swan_pop: '',
  contact_person_name: '',
  designation: '',
  mobile_no: '',
  email_id: '',
  alternate_name: '',
  alternate_designation: '',
  alternate_mobile_no: '',
  alternate_email_id: '',
};
