import jwt from 'jsonwebtoken';

/**
 * Middleware to protect routes.
 * Extracts the JWT from the Authorization header, verifies it,
 * and attaches decoded user payload to req.user.
 */
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};
