const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('vehicleId', 'title price');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET transactions by user
router.get('/user/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyerId: req.params.userId }, { sellerId: req.params.userId }]
    }).populate('buyerId sellerId vehicleId');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction(req.body);
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update transaction status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedTransaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;