const express = require('express');
const authRoutes = require('./authRoutes');
const accountRoutes = require('./accountRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Finance Management API ready' });
});

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);

module.exports = router;