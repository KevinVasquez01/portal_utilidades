const express = require('express');
const auditController = require('../controllers/AuditController');

const router = express.Router();

router.get('/GetCompaniesAuthorized', auditController.getCompaniesAuthorized);
router.get('/GetCompaniesDeleted', auditController.getCompaniesDeleted);


module.exports = router;