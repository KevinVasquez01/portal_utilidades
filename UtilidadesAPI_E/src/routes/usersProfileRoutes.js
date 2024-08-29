const express = require('express');
const profilesController = require('../controllers/ProfilesController');

const router = express.Router();

router.get('/:email', profilesController.getProfile);
router.get('', profilesController.getProfiles);


module.exports = router;