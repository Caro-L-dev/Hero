// On récupère la connexion a la base de données
const db = require('../database');

const game = { 
    /**
     * On récupère tout les personnages jouables
     */
    findAllCharacterAvatar: async () => {
        const sql = `SELECT character.id,
                            character.name,
                            character.image
                    FROM game.character;`;
        const data = await db.query(sql);
        return data.rows;
    },
    /**
     * On récupère tout les personnages jouables
     */
    findAllCharacterPlayable: async () => {
        const sql = `SELECT * FROM game.character WHERE character.playable = $1;`;
        const data = await db.query(sql, [true]);
        return data.rows;
    },
    /**
     * On récupère une histoire par son id
     * @param - id de l'histoire
     */
    findHistoryById: async (id) => {
        // on prépare la requete
        const sql = `SELECT history.id AS history_id,
                            history.name AS history_name,
                            history.description AS history_description,
                            history.difficulty AS history_difficulty,
                            history_has_scene.scene_id,
                            history_has_scene.previous_scene_id,
                            history_has_scene.next_scene_id
                    FROM game.history
                    JOIN game.history_has_scene ON history_has_scene.history_id = history.id
                    WHERE history.id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows;
    },
    /**
     * On récupère une scene de text par son id
     * @param - id de la scene
     */
    findSceneTextById: async (id) => {
        // on prépare la requete
        const sql = `SELECT * FROM scene_text WHERE scene_id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows[0];
    },
    /**
     * On récupère une scene avec un opponent par son id
     * @param - id de la scene
     */
    findSceneOpponnentById: async (id) => {
        // on prépare la requete
        const sql = `SELECT * FROM scene_opponent WHERE scene_id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows[0];
    },
    /**
     * On récupère une scene d'element cliquable par son id
     * @param - id de la scene
     */
    findSceneClickableElementById: async (id) => {
        // on prépare la requete
        const sql = `SELECT * FROM scene_clickable_element WHERE scene_id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows;
    },
    /**
     * On récupère une scene de fin par son id
     * @param - id de la scene
     */
    findSceneFinishById: async (id) => {
        // on prépare la requete
        const sql = `SELECT * FROM scene_finish WHERE scene_id = $1;`;
        // on envoie la requete en bdd avec la requete preparer et l'id passé en parametre
        const data = await db.query(sql, [id]);
        // on renvoie les data de la requete
        return data.rows[0];
    },
    
};

module.exports = game;