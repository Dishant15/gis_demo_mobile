import {queryClient} from '~App/App';
import {logout} from './auth.reducer';

export const handleLogoutUser = dispatch => {
  queryClient.clear();
  dispatch(logout());
};
