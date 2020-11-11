// On récupère la connexion a la bdd
const db = require('../database');

const profile = {
    /**
     * Permet de modifier les informations du compte
     * @param - id de l'user
     * @param - userName de l'user
     * @param - email de l'user
     * @param - password de l'user
     */
    editProfile: async (data) => {
        // on décomponse la requete SQL avec les informations que l'on veut insérer 
        const sql = `UPDATE nav.user SET "userName" = $1, "email" = $2, "password" = $3, "updated_at" = now() WHERE id = $4 RETURNING "id", "userName", "email", "detail_id";`;
        // on se connecte à la BD avec notre client , ici DB , et on stock dans data la requete complete pour notre return
        const dataUpdate = await db.query(sql, [data.userName, data.email, data.password, data.id]);
        // On renvoie les données mis a jours 
        return dataUpdate.rows[0];
    },
    /**
     * Permet de supprimer le compte 
     * @param - id de l'user
     * @param - id de game_details
     */
    deleteProfile: async (user) => {
        // requete SQL pour supprimer les party de l'utilisateur
        const sql = `DELETE FROM game.party WHERE user_id = $1;`;
        // requete SQL pour supprimer l'utilisateur
        const sql2 = `DELETE FROM nav.user WHERE id = $1;`;
        // requete SQL pour supprimer les details de l'utilisateur
        const sql3 = `DELETE FROM nav.game_details WHERE id = $1;`;
        // On lance la premiere requete pour supprimer les party d'un utilisateur
        await db.query(sql, [user.id]);
        // On lance la deuxieme requete pour supprimer un utilisateur
        await db.query(sql2, [user.id]);
        // On lance la troisieme requete pour supprimer les details d'un utilisateur
        await db.query(sql3, [user.details_id]);

        const message = 'Votre compte a bien été supprimé.';
        // On retourne le message de confirmation de suppression de compte
        return message;
    },

};

module.exports = profile;