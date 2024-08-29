const express = require('express');
const dataElementsController = require('../controllers/DataElementsController');

const router = express.Router();

router.get('/DataElements', dataElementsController.getDataElements);
router.get('/DataElements/:module', dataElementsController.getDataElement);
router.put('/DataElements/:module', dataElementsController.putDataElement);
router.post('/DataElements', dataElementsController.postDataElement);
router.delete('/DataElements/:id', dataElementsController.deleteDataElement);

module.exports = router;