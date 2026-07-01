const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

function ensureDatabaseConnected(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Database connection is not available. Set MONGODB_URI and restart the backend before registering or logging in.'
    });
    return false;
  }

  return true;
}

function buildAuthResponse(user) {
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token: generateToken({ id: user._id.toString() })
  };
}

async function register(req, res, next) {
  try {
    if (!ensureDatabaseConnected(res)) {
      return;
    }

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    if (!ensureDatabaseConnected(res)) {
      return;
    }

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  if (!ensureDatabaseConnected(res)) {
    return;
  }

  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
}

module.exports = { register, login, me };