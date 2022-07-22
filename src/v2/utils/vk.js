import * as R from 'ramda';
import { ApiUrl } from '@/v1/Environ';
import { CLIENT_ID, REDIRECT_URI_PATH } from '@/v1/Constants/Vk';
import closeForm from '@/v2/utils/closeForm';

const redirectUri = () => (
  ApiUrl.match(/^https?:\/\/.*/) ? (
    `${ApiUrl}${REDIRECT_URI_PATH}`
  ) : (
    `${window.location.origin}${ApiUrl}${REDIRECT_URI_PATH}`
  )
);

const params = (type, token, rememberMe) => ({
  client_id: CLIENT_ID,
  scope: 'email%2Cphotos',
  redirect_uri: redirectUri(),
  response_type: 'code',
  v: '5.131',
  state: btoa(
    JSON.stringify({
      method: type,
      token,
      rememberMe,
    })
  ),
});

const paramsSerialized = (type, token, rememberMe) => {
  let queryString = new URLSearchParams();
  const queryParams = params(type, token, rememberMe);

  for (const k in queryParams)
    queryString.set(k, queryParams[k]);

  return queryString.toString();
};

export const afterVkEnter = ev => {
  if (ev.data.result !== 'success')
    return;
  ev.source.close();
  closeForm();
  window.removeEventListener('message', afterVkEnter);
};

export const enterWithVk = (type, token, rememberMe) => {
  window.open(
    `https://oauth.vk.com/authorize?${paramsSerialized(type, token, rememberMe)}`,
    'VK',
    'resizable,scrollbars,status',
  );

  window.addEventListener('message', afterVkEnter);
};
