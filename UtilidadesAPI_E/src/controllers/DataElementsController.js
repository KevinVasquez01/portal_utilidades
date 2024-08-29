const DataElement = require('../models/DataElement');

const getDataElements = async (req, res) => {
    try {
        const dataElements = await DataElement.findAll();
        res.json(dataElements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getDataElement = async (req, res) => {

    const { module } = req.params;

    try {
        const dataElement = await DataElement.findOne({
            where: { module }
        });

        if (!dataElement) {
            return res.status(404).json({ message: 'DataElement not found' });
        }

        res.json(dataElement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const putDataElement = async (req, res) => {
    const { module } = req.params;
    const dataElement = req.body;
 
  if (module != dataElement.module) {
    return res.status(400).json({ message: 'MODULE mismatch' });
  }

    try {
        const [updated] = await DataElement.update(dataElement, {
            where: { module }
          });
      
          if (updated) {
            return res.status(204).send();
          }
      
          throw new Error('DataElement not found');
    } catch (error) {
        if (error.message === 'DataElement not found') {
            return res.status(404).json({ message: error.message });
          }
          return res.status(500).json({ error: error.message });
    }
}

const postDataElement = async (req, res) => {

    const dataElement = req.body;

    try {
        const createdDataElement = await DataElement.create(dataElement);
        res.status(201).json({
          message: 'DataElement created successfully',
          data: createdDataElement,
          location: `/UtilidadesAPI/DataElements/${createdDataElement.id}`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteDataElement = async (req, res) => {
    const {id} = req.params;

    try {
        const dataElement = await DataElement.findByPk(id);

        if (!dataElement) {
            return res.status(404).json({ message: 'DataElement not found' });
        }
        await dataElement.destroy();
        res.status(204).send(); // No Content

    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

module.exports = {
    getDataElements,
    getDataElement,
    putDataElement,
    postDataElement,
    deleteDataElement
}