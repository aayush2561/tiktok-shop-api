import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload, passwordReset, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: passwordReset
      ? process.env.PASSWORD_RESET_TOKEN_EXPIRATION
      : '3d',
  });
  if (!passwordReset) {
    res.cookie('jwt', token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === 'true' ? true : false,
      sameSite: process.env.PRODUCTION === 'true' ? 'None' : 'Lax',
    });
  }

  return token;
};
