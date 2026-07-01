const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

function getMonthRange(month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return { start, end };
}

async function buildDashboardReport(userId) {
  const [accounts, incomeSummary, expenseSummary, recentTransactions, monthlyTransactions, expenseByCategory] =
    await Promise.all([
      Account.find({ userId }).sort({ createdAt: -1 }),
      Transaction.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.find({ userId }).sort({ date: -1, createdAt: -1 }).limit(5).populate('accountId', 'name').populate('categoryId', 'name').populate('fromAccount', 'name').populate('toAccount', 'name'),
      Transaction.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              type: '$type'
            },
            total: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Transaction.aggregate([
        { $match: { userId, type: 'expense' } },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { categoryId: '$categoryId', categoryName: '$category.name' },
            total: { $sum: '$amount' }
          }
        },
        { $sort: { total: -1 } }
      ])
    ]);

  const monthlyMap = new Map();

  for (const entry of monthlyTransactions) {
    const key = `${entry._id.year}-${entry._id.month}`;
    const label = new Date(entry._id.year, entry._id.month - 1, 1).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { label, income: 0, expense: 0 });
    }

    const current = monthlyMap.get(key);

    if (entry._id.type === 'income') {
      current.income = entry.total;
    }

    if (entry._id.type === 'expense') {
      current.expense = entry.total;
    }
  }

  return {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    totalIncome: incomeSummary[0]?.total || 0,
    totalExpenses: expenseSummary[0]?.total || 0,
    accountCount: accounts.length,
    netSavings: (incomeSummary[0]?.total || 0) - (expenseSummary[0]?.total || 0),
    recentTransactions,
    monthlyOverview: Array.from(monthlyMap.values()),
    expenseByCategory: expenseByCategory.map((entry) => ({
      name: entry._id.categoryName || 'Uncategorized',
      value: entry.total
    }))
  };
}

async function getDashboardReport(req, res, next) {
  try {
    const report = await buildDashboardReport(req.user._id);
    res.json(report);
  } catch (error) {
    next(error);
  }
}

async function getMonthlyReport(req, res, next) {
  try {
    const currentDate = new Date();
    const month = Number(req.query.month || currentDate.getMonth() + 1);
    const year = Number(req.query.year || currentDate.getFullYear());
    const { start, end } = getMonthRange(month, year);

    const [incomeSummary, expenseSummary, transactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: req.user._id, type: 'income', date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.find({ userId: req.user._id, date: { $gte: start, $lt: end } })
        .sort({ date: -1, createdAt: -1 })
        .populate('accountId', 'name')
        .populate('categoryId', 'name')
        .populate('fromAccount', 'name')
        .populate('toAccount', 'name')
    ]);

    const incomeTotal = incomeSummary[0]?.total || 0;
    const expenseTotal = expenseSummary[0]?.total || 0;

    res.json({
      month,
      year,
      incomeTotal,
      expenseTotal,
      savings: incomeTotal - expenseTotal,
      transactions
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboardReport, getMonthlyReport };