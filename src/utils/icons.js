import {LAYER_KEY as P_DP_LAYER_KEY} from '~planning/GisMap/layers/p_dp';
import {LAYER_KEY as P_SPLITTER_LAYER_KEY} from '~planning/GisMap/layers/p_splitter';
import {LAYER_KEY as P_LINE_LAYER_KEY} from '~planning/GisMap/layers/p_cable';

import PDPViewIcon from '~assets/markers/p_dp_view.svg';
import SpliterIcon from '~assets/markers/spliter_view.svg';
import CableIcon from '~assets/markers/line_pin.svg';

export const ICONS = iconName => {
  switch (iconName) {
    case P_DP_LAYER_KEY:
      return PDPViewIcon;
    case P_SPLITTER_LAYER_KEY:
      return SpliterIcon;
    case P_LINE_LAYER_KEY:
      return CableIcon;
    default:
      return null;
  }
};
