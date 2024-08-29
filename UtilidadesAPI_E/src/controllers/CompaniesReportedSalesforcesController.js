const CompaniesReportedSalesforce = require('../models/CompaniesReportedSalesforce');

const GetCompaniesReportedSalesforces = async (req, res) => {
    try {
        const companiesReported = await CompaniesReportedSalesforce.findAll();
        res.json(companiesReported);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
} 

const GetCompaniesReportedSalesforce = async (req, res) => {

  const {report_type} = req.params;

  try {
    const companiesReported = await CompaniesReportedSalesforce.findAll({
      where: {report_type}
    });

    if (!companiesReported.length) {
      return res.status(404).json({ message: 'No companies found for the given report type' });
    }
    res.json(companiesReported);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const PutCompaniesReportedSalesforce = async (req, res) => {
  const {id} = req.params;
  const companiesReportedSalesforce = req.body;

  if (id != companiesReportedSalesforce.id) {
    return res.status(400).json({ message: 'ID mismatch' });
  }

  try {
    const [updated] = await CompaniesReportedSalesforce.update(companiesReportedSalesforce, {
      where: { id }
    });

    if (updated) {
      return res.status(204).send();
    }

    throw new Error('Company not found');
  } catch (error) {
    if (error.message === 'Company not found') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

const PostCompaniesReportedSalesforce = async (req, res) => {

  const companiesReportedSalesforce = req.body;

  try {
    for (let i = 0; i < companiesReportedSalesforce.length; i++) {
      await CompaniesReportedSalesforce.create(companiesReportedSalesforce[i]);
    }
    res.status(201).json({
      message: 'Companies reported successfully',
      count: companiesReportedSalesforce.length
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
    GetCompaniesReportedSalesforces,
    GetCompaniesReportedSalesforce,
    PutCompaniesReportedSalesforce,
    PostCompaniesReportedSalesforce
}