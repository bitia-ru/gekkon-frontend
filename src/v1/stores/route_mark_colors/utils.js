import Axios from 'axios';
import { ApiUrl } from '../../Environ';
import {
  loadRouteMarkColorsRequest,
  loadRouteMarkColorsFailed,
  loadRouteMarkColorsSuccess,
} from './actions';
import { displayError } from '@/v2/utils/showToastr';

export const loadRouteMarkColors = () => (
  (dispatch) => {
    dispatch(loadRouteMarkColorsRequest());

    Axios.get(`${ApiUrl}/v1/route_mark_colors`, { withCredentials: true })
      .then((response) => {
        dispatch(loadRouteMarkColorsSuccess(response.data.payload));
      }).catch((error) => {
        dispatch(loadRouteMarkColorsFailed());
        displayError(error);
      });
  }
);
