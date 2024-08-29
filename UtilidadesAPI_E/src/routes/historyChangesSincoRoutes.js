const express = require('express');
const historyChangesSinco = require('../controllers/HistoryChangesSincoController');

const router = express.Router();

router.get('/GetHistoryChangesSinco', historyChangesSinco.getHistoryChangesSinco);
router.get('/GetHistoryChangesSinco/:documentnumber', historyChangesSinco.getHistoryChangeSinco);
router.get('/GetHistoryChangesSincoLast', historyChangesSinco.getHistoryChangesSincoLast);
router.post('', historyChangesSinco.postReportsHistory);


module.exports = router;