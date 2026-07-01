const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: true,
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);