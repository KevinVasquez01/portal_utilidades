const express = require('express');
const companiesController = require('../controllers/CompaniesController');

const router = express.Router();

router.get('/GetCompanies', companiesController.getCompanies);
router.get('/GetCompaniesPending', companiesController.getCompaniesPending);
router.get('/GetCompaniesfrom', companiesController.getCompaniesFrom);
router.get('/:documentNumber', companiesController.getCompany);
router.put('/:id', companiesController.updateCompany);
router.post('/NewCompany', companiesController.newCompany); 

module.exports = router;
