const { Op } = require('sequelize');
const Transaction= require('../models/Transaction'); // Ajusta esto según tu configuración
const CompanyDataCreation = require('../models/CompanyDataCreation')
const Company = require('../models/Company');
const transactionTypes = require('../public/javascripts/TransactionTypes')

const getActionText = (type) => {
    switch (type) {
        case transactionTypes.SENT_QA:
            return 'Compañía enviada a QA';
        case transactionTypes.SENT_PRD:
            return 'Compañía enviada a PRD';
        case transactionTypes.DELETE:
            return 'Compañía eliminada';
        default:
            return '';
    }
};

const getServicesText = (dataCreation) => {
    let services = '';
    if (dataCreation.salesinvoice_included) services += 'FE';
    if (dataCreation.documentsuport_included) services += services.length > 0 ? ';DS' : 'DS';
    if (dataCreation.payrroll_included) services += services.length > 0 ? ';NE' : 'NE';
    if (dataCreation.reception_salesinvoice_included) services += services.length > 0 ? ';RE' : 'RE';
    return services;
};

const getAmbientText = (jsonString) => {
    let ambients = '';
    try {
        const actions = JSON.parse(jsonString);
        if (actions.PRD.some(x => x.status)) ambients += ambients.includes('PRD') ? '' : ambients.length > 0 ? ';PRD' : 'PRD';
        if (actions.QA.some(x => x.status)) ambients += ambients.includes('QA') ? '' : ambients.length > 0 ? ';QA' : 'QA';
    } catch {
        try {
            const actions = JSON.parse(jsonString);
            for (const action of actions.filter(x => x.status)) {
                if (action.message.includes('PRD')) ambients += ambients.includes('PRD') ? '' : ambients.length > 0 ? ';PRD' : 'PRD';
                if (action.message.includes('QA')) ambients += ambients.includes('QA') ? '' : ambients.length > 0 ? ';QA' : 'QA';
            }
        } catch {}
    }
    return ambients;
};

// GET: api/CompaniesAuthorized
const getCompaniesAuthorized = async (req, res) =>  {
    const { desde, hasta } = req.query;
    try {
        const companies = await Company.findAll({
            include: [{ model: CompanyDataCreation, as: 'dataCreations' }]
        });

        const transactions = await Transaction.findAll({
            where: {
                transaction_type: { [Op.in]: [transactionTypes.SENT_QA, transactionTypes.SENT_PRD] },
                date: { [Op.between]: [new Date(desde), new Date(hasta)] }
            }
        });

        const companiesAuthorized = companies
            .map(c => {
                const result = transactions.find(t => (c.documenttype + "_" + c.documentnumber) === t.company_document);
                if (result) {

                    // Asegúrate de que dataCreations no es undefined antes de acceder a él
                    const dataCreation = c.dataCreations ? c.dataCreations[0] : null;

                    return {
                        distributor: c.distributorid,
                        documentnumber: c.documentnumber,
                        name: c.name || `${c.firstname} ${c.familyname}`,
                        date: result.date,
                        ambients: getAmbientText(result.description),
                        action: getActionText(result.transaction_type),
                        services: dataCreation ? getServicesText(dataCreation) : '', // Maneja el caso cuando dataCreation es null
                        user: result.user
                    };
                }
                
                return null;
                
            }).filter(c => c !== null);

            res.json(companiesAuthorized);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// GET: api/CompaniesDeleted
const getCompaniesDeleted = async (req, res) => {
    const { desde, hasta } = req.query;
    try {
        const companies = await Company.findAll({
            include: [{ model: CompanyDataCreation, as: 'dataCreations' }]
        });

        const transactions = await Transaction.findAll({
            where: {
                transaction_type: transactionTypes.DELETE,
                date: { [Op.between]: [new Date(desde), new Date(hasta)] }
            }
        });

        const companiesDeleted = companies
            .map(c => {
                const result = transactions.find(t => (c.documenttype + "_" + c.documentnumber) === t.company_document);
                if (result) {

                    // Asegúrate de que dataCreations no es undefined antes de acceder a él
                    const dataCreation = c.dataCreations ? c.dataCreations[0] : null;

                    return {
                        distributor: c.distributorid,
                        documentnumber: c.documentnumber,
                        name: c.name || `${c.firstname} ${c.familyname}`,
                        date: result.date,
                        ambients: '',
                        action: getActionText(result.transaction_type),
                        services: dataCreation ? getServicesText(dataCreation) : '', // Maneja el caso cuando dataCreation es null
                        user: result.user
                    };
                }
                return null;
            })
            .filter(c => c !== null);

        res.json(companiesDeleted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCompaniesAuthorized,
    getCompaniesDeleted
}

