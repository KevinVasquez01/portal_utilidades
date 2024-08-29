const {Op} = require('sequelize');
const { Sequelize } = require('sequelize');
const Company = require('../models/Company');
const CompanyContact = require('../models/CompanyContact');
const CompanyDataCreation = require('../models/CompanyDataCreation');
const CompanyResponsibility = require('../models/CompanyResponsibility');
const CompanySeries = require('../models/CompanySeries');
const CompanyUser = require('../models/CompanyUser');
const Transaction = require('..//models/Transaction');
const transactionTypes = require('../public/javascripts/TransactionTypes');


const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCompaniesPending = async (req, res) => {
  try {
    // Realiza una consulta para obtener todas las compañías que no tienen transacciones de tipo 'Update'
    const pendingCompanies = await Company.findAll({
      include: [
        { model: CompanyContact, as: 'contacts' },
        { model: CompanyDataCreation, as: 'dataCreations' },
        { model: CompanyResponsibility, as: 'responsibilities' },
        { model: CompanySeries, as: 'series' },
        { model: CompanyUser, as: 'users' },
      ],
      where: {
        [Op.and]: [
          Sequelize.literal(`
            NOT EXISTS (
              SELECT 1
              FROM "transactions" t
              WHERE t.company_document = CONCAT("company"."documenttype", '_', "company"."documentnumber")
              AND t.transaction_type != ${transactionTypes.UPDATE}
            )
          `),
        ],
      },
      order: [['id', 'DESC']],
    });

    res.json(pendingCompanies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCompaniesFrom = async (req, res) => {
  const { desde, hasta } = req.query;

  try {
    const companies = await Company.findAll({
      include: [
        { model: CompanyContact, as: 'contacts' },
        { model: CompanyDataCreation, as: 'dataCreations' },
        { model: CompanyResponsibility, as: 'responsibilities' },
        { model: CompanySeries, as: 'series' },
        { model: CompanyUser, as: 'users' },
      ],
    });

    const filteredCompanies = companies.filter((company) => {
      const datasCreations = company.dataCreations;
      
      if(datasCreations.length > 0){
        const creationDate = datasCreations[0].date_creation;
        return creationDate >= new Date(desde) && creationDate <= new Date(hasta);
      }
      return false;
    });

    res.json(filteredCompanies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCompany = async (req, res) => {
  const { documentNumber } = req.params;
  const documentnumber = documentNumber;
  try {
    const company = await Company.findOne({
      where: Sequelize.where(
        Sequelize.fn('concat', Sequelize.col('documenttype'), '_', Sequelize.col('documentnumber')),
        documentnumber
      ),
      include: [
        { model: CompanyContact, as: 'contacts' },
        { model: CompanyDataCreation, as: 'dataCreations' },
        { model: CompanyResponsibility, as: 'responsibilities' },
        { model: CompanySeries, as: 'series' },
        { model: CompanyUser, as: 'users' },
      ],
    });

    if (!company) {
      return res.status(200).json([]);
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params;
  const companyData = req.body;

  try {
    const company = await Company.findByPk(id, {
      include: [
        { model: CompanyContact, as: 'contacts' },
        { model: CompanyDataCreation, as: 'dataCreations' },
        { model: CompanyResponsibility, as: 'responsibilities' },
        { model: CompanySeries, as: 'series' },
        { model: CompanyUser, as: 'users' },
      ],
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found by id' });
    }

    await company.update(companyData);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const newCompany = async (req, res) => {
  const companyData = req.body;
  console.log(companyData);

  try {
    const existingCompany = await Company.findOne({
      where: {
        documenttype: companyData.documenttype,
        documentnumber: companyData.documentnumber,
      },
    });

    if (existingCompany) {
      return res.status(409).json({ message: 'Company with the same document already exists' });
    }

        // Crear la nueva compañía con sus asociaciones
        const newCompany = await Company.create(companyData, {
          include: [
            { model: CompanyContact, as: 'contacts' },
            { model: CompanyDataCreation, as: 'dataCreations' },
            { model: CompanyResponsibility, as: 'responsibilities' },
            { model: CompanySeries, as: 'series' },
            { model: CompanyUser, as: 'users' },
          ],
        });

    res.status(201).json({
      message: 'Company created successfully',
      id: newCompany.id
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompaniesPending,
  getCompaniesFrom,
  getCompany,
  updateCompany,
  newCompany,
};
