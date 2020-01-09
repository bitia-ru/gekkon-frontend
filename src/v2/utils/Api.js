import Axios from 'axios';
import * as R from 'ramda';
import Qs from 'qs';
import { ApiUrl } from '@/Environ';


Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

const Api = {
  get(url, options) {
    Axios.get(
      `${ApiUrl}${url}`,
      {
        withCredentials: true,
      },
    ).then((response) => {
      if (!options.success) {
        return;
      }

      options.success(response.data.payload);
    }).catch((error) => {
      if (!options.failed) {
        return;
      }

      options.failed(error);
    });
  },
};

export default Api;
