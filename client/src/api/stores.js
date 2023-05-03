import { clientPrivate, clientPublic } from './index';

export const getProduct = (tagUuid) => clientPrivate.get(`stores/tags/${tagUuid}/`);
