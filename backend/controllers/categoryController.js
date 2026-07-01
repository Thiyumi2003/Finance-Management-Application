const { validationResult } = require('express-validator');

const Category = require('../models/Category');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const { name, type } = req.body;
    const category = await Category.create({ userId: req.user._id, name, type });
    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };