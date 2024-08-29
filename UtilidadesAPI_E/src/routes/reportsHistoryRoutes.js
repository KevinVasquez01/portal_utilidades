const express = require('express');
const reportsHistoryController = require('../controllers/ReportsHistoryController');

const router = express.Router();

router.get('/GetReportsHistory', reportsHistoryController.getReportsHistory);
router.get('/GetReportsHistory/:id', reportsHistoryController.getReportHistory);
router.get('/GetReportsHistory_Labels', reportsHistoryController.getReportsHistory_Labels);
router.put('/:id', reportsHistoryController.putReportsHistory);
router.post('', reportsHistoryController.postReportsHistory);


module.exports = router;