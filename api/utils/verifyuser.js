// import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.access_token;

//   if (!token) return next(errorHandler(401, 'Unauthorized'));

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden'));

//     req.user = user;
//     next();
//   });
// };
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  // Get token from cookies or Authorization header
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

  // Check if token is present
  if (!token) return next(errorHandler(401, 'Unauthorized: No token provided'));

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Error:', err.message); // Log error for debugging
      return next(errorHandler(403, 'Forbidden: Invalid or expired token'));
    }

    // Attach user to request object
    req.user = user;
    next(); // Pass control to the next middleware
  });
};
