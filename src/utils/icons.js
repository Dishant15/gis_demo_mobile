import {LAYER_KEY as P_DP_LAYER_KEY} from '~planning/GisMap/layers/p_dp';
import {LAYER_KEY as P_SPLITTER_LAYER_KEY} from '~planning/GisMap/layers/p_splitter';

import PDPViewIcon from '~assets/markers/p_dp_view.svg';
import SpliterIcon from '~assets/markers/spliter_view.svg';

export const ICONS = iconName => {
  switch (iconName) {
    case P_DP_LAYER_KEY:
      return PDPViewIcon;
    case P_SPLITTER_LAYER_KEY:
      return SpliterIcon;
    default:
      return null;
  }
};
