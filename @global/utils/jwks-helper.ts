import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

export const convertPublicJwkToPem = async (jwk: any) => {
  try {
    const pem = jwkToPem(jwk);
    return pem;
  } catch (err) {
    console.error('Error converting JWK to PEM:', err);
    throw err;
  }
};

export const getKidFromJwt = async (token: any) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded?.header.kid;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    return null;
  }
};
