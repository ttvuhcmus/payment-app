const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = { 
    encrypt: (password) => {
        const salt = bcrypt.genSaltSync(saltRounds);
    
        try {
            const encrypted = bcrypt.hashSync(password, salt);
            return encrypted;
        } catch(err) {
            console.error(err);
        }
    },

    auth: (hash, password) => {
        try {
            let match = bcrypt.compareSync(password, hash);
            return match;
        } catch(err) {
            console.error(err);
        }
    }
 };
