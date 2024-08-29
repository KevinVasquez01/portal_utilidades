const express = require('express');
const notificationsController = require('../controllers/NotificationsController');

const router = express.Router();

router.get('', notificationsController.getNotifications);
router.get('/ByProfile/:profile', notificationsController.getNotificationByProfile);
router.get('/:companyDocument', notificationsController.getNotificationByCompany);
router.put('/:id', notificationsController.putNotification);
router.post('', notificationsController.postNotification);
router.delete('', notificationsController.deleteNotification);
router.delete('/:companyDocument', notificationsController.deleteNotificationByCompany);


module.exports = router;