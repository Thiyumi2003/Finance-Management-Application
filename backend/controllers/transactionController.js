const { validationResult } = require('express-validator');

const {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction
} = require('../services/transactionService');

async function listAllTransactions(req, res, next) {
  try {
    const transactions = await listTransactions(req.user._id, req.query);
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
}

async function createIncome(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const transaction = await createTransaction(req.user._id, 'income', req.body);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const transaction = await createTransaction(req.user._id, 'expense', req.body);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
}

async function createTransfer(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const transaction = await createTransaction(req.user._id, 'transfer', req.body);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
}

async function updateTransactionById(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const transaction = await updateTransaction(req.user._id, req.params.id, req.body);
    res.json({ transaction });
  } catch (error) {
    next(error);
  }
}

async function deleteTransactionById(req, res, next) {
  try {
    await deleteTransaction(req.user._id, req.params.id);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listAllTransactions,
  createIncome,
  createExpense,
  createTransfer,
  updateTransactionById,
  deleteTransactionById
};