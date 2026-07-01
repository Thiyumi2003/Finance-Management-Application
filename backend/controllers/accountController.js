const { validationResult } = require('express-validator');

const Account = require('../models/Account');

async function listAccounts(req, res, next) {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (error) {
    next(error);
  }
}

async function createAccount(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, type, balance = 0, description = '' } = req.body;

    const account = await Account.create({
      userId: req.user._id,
      name,
      type,
      balance,
      description
    });

    res.status(201).json({ account });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const account = await Account.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const account = await Account.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listAccounts, createAccount, updateAccount, deleteAccount };