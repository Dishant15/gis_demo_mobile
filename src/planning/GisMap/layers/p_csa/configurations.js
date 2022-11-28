import {
  ELEMENT_FORM_ABSTRACT_TEMPLATE,
  ELEMENT_TABLE_ABSTRACT_FIELDS,
  FEATURE_TYPES,
} from '../common/configuration';
import {FIELD_TYPES} from '~Common/DynamicForm';
import {percentToHex} from '~utils/app.utils';

import CsaIcon from '~assets/markers/csa.svg';

export const LAYER_KEY = 'p_csa';
export const PRE_UID = 'CSA';
export const LAYER_FEATURE_TYPE = FEATURE_TYPES.POLYGON;

const STROKE_COLOR = '#65AA33';
const FILL_COLOR = '#65AA33' + percentToHex(30);

export const getViewOptions = () => ({
  strokeColor: STROKE_COLOR,
  fillColor: FILL_COLOR,
  icon: CsaIcon,
  pin: CsaIcon,
});

export const INITIAL_ELEMENT_DATA = {
  name: '',
  address: '',
  unique_id: '',
  network_id: '',
  ref_code: '',
  status: 'RFS',
  coordinates: {},
};

// this will become function -> generate From Configs
export const ELEMENT_FORM_TEMPLATE = {
  sections: [
    {
      title: 'CSA Form',
      fieldConfigs: [
        ...ELEMENT_FORM_ABSTRACT_TEMPLATE,
        {
          field_key: 'building_count',
          label: 'Building Count',
          field_type: FIELD_TYPES.Input,
        },
        {
          field_key: 'home_pass',
          label: 'Home Pass',
          field_type: FIELD_TYPES.Input,
          disabled: true,
        },
        {
          field_key: 'gis_area',
          label: 'Gis Area',
          field_type: FIELD_TYPES.Input,
        },
      ],
    },
  ],
};

export const ELEMENT_TABLE_FIELDS = [
  ...ELEMENT_TABLE_ABSTRACT_FIELDS,
  {label: 'Building Count', field: 'building_count', type: 'simple'},
  {label: 'Home Pass', field: 'home_pass', type: 'simple'},
  {label: 'Gis Area', field: 'gis_area', type: 'simple'},
];

export const ELEMENT_TABLE_EXTRA_CONTROLS = [
  {
    control: 'add_associations',
    data: ['p_dp'],
  },
  {
    control: 'association_list',
  },
];

// submitData : { ...elemPartialData }
// children : { layerKey: [child1, child2]}
export const getDependantFields = ({submitData, children}) => {
  let building_count = 0;
  let home_pass = 0;

  for (const childLayerKey in children) {
    if (Object.hasOwnProperty.call(children, childLayerKey)) {
      const currChildList = children[childLayerKey];
      for (let chInd = 0; chInd < currChildList.length; chInd++) {
        const currChild = currChildList[chInd];
        if (childLayerKey === 'p_survey_building') {
          building_count += 1;
          home_pass += currChild.total_home_pass;
        }
      }
    }
  }

  return {...submitData, building_count, home_pass};
};
