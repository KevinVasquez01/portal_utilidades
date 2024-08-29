import { jsonItemsI } from './jsonItems'

export interface jsonI {
  Root: string;
  GET: Array<jsonI>;
  POST: Array<jsonI>;
  PUT: Array<jsonI>;
}
