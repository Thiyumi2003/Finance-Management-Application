const express = require('express');
const { body, param } = require('express-validator');

const {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const categoryValidationRules = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Category type must be income or expense')
];

router.use(protect);
router.get('/', listCategories);
router.post('/', categoryValidationRules, createCategory);
router.put('/:id', [param('id').isMongoId(), ...categoryValidationRules], updateCategory);
router.delete('/:id', [param('id').isMongoId()], deleteCategory);

module.exports = router;