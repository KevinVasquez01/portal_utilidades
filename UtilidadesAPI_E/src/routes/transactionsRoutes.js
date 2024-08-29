const express = require('express');
const transactionsController = require('../controllers/TransactionsController');

const router = express.Router();

router.get('', transactionsController.getTransactions);
router.get('/:id', transactionsController.getTransaction);
router.put('/:id', transactionsController.putTransaction);
router.put('/Transactions_Delete', transactionsController.deleteTransaction_Delete);
router.post('', transactionsController.postTransaction);
router.delete('/:id', transactionsController.deleteTransaction);


module.exports = router;