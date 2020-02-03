import { ApiUrl } from '../Environ';
import ClientId from '../ClientId';

export const CLIENT_ID = ClientId;
export const REDIRECT_URI = `https://rovingclimbers.ru${ApiUrl}/v1/integrations/vk/callbacks/oauth2`;
