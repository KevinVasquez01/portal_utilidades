const express = require('express');
const defaultTemplatesController = require('../controllers/DefaultTemplatesController');

const router = express.Router();

router.get('/DefaultTemplates', defaultTemplatesController.getDefaultTemplates);
router.get('/DefaultTemplates/:id', defaultTemplatesController.getDefaultTemplate);
router.put('/DefaultTemplates/:id', defaultTemplatesController.putDefaultTemplate);
router.post('/DefaultTemplates', defaultTemplatesController.postDefaultTemplate);
router.delete('/DefaultTemplates/:id', defaultTemplatesController.deleteDefaultTemplate);

module.exports = router;