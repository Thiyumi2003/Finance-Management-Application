const express = require('express');
const { body, param } = require('express-validator');

const {
  createAccount,
  deleteAccount,
  listAccounts,
  updateAccount
} = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const accountValidationRules = [
  body('name').trim().notEmpty().withMessage('Account name is required'),
  body('type').isIn(['wallet', 'bank', 'business']).withMessage('Valid account type is required'),
  body('balance').optional().isFloat({ min: 0 }).withMessage('Balance must be zero or positive'),
  body('description').optional().trim()
];

router.use(protect);
router.get('/', listAccounts);
router.post('/', accountValidationRules, createAccount);
router.put('/:id', [param('id').isMongoId(), ...accountValidationRules], updateAccount);
router.delete('/:id', [param('id').isMongoId()], deleteAccount);

module.exports = router;