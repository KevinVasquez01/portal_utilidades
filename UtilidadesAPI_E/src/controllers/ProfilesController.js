const UsersProfile = require('../models/UsersProfile');

const getProfile = async (req, res) => {

    const {email} = req.params; 
    const user = email;
    try {
        const profile = await UsersProfile.findOne({
            where: {user}
        });

        if (!profile) {
            const newProfile = await UsersProfile.create({
              user: email.toLowerCase(),
              profile: 'guest'
            });
            return res.json(newProfile);
          }
      
          return res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const getProfiles = async (req, res) => {
    try {
        const profiles = await UsersProfile.findAll();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getProfile,
    getProfiles
}