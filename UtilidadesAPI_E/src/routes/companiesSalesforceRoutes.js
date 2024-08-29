const express = require('express');
const companiesReportedSalesforcesController = require('../controllers/CompaniesReportedSalesforcesController');

const router = express.Router();

router.get('/CompaniesReportedSalesforces', companiesReportedSalesforcesController.GetCompaniesReportedSalesforces);
router.get('/CompaniesReportedSalesforces/:report_type', companiesReportedSalesforcesController.GetCompaniesReportedSalesforce);
router.put('/CompaniesReportedSalesforces/:id', companiesReportedSalesforcesController.PutCompaniesReportedSalesforce);
router.post('/CompaniesReportedSalesforces',companiesReportedSalesforcesController.PostCompaniesReportedSalesforce )

module.exports = router;
