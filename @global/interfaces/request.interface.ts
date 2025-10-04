import { Request } from 'express';
import { IOauthJwtPayload } from './jwt-oauth.interface';

export interface EnhanceRequest extends Request {
  tokenPayload: IOauthJwtPayload;
  rawToken: string;
}
