export interface IOauthJwtPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nbf: number;
  email: string;
  scopes: string;
}
