const express = require('express');
const { body, param } = require('express-validator');

const {
  createExpense,
  createIncome,
  createTransfer,
  deleteTransactionById,
  listAllTransactions,
  updateTransactionById
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const incomeValidationRules = [
  body('accountId').isMongoId().withMessage('Valid account is required'),
  body('categoryId').optional({ nullable: true }).isMongoId().withMessage('Valid category is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Valid date is required')
];

const expenseValidationRules = [
  body('accountId').isMongoId().withMessage('Valid account is required'),
  body('categoryId').optional({ nullable: true }).isMongoId().withMessage('Valid category is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Valid date is required')
];

const transferValidationRules = [
  body('fromAccount').isMongoId().withMessage('Valid source account is required'),
  body('toAccount').isMongoId().withMessage('Valid destination account is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Valid date is required')
];

const updateValidationRules = [
  param('id').isMongoId().withMessage('Valid transaction id is required'),
  body('type').optional().isIn(['income', 'expense', 'transfer']).withMessage('Valid transaction type is required'),
  body('accountId').optional().isMongoId(),
  body('fromAccount').optional().isMongoId(),
  body('toAccount').optional().isMongoId(),
  body('categoryId').optional({ nullable: true }).isMongoId(),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('description').optional().trim(),
  body('date').optional().isISO8601().withMessage('Valid date is required')
];

router.use(protect);
router.get('/', listAllTransactions);
router.post('/income', incomeValidationRules, createIncome);
router.post('/expense', expenseValidationRules, createExpense);
router.post('/transfer', transferValidationRules, createTransfer);
router.put('/:id', updateValidationRules, updateTransactionById);
router.delete('/:id', [param('id').isMongoId()], deleteTransactionById);

module.exports = router;