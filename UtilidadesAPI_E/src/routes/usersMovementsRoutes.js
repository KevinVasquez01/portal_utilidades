const express = require('express');
const usersMovementsController = require('../controllers/UsersMovementsController');

const router = express.Router();

router.get('', usersMovementsController.getUsersMovements);
router.get('/:desde', usersMovementsController.getUsersMovement);
router.put('/:id', usersMovementsController.putUsersMovement);
router.post('', usersMovementsController.postUsersMovement);

module.exports = router;