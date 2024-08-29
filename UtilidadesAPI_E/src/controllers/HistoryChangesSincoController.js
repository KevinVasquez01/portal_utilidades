const HistoryChangesSinco = require('../models/HistoryChangesSinco');

const getHistoryChangesSinco = async (req, res) => {
    try {
        const historyChangesSinco = await HistoryChangesSinco.findAll();
        res.json(historyChangesSinco);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getHistoryChangeSinco = async (req, res) => {
    const {documentnumber} = req.params;
    const document_number = documentnumber;

    try {
        const historyChangesSinco = await HistoryChangesSinco.findAll({
            where: {document_number}
        });

         // Ordenar los resultados por fecha de cambio en orden descendente
         const lastChanges = historyChangesSinco.sort((a, b) => new Date(b.date_change) - new Date(a.date_change));

         // Retornar los cambios de historial ordenados
         res.json(lastChanges);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getHistoryChangesSincoLast = async (req, res) => {
    try {
        // Obtener todos los registros de HistoryChangesSinco
        const reports = await HistoryChangesSinco.findAll();
    
        // Ordenar los registros por DateChange en orden descendente
        const lastChanges = reports.sort((a, b) => b.date_change - a.date_change);
    
        const toReturn = [];
        const documentNumbers = new Set();
    
        // Iterar sobre los registros ordenados
        for (const change of lastChanges) {
          if (!documentNumbers.has(change.document_number)) {
            toReturn.push(change);
            documentNumbers.add(change.document_number);
          }
    
          if (toReturn.length >= 10) {
            break;
          }
        }
    
        res.json(toReturn);
      } catch (error) {
        console.error('Error fetching history changes:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const postReportsHistory = async (req, res) => {
    const reportHistory = req.body;

    try {
        const reportsHistory = await HistoryChangesSinco.create(reportHistory);
        res.status(201).json({
            message: 'Report History created successfully',
            data: reportsHistory,
            location: `/UtilidadesAPI/HistoryChangesSinco/${reportsHistory.id}`,
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getHistoryChangesSinco,
    getHistoryChangeSinco,
    getHistoryChangesSincoLast,
    postReportsHistory
}