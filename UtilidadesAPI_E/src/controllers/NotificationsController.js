const { Op } = require('sequelize');
const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            order: [['id', 'DESC']]
        });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getNotificationByProfile = async (req, res) => {

    const { profile } = req.params;

    try {
        const notifications = await Notification.findAll({
            where: { profile },
            order: [['id', 'DESC']],
        });

        if (!notifications.length) {
            return res.json([]);
        }

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getNotificationByCompany = async (req, res) => {
    const { companyDocument } = req.params;

    try {
        const notifications = await Notification.findAll({
            where: {
                text2: {
                    [Op.like]: `%${companyDocument}%`
                }
            },
            order: [['id', 'DESC']],
        });

        if (!notifications.length) {
            return res.json([]);
        }

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const putNotification = async (req, res) => {

    const { id } = req.params;
    const notification = req.body;

    if (id != notification.id) {
        return res.status(400).json({ message: 'NOTIFICATION mismatch' });
    }

    try {
        const [updated] = await Notification.update(notification, {
            where: { id }
        });

        if (updated) {
            return res.status(204).send();
        }

        throw new Error('Notification not found');


    } catch (error) {
        if (error.message === 'Template not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

const postNotification = async (req, res) => {
    const notifications = req.body;

    try {
        if (!Array.isArray(notifications) || notifications.length === 0) {
            return res.status(400).json({ error: 'Invalid input: Expected an array of notifications' });
        }

        const createdNotifications = await Notification.bulkCreate(notifications);

        return res.status(201).json({
            message: `${createdNotifications.length} notifications created successfully`
        });
    } catch (error) {
        console.error('Error creating notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteNotification = async (req, res) => {
    const ids = req.body; // Se asume que el cuerpo de la solicitud contiene un array de IDs.

    try {
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Invalid input: Expected an array of IDs' });
        }

        // Encontrar todas las notificaciones que corresponden a los IDs
        const notifications = await Notification.findAll({
            where: {
                id: ids
            }
        });

        if (notifications.length === 0) {
            return res.status(404).json({ error: 'Notifications not found' });
        }

        // Eliminar las notificaciones encontradas
        await Notification.destroy({
            where: {
                id: ids
            }
        });

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteNotificationByCompany = async (req, res) => {
    const companyDocument = req.params;


    try {
        const notifications = await Notification.findAll({
            where: {
                text2: {
                    [Op.like]: `%${companyDocument.companyDocument}%`
                }
            }
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for the provided company document' });
        }

        await Notification.destroy({
            where: {
                id: notifications.map(notification => notification.id)
            }
        });

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting notifications:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getNotifications,
    getNotificationByProfile,
    getNotificationByCompany,
    putNotification,
    postNotification,
    deleteNotification,
    deleteNotificationByCompany
}