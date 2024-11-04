import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAgent = (req, res, next) => {
  if (req.user.type !== 'agent') {
    return res.status(403).json({ message: 'Access denied. Agents only.' });
  }
  next();
};

export const isPolicyHolder = (req, res, next) => {
  if (req.user.type !== 'policyholder') {
    return res.status(403).json({ message: 'Access denied. Policy holders only.' });
  }
  next();
};