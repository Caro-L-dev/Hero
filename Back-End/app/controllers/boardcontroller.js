// On récupère le models gameDetails
const gameDetails = require('../models/game_details');

const boardController = {
    /**
     * Met a jour les stat de jeux d'un utilisateur
     * @param number - user_id récupérer dans la session
     * @param number - history_id passé en slug
     * @param number - character_id passé dans le body
     * @param number - detail_id récupérer dans la session
     * @param boolean - gameWin passé dans le body
     * @returns {object} 200 - Un message de confirmation de la modification des stats et le resultat de la session update
     */
    editStat: async (request, response) => {
        try {
            if (request.params.id === '1' || request.params.id === 1 || request.params.id === '2' || request.params.id === 2) {
            // on configure l'objet data a envoyer
            const data = {
                user_id: request.session.user.id,
                history_id: request.params.id,
                character_id: null,
                detail_id: request.session.user.detail_id,
                gameWin: 0,
                gameOver: 0,
                gamePlay: 1
            };
            // Si il manque le champs character_id on stock un message d'erreur
            if (request.body.character_id === undefined) {
                const message = `Ce personnage n'est pas encore renseigné, vos stats ne peuvent pas être mise à jour.`
                response.status(404).json({message: message, session: request.session.user});
            } else { // Sinon on stock le character envoyer dans le body dans data
                data.character_id = request.body.character_id;
            };
            // Si la partie est gagné
            if (request.body.gameWin === 'true' || request.body.gameWin === true) {
                // on change les valeur dans data en y ajoutant les valeur présente dans la session
                data.gameWin = 1 + request.session.user.gameWin
                data.gameOver = 0 + request.session.user.gameOver
            } else { // Sinon elle est perdu
                // on change les valeur dans data
                data.gameWin = 0 + request.session.user.gameWin
                data.gameOver = 1 + request.session.user.gameOver
            }
            // On met a jour le nombre de partie jouer
            data.gamePlay = data.gamePlay + request.session.user.gamePlay;
            // On met a jour les stat en bdd
            const statEdit = await gameDetails.editBoardDetailGame(data);
            // On sauvegarde la partie en bdd
            const createParty = await gameDetails.createParty(data);
            // On met a jour la session avec les nouvelles info 
            request.session.user.gameWin = statEdit.gameWin;
            request.session.user.gameOver = statEdit.gameOver;
            request.session.user.gamePlay = statEdit.gamePlay;
            // on renvoie le resultat de la session update et un message de confirmation
            response.status(200).json({message: createParty, session: request.session.user});
        } else {
            const message = `Votre partie n'a pas été enregistrée, l'histoire n'est pas encore disponible.`
            response.status(404).json({message: message, session: request.session.user});
        }
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
    /**
     * Récupère les détails de jeu d'un utilisateur
     * @param number - detail_id récupérer dans la session
     * @returns {object} 200 - Un objet avec les details des stats et la session
     */
    getOneBoard: async (request, response) => {
        try {
            // on récupère le detail_id de la session
            const idUser = request.session.user.detail_id;
            // on appel la methode findbyid avec l'id récupérer au dessus
            const oneUserBoard = await gameDetails.findById(idUser);
            // on renvoie le resultat obtenue de la bdd
            response.status(200).json({board: oneUserBoard, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
    /**
     * Modifie l'avatar et le displayName d'un utilisateur
     * @param number - detail_id récupérer dans la session
     * @param string - avatar passé dans le body
     * @param string - displayName passé dans le body
     * @returns {object} 200 - L'objet board contenant l'avatar et le displayName update et la session update
     */
    edit: async (request, response) => {
        try {
            // on récupère le detail_id de la session
            const idUser = request.session.user.detail_id;
            // on appel la methode findbyid avec l'id récupérer au dessus
            const oneUserBoard = await gameDetails.findById(idUser);
            // on configure l'objet data a envoyer
            const data = {
                id: idUser,
                avatar: null, //request.body.avatar
                displayName: null //request.body.displayName
            };
            // Si il manque le champs avatar, on stock se qu'il y a en bdd dans data
            if (!request.body.avatar || !request.body.displayName) {
                data.avatar = oneUserBoard.avatar
                data.displayName = oneUserBoard.displayName
            };
            // si le champ avatar est remplis, on le stock dans data
            if (request.body.avatar) {
                data.avatar = request.body.avatar
            };
            // si le champ displayName est remplis, on le stock dans data
            if (request.body.displayName) {
                data.displayName = request.body.displayName
            };

            // on envoie les data pour la requete en bdd
            const editBoardUser = await gameDetails.editBoardProfile(data); 
            // on met a jour la session 
            request.session.user.avatar = editBoardUser.avatar;
            request.session.user.displayName = editBoardUser.displayName;

            //boardUser.board nous permet de recup juste l'objet board(sans session)
            response.status(200).json({board: editBoardUser, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
};

module.exports = boardController;