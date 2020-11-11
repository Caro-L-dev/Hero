// On récupère la connexion a la bdd
const db = require('../database');

const user = {
    /**
     * On récupère tout les users
     */ 
    findAll: async () => {
        const sql = `SELECT * FROM nav.user;`;
        const data = await db.query(sql);
        return data.rows;
    },
    /**
     * On récupère un user par son id
     * @param number - id de l'user
     */ 
    findById: async (id) => {
        const sql = `SELECT * FROM nav.user WHERE id = $1;`;
        const data = await db.query(sql, [id]);
        return data.rows[0];
    },
    /**
     * On récupère un user par son userName
     * @param string - userName de l'user
     */ 
    findByUserName: async (userName) => {
        const sql = `SELECT * FROM nav.user WHERE "userName" = $1;`;
        //const sql =`SELECT * FROM nav.user JOIN nav.game_details ON nav.user.detail_id = nav.game_details.id WHERE "userName" = $1;`
        const data = await db.query(sql, [userName]);
        return data.rows[0];
    },
    /**
     * On crée les details de jeux pour un nouvel utilisateur
     * @param string - avatar de l'user
     * @param string - displayName de l'user
     */ 
    createGameDetails: async (newUser) => { // fonction qui va servir spécialement à la création du compte pour créer
        // un detail_id obligatoire à la gesiton de notre page profil
        // ici on décompose la requete SQL 
        const sql = `INSERT INTO nav.game_details ("avatar", "displayName") VALUES ($1, $2) RETURNING "id"`;
        // on se co à la BD avec le client db, on injecte dans la BD en dur "Warrior" pour l'avatar et displayName qui 
        // sera identique au userName 
        const data = await db.query(sql, ["https://i.ibb.co/6NjNMYH/faucheur.gif", "Faucheur"]);
        return data.rows[0];
    },
    /**
     * On crée un nouvel utilisateur en base de donnée
     * @param string - userName de l'user
     * @param string - email de l'user
     * @param string - password de l'user
     * @param number - detail_id de l'user
     */ 
    createUser: async (newUser) => {
        const gameDetails = await user.createGameDetails(newUser);
        // on décomponse la requete SQL avec les informations que l'on veut insérer 
        const sql = `INSERT INTO nav.user ("userName", "email", "password", "detail_id") VALUES ($1, $2, $3, $4) RETURNING "id", "userName";`;
        // on se connecte à la BD avec notre client , ici DB , et on stock dans data la requete complete pour notre return
        const data = await db.query(sql, [newUser.userName, newUser.email, newUser.password, gameDetails.id]);
        data.rows[0].message = ' Votre compte a été créé avec succès.';
        return data.rows[0];
    },

};

module.exports = user;