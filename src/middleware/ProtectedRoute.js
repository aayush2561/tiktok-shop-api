import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js';

export const protectedRoute = (allowedRoles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - No Token Provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: 'Forbidden - You do not have the required permissions',
        });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Unauthorized - Invalid Token' });
    }
  };
};
