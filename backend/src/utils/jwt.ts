import jwt from 'jsonwebtoken';

export const signJwt = (payload: object): string => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyJwt = (token: string): any => {
  const secret = process.env.JWT_SECRET!;
  return jwt.verify(token, secret);
};
