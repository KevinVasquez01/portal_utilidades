const DefaultTemplate = require('../models/DefaultTemplate')

const getDefaultTemplates = async (req, res) => {
    try {
        const defaultTemplates = await DefaultTemplate.findAll();
        res.json(defaultTemplates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getDefaultTemplate = async (req, res) => {
    const {id} = req.params;
    try {
        const defaultTemplate = await DefaultTemplate.findByPk(id);

        if(!defaultTemplate){
            return res.status(404).json({ message: 'Default Template not found'});
        }

        res.json(defaultTemplate);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const putDefaultTemplate = async (req, res) => {
    const {id} = req.params;
    const defaultTemplate = req.body;

    if (id != defaultTemplate.id) {
        return res.status(400).json({ message: 'TEMPLATE mismatch' });
      }

    try {
        const [updated] = await DefaultTemplate.update(defaultTemplate, {
            where: { id }
          });
      
          if (updated) {
            return res.status(204).send();
          }
      
          throw new Error('Template not found');
    } catch (error) {
        if (error.message === 'Template not found') {
            return res.status(404).json({ message: error.message });
          }
          return res.status(500).json({ error: error.message });
    }
}

const postDefaultTemplate = async (req, res) => {
    const defaultTemplate = req.body;

    try {
        const createdDefaultTemplate = await DefaultTemplate.create(defaultTemplate);
        res.status(201).json({
            message: 'Template created successfully',
            data: createdDefaultTemplate,
            location: `/UtilidadesAPI/DefaultTemplates/${createdDefaultTemplate.id}`,
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteDefaultTemplate = async (req, res) => {
    const {id} = req.params;

    try {
        const template = await DefaultTemplate.findByPk(id);

        if(!template){
            return res.status(404).json({ message: 'DataElement not found' });
        }
        await template.destroy();
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}


module.exports = {
    getDefaultTemplates,
    getDefaultTemplate,
    putDefaultTemplate,
    postDefaultTemplate,
    deleteDefaultTemplate
}