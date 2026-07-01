const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  const secret = process.env.JWT_SECRET || 'development-only-secret';

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
}

module.exports = { protect };