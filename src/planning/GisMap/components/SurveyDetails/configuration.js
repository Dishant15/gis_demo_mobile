import {FIELD_TYPES} from '~Common/DynamicForm';

const YES_NO_OPTS = [
  {value: 'Y', label: 'Yes'},
  {value: 'N', label: 'No'},
];

const GOOD_BAD_OPTS = [
  {value: 'G', label: 'Good'},
  {value: 'B', label: 'Bad'},
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
            field_key: 'pop_code',
            label: 'POP Code',
            field_type: FIELD_TYPES.Input,
          },
        ],
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
            options: GOOD_BAD_OPTS,
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
            field_key: 'avail_swan_connectivity',
            label: 'Availibility of SWAN connectivity',
            field_type: FIELD_TYPES.ChipSelect,
            options: YES_NO_OPTS,
          },
        ],
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
        ],
      },
    ],
  },
];
