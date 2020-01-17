import Axios from 'axios';
import { ApiUrl } from '../../Environ';
import {
  loadNewsRequest,
  loadNewsFailed,
  loadNewsSuccess,
} from './actions';

export const loadNews = () => (
  (dispatch) => {
    dispatch(loadNewsRequest());

    Axios.get(`${ApiUrl}/v1/news`, { withCredentials: true })
      .then((response) => {
        dispatch(loadNewsSuccess(response.data));
      }).catch((error) => {
        dispatch(loadNewsFailed());
        // dispatch(pushError(error));
      });
  }
);
