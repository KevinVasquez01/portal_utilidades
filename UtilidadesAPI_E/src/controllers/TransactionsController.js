const Transaction = require('../models/Transaction');
const {Op} = require('sequelize');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTransaction = async (req, res) => {
    const {id} = req.params;

    try {
        const transaction = await Transaction.findByPk(id);

        if(!transaction){
            return res.status(404).json({message: 'Transation not found'});
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const putTransaction = async (req, res) => {
    const {id} = req.params;
    const transaction = req.body;

    if(id != transaction.id){
        return res.status(400).json({ message: 'ID mismatch' });
    }

    try {
        const [updated] = await Transaction.update(transaction, {
            where: { id }
        })

        if (updated) {
            return res.status(204).send();
        }

        throw new Error('Transaction not found');
    } catch (error) {
        if (error.message === 'Transaction not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

//Revisar Metodo
const deleteTransaction_Delete = async (req, res) => {
    const  company_document  = req.query;

    try {
        // Encuentra las transacciones con el documentNumber dado que no tienen TransactionType igual a 1
        const transactions = await Transaction.findAll({
            where: {
                company_document: company_document,
                transaction_type: { [Op.ne]: 1 }
            }
        });

        // Actualiza el TransactionType a 1
        for (let t of transactions) {
            t.transaction_type = 1;
            await t.save();
        }

        // Devuelve una respuesta sin contenido
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

const postTransaction = async (req, res) => {
    const transaction = req.body;

    try {
        const report = await Transaction.create(transaction);
        res.status(201).json({
            message: 'Transaction created successfully',
            data: transaction,
            location: `/UtilidadesAPI/Transactions/${transaction.id}`,
          });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    const {id} = req.params;

    try {
        const transaction = await Transaction.findByPk(id);

        if(!transaction){
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.destroy();

        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
}

module.exports = {
    getTransactions,
    getTransaction,
    putTransaction,
    deleteTransaction_Delete,
    postTransaction,
    deleteTransaction
}