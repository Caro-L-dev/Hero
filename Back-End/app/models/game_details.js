// On récupère la connexion a la base de données
const db = require('../database');

const boardDetail = {
    /**
     * On récupère les game_details de l'user connecter dans la session par le details_id
     * @param - id de game_details
     */
    findById: async (id) => {
        // on prépare la requete
        const sql = `SELECT * FROM nav.game_details WHERE id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows[0];
    },
    /**
     * On modifie l'avatar et le displayName de l'user connecter dans la session
     * @param - id de game_details
     * @param - avatar de game_details
     * @param - displayName de game_details
     */
    editBoardProfile: async (boardUser) => {
        // on prépare la requete
        const sql = `UPDATE nav.game_details SET "displayName" = $1, "avatar" = $2 WHERE id = $3 RETURNING "displayName", "avatar";`;
        // on envoie la requete en bdd avec la requete preparer et les valeurs passé en parametre
        const boardUserUpdate = await db.query(sql, [boardUser.displayName, boardUser.avatar, boardUser.id]);
        // on stock un message de confirmation dans les données recus
        boardUserUpdate.rows[0].message = 'Vos informations ont été modifiées';
        // on renvoie les données
        return boardUserUpdate.rows[0];
    },
    /**
     * On modifie le gameWin, gameOver et gamePlay de l'user connecter dans la session
     * @param - id de game_details
     * @param - gameWin de game_details
     * @param - gameOver de game_details
     * @param - gamePlay de game_details
     */
    editBoardDetailGame: async (boardDetail) => {
        // on prépare la requete
        const sql = `UPDATE nav.game_details SET "gameWin" = $1, "gameOver" = $2, "gamePlay" = $3 WHERE id = $4 RETURNING "gameWin", "gameOver", "gamePlay";`;
        // on envoie la requete en bdd avec la requete preparer et les valeurs passé en parametre
        const boardDetailUpdate = await db.query(sql, [boardDetail.gameWin, boardDetail.gameOver, boardDetail.gamePlay, boardDetail.detail_id]);
        // on stock un message de confirmation dans les données recus
        boardDetailUpdate.rows[0].message = 'Vos informations ont bien été modifiées.';
        // on renvoie les données
        return boardDetailUpdate.rows[0];
    },
    /**
     * On enregistre la partie avec l'id de l'user, de l'histoire et du personnage
     * @param - id de l'user
     * @param - id du personnage
     * @param - id de l'histoire
     */
    createParty: async (data) => {
        // on prépare la requete
        const sql = `INSERT INTO game.party ("user_id", "playable_id", "history_id") VALUES ($1, $2, $3);`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const newData = await db.query(sql, [data.user_id, data.playable_id, data.history_id]);
        // on ecrit un message de confirmation
        const message = 'Votre partie a bien été enregistrée.';
        // on renvoie le message
        return message;
    },
};

module.exports = boardDetail;