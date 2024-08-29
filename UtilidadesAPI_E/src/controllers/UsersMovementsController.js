const UsersMovement = require('../models/UsersMovement');

const getUsersMovements = async (req, res) => {
    try {
        const movements = await UsersMovement.findAll();
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Revisar horas 
const getUsersMovement = async (req, res) => {
    const {desde} = req.params;
    try {
        const movements = await UsersMovement.findAll();

        const filteredMovements = movements.filter((movement) => {
            const date = movement.date;

            if(movements.length > 0){
              const movementDate = movement.date;
              return movementDate <= new Date(desde);
            }
            return false;
          });
      
          res.json(filteredMovements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const putUsersMovement = async (req, res) => {
    const {id} = req.params;
    const usersMovement = req.body;

    if (id != usersMovement.id) {
        return res.status(400).json({ message: 'ID mismatch' });
    }

    try {
        const [updated] = await UsersMovement.update(usersMovement, {
            where: { id }
        })

        if (updated) {
            return res.status(204).send();
        }

        throw new Error('UserMovement not found');
    } catch (error) {
        if (error.message === 'ReportHistory not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
}

const postUsersMovement = async (req, res) => {
    const usersMovement = req.body;
    try {
        const movement = await UsersMovement.create(usersMovement);
        res.status(201).json({
            message: 'UserMovement created successfully',
            data: movement,
            location: `/UtilidadesAPI/UsersMovements/${movement.id}`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getUsersMovements,
    getUsersMovement,
    putUsersMovement,
    postUsersMovement
}