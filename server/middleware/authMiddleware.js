import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'arogyabridge-enterprise-jwt-secret-key-production-ready';

/**
 * Middleware to authenticate requests using JWT Bearer tokens
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { walletAddress, role, hhNumber, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Authorization token has expired. Please sign in again.' });
    }
    return res.status(403).json({ error: 'Invalid authorization token.' });
  }
};

/**
 * Optional authentication middleware: attaches user if token exists, but doesn't block if absent
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      // Ignore invalid optional tokens
    }
  }
  next();
};

/**
 * Middleware to restrict access based on user role(s)
 * @param  {...string} roles - e.g. 'Patient', 'Doctor', 'diagnosis', 'Admin'
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const allowed = roles.some(r => r.toLowerCase() === userRole);

    if (!allowed && userRole !== 'admin') {
      return res.status(403).json({ 
        error: `Forbidden: role '${req.user.role}' is not authorized to access this resource.` 
      });
    }

    next();
  };
};

export { JWT_SECRET };
