const ReportsHistory = require('../models/ReportsHistory');
const sequelize = require('sequelize');

const getReportsHistory = async (req, res) => {
    try {
        const reportsHistory = await ReportsHistory.findAll();
        res.json(reportsHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getReportHistory = async (req, res) => {
    const { id } = req.params;

    try {
        const reportHistory = await ReportsHistory.findByPk(id);

        if (!reportHistory) {
            return res.status(404).json({ message: 'Report History not found by id' })
        }
        res.json(reportHistory);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getReportsHistory_Labels = async (req, res) => {
    try {
        const reports = await ReportsHistory.findAll({
            attributes: ['id', 'date', 'user', 'report_type', [sequelize.literal("''"), 'json'], 'new_companies', 'new_money']
        });

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found' });
        }

        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const putReportsHistory = async (req, res) => {
    const { id } = req.params;
    const reportHistory = req.body;

    if (id != reportHistory.id) {
        return res.status(400).json({ message: 'ID mismatch' });
    }

    try {
        const [updated] = await ReportsHistory.update(reportHistory, {
            where: { id }
        })

        if (updated) {
            return res.status(204).send();
        }

        throw new Error('ReportHistory not found');
    } catch (error) {
        if (error.message === 'ReportHistory not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

const postReportsHistory = async (req, res) => {
    const reportHistory = req.body;

    try {
        const report = await ReportsHistory.create(reportHistory);
        res.status(201).json({
            message: 'ReportHistory created successfully',
            data: reportHistory,
            location: `/UtilidadesAPI/ReportsHistory/${reportHistory.id}`,
          });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getReportsHistory,
    getReportHistory,
    getReportsHistory_Labels,
    putReportsHistory,
    postReportsHistory
}