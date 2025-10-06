import { Request } from 'express';

export interface IJwtPayload {
  tokenId: string;
  userId: string;
  email: string;
}

export interface IEnhanceRequest extends Request {
  tokenPayload: IJwtPayload;
  rawToken: string;
}
