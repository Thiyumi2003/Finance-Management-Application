const express = require('express');
const { body } = require('express-validator');

const { login, me, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const registerValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidationRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidationRules, register);
router.post('/login', loginValidationRules, login);
router.get('/me', protect, me);

module.exports = router;