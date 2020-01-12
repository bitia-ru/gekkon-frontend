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
    return Axios.get(
      `${ApiUrl}${url}`,
      {
        params: R.propOr({}, 'params', options),
        withCredentials: true,
      },
    ).then((response) => {
      if (!options.success) {
        return;
      }

      if (response.data.payload) {
        options.success(response.data.payload);
      } else {
        options.success(response.data);
      }
    }).catch((error) => {
      if (!options.failed) {
        return;
      }

      options.failed(error);
    });
  },
  post(url, options) {
    const method = R.propOr('post', 'method')(options);

    if (![
      'post',
      'patch',
      'update',
      'delete',
    ].includes(method)) {
      throw `ArgumentError: method argument has invalid value ${method}.`;
    }

    Axios({
      ...options,
      url: `${ApiUrl}${url}`,
      method,
      withCredentials: true,
    }).then((response) => {
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
  patch(url, options) {
    return this.post(url, { ...options, method: 'patch' });
  },
};

export default Api;
