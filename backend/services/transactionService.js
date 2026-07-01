const mongoose = require('mongoose');

const Account = require('../models/Account');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

function getBalanceImpact(transaction) {
  if (transaction.type === 'income') {
    return [{ accountId: transaction.accountId, delta: transaction.amount }];
  }

  if (transaction.type === 'expense') {
    return [{ accountId: transaction.accountId, delta: -transaction.amount }];
  }

  if (transaction.type === 'transfer') {
    return [
      { accountId: transaction.fromAccount, delta: -transaction.amount },
      { accountId: transaction.toAccount, delta: transaction.amount }
    ];
  }

  return [];
}

async function loadOwnedAccount(accountId, userId, session) {
  const account = await Account.findOne({ _id: accountId, userId }).session(session);

  if (!account) {
    throw Object.assign(new Error('Account not found'), { status: 404 });
  }

  return account;
}

async function loadOwnedCategory(categoryId, userId, session) {
  if (!categoryId) {
    return null;
  }

  const category = await Category.findOne({ _id: categoryId, userId }).session(session);

  if (!category) {
    throw Object.assign(new Error('Category not found'), { status: 404 });
  }

  return category;
}

async function applyBalanceChanges(changes, userId, session) {
  for (const change of changes) {
    const account = await loadOwnedAccount(change.accountId, userId, session);
    const updatedBalance = account.balance + change.delta;

    if (updatedBalance < 0) {
      throw Object.assign(new Error('Insufficient account balance'), { status: 400 });
    }

    account.balance = updatedBalance;
    await account.save({ session });
  }
}

function normalizeTransactionInput(type, body) {
  if (type === 'transfer') {
    return {
      type,
      fromAccount: body.fromAccount,
      toAccount: body.toAccount,
      amount: Number(body.amount),
      description: body.description || '',
      date: body.date || Date.now()
    };
  }

  return {
    type,
    accountId: body.accountId,
    categoryId: body.categoryId || null,
    amount: Number(body.amount),
    description: body.description || '',
    date: body.date || Date.now()
  };
}

async function createTransaction(userId, type, body) {
  const session = await mongoose.startSession();
  let createdTransaction;

  try {
    session.startTransaction();

    const input = normalizeTransactionInput(type, body);

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw Object.assign(new Error('Amount must be greater than zero'), { status: 400 });
    }

    if (type === 'income' || type === 'expense') {
      await loadOwnedAccount(input.accountId, userId, session);
      await loadOwnedCategory(input.categoryId, userId, session);
    }

    if (type === 'transfer') {
      await loadOwnedAccount(input.fromAccount, userId, session);
      await loadOwnedAccount(input.toAccount, userId, session);

      if (String(input.fromAccount) === String(input.toAccount)) {
        throw Object.assign(new Error('Source and destination accounts must be different'), { status: 400 });
      }
    }

    const transaction = await Transaction.create([
      {
        userId,
        ...input
      }
    ], { session });

    await applyBalanceChanges(getBalanceImpact(transaction[0]), userId, session);

    createdTransaction = transaction[0];
    await session.commitTransaction();
    return createdTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function updateTransaction(userId, transactionId, body) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingTransaction = await Transaction.findOne({ _id: transactionId, userId }).session(session);

    if (!existingTransaction) {
      throw Object.assign(new Error('Transaction not found'), { status: 404 });
    }

    await applyBalanceChanges(
      getBalanceImpact(existingTransaction).map((change) => ({ accountId: change.accountId, delta: -change.delta })),
      userId,
      session
    );

    const nextType = body.type || existingTransaction.type;
    const nextTransaction = normalizeTransactionInput(nextType, {
      accountId: body.accountId ?? existingTransaction.accountId,
      categoryId: body.categoryId ?? existingTransaction.categoryId,
      fromAccount: body.fromAccount ?? existingTransaction.fromAccount,
      toAccount: body.toAccount ?? existingTransaction.toAccount,
      amount: body.amount ?? existingTransaction.amount,
      description: body.description ?? existingTransaction.description,
      date: body.date ?? existingTransaction.date
    });

    if (!Number.isFinite(nextTransaction.amount) || nextTransaction.amount <= 0) {
      throw Object.assign(new Error('Amount must be greater than zero'), { status: 400 });
    }

    if (nextType === 'income' || nextType === 'expense') {
      await loadOwnedAccount(nextTransaction.accountId, userId, session);
      await loadOwnedCategory(nextTransaction.categoryId, userId, session);
    }

    if (nextType === 'transfer') {
      await loadOwnedAccount(nextTransaction.fromAccount, userId, session);
      await loadOwnedAccount(nextTransaction.toAccount, userId, session);
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      {
        ...nextTransaction
      },
      { new: true, runValidators: true, session }
    );

    await applyBalanceChanges(getBalanceImpact(updatedTransaction), userId, session);

    await session.commitTransaction();
    return updatedTransaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function deleteTransaction(userId, transactionId) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transaction = await Transaction.findOne({ _id: transactionId, userId }).session(session);

    if (!transaction) {
      throw Object.assign(new Error('Transaction not found'), { status: 404 });
    }

    await applyBalanceChanges(
      getBalanceImpact(transaction).map((change) => ({ accountId: change.accountId, delta: -change.delta })),
      userId,
      session
    );

    await Transaction.deleteOne({ _id: transactionId, userId }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function listTransactions(userId, filters = {}) {
  const query = { userId };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.accountId) {
    query.$or = [{ accountId: filters.accountId }, { fromAccount: filters.accountId }, { toAccount: filters.accountId }];
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.fromDate || filters.toDate) {
    query.date = {};

    if (filters.fromDate) {
      query.date.$gte = new Date(filters.fromDate);
    }

    if (filters.toDate) {
      query.date.$lte = new Date(filters.toDate);
    }
  }

  if (filters.keyword) {
    query.description = { $regex: filters.keyword, $options: 'i' };
  }

  return Transaction.find(query)
    .populate('accountId', 'name type')
    .populate('categoryId', 'name type')
    .populate('fromAccount', 'name type')
    .populate('toAccount', 'name type')
    .sort({ date: -1, createdAt: -1 });
}

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listTransactions
};