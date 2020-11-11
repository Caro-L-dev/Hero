const user = require('../models/user');
const gameDetails = require('../models/game_details');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const connexionController = {
    /**
     * Sert a se connecté avec un utilisateur présent en base de donnée
     * @param string - userName passé dans le body
     * @param string - password passé dans le body
     * @returns {object} 200 - Un message de confirmation et la session qui correspond au userName
     */
    login: async (request, response) => {
    try {
        // tableau d'erreur
        const messageTab = [];

        // on check si username rentré par l'user est égale à un User déjà dans la BDD
        const checkUser = await user.findByUserName(request.body.userName);

        if (request.body.userName && request.body.password) { // Si les 2 elements du form son present on effectue la suite
            if (checkUser !== undefined) { // Si l'utilisateur est trouver en bdd 
                // On compare le mdp reçu en front & celui déjà en BDD ( si true : c'est good)
                const compare = await bcrypt.compare(request.body.password, checkUser.password);
                // Si la comparaison n'est pas bonne on stock un message d'erreur 
                if (compare === false) {
                    const messagePassword = `Votre mot de passe ou votre nom d'utilisateur n'est pas valide.`;
                    messageTab.push({ messagePassword: messagePassword });
                };
            } else { // Sinon on stock un message d'erreur
                const messageUserName = `Votre mot de passe ou votre nom d'utilisateur n'est pas valide.`;
                messageTab.push({ messageUserName: messageUserName });
            };
        } else { // Sinon on stock un message d'erreur
            const messageUserName = 'Veuillez remplir tous les champs.';
            messageTab.push({ messageUserName: messageUserName });
        };

        if (messageTab.length > 0) { // Si notre tableau de message est supérieur à 0 on le renvoie
            return response.status(404).json({message: messageTab, session: request.session.user});
            //return response.json(messageTab);
        };
        // on appel la methode findbyid de gameDetails avec le detail_id récupérer au dessus
        const userBoard = await gameDetails.findById(checkUser.detail_id);
        // on ajoute les informations de l'utilisateur a la session
        request.session.user = {
            connected_user: true,
            id: checkUser.id,
            userName: checkUser.userName,
            email: checkUser.email,
            detail_id: userBoard.id,
            avatar: userBoard.avatar,
            displayName: userBoard.displayName,
            gameWin: userBoard.gameWin,
            gameOver: userBoard.gameOver,
            gamePlay: userBoard.gamePlay
        };

        const messageConnexion = 'Vous êtes maintenant connecté.';
        // on renvoie la session et le message de confirmation
        response.status(200).json({message: messageConnexion, session: request.session.user});
    } catch (error) {
        console.trace(error);
        return response.status(500).json(error.tostring());
    };
    },
    /**
     * Sert a vérifier si un utilisateur est connecté ou non
     * @param boolean - connected_user récupérer dans la session
     * @returns {object} 200 - Un message de confirmation et la session
     */
    loginCheck: (request, response) => {
    try {
        // tableau d'erreur
        const messageTab = [];
        // si l'utilisateur n'est pas connecter on renvoie un message 
        if (request.session.user.connected_user === false) {

            const messageCheckConnexion = 'Aucun utilisateur n\'est connecté.';
            messageTab.push({messageCheckConnexion: messageCheckConnexion});
            return response.status(404).json({message: messageTab, session: request.session.user});
        };
        // si l'utilisateur est connecter on renvoie un message de confirmation
        if (request.session.user.connected_user === true){
            const messageCheckConnexion = 'Vous êtes maintenant connecté.';
            messageTab.push({messageCheckConnexion: messageCheckConnexion});
            return response.status(200).json({message: messageTab, session: request.session.user});
        };
    } catch (error) {
        console.trace(error);
        return response.status(500).json(error.tostring());
    };
    },
    /**
     * Sert a se créé un compte un base de donnée
     * @param string - userName passé dans le body
     * @param string - email passé dans le body
     * @param string - password passé dans le body
     * @param string - passwordConfirm passé dans le body
     * @returns {object} 200 - Un message de confirmation de la création du compte et la session
     */
    signup: async (request, response) => {
    try {
        // tableau d'erreur
        const messageTab = [];
        // Si toute les données son renseigner, on execute le code suivant
        if (request.body.userName && request.body.email && request.body.password && request.body.passwordConfirm) {
            const checkUser = await user.findByUserName(request.body.userName);

            if (checkUser !== undefined) { // - 1: On verifie si L'utilisateur existe en bdd
                const messageUserName = "Votre nom d'utilisateur existe déjà.";
                messageTab.push({ messageUserName: messageUserName });
            };

            if (!emailValidator.validate(request.body.email)) { // - 2: On verifie si le format d'email est valide
                const messageEmail = `Votre email n\'est pas valide.`;
                messageTab.push({ messageEmail: messageEmail });
            };

            if (request.body.password !== request.body.passwordConfirm) { // - 3: On verifie si le mdp et sa confirmation correspondent
                const messagePassword = "Vos mot de passe ne correspondent pas.";
                messageTab.push({ messagePassword: messagePassword });
            };

            if (messageTab.length > 0) { // on check si notre tableau de message est supérieur à 0
                return response.status(404).json({message: messageTab, session: request.session.user});
            };

            const salt = await bcrypt.genSalt(10); // 4 - On crypt le password
            const encryptedPassword = await bcrypt.hash(request.body.password, salt);

            const newUser = { // 5 - on stock dans notre const newUser les informations reçus du front 
                userName: request.body.userName,
                email: request.body.email,
                password: encryptedPassword,
            };

            const save = await user.createUser(newUser); // 6 - on passe les informations en paramêtre de la fonction createUser
            
            response.status(200).json({userSave: save, session: request.session.user}); // 7 - on renvoi le RETURNING de la requete SQL , soit ici ( cf models user ) id & userName

        } else if (!request.body.userName || !request.body.email || !request.body.password || !request.body.passwordConfirm) {
            // Si une des 4 valeur n'est pas renseigner on renvoie un message d'erreur
            const message = "Veuillez remplir tous les champs.";
            messageTab.push({message: message});
            response.status(404).json({message: messageTab, session: request.session.user});
        };
    } catch (error) {
        console.trace(error);
        return response.status(500).json(error.tostring());
    };
    },
    /**
     * Sert a se déconnecté
     * @param boolean - connected_user récupérer dans la session
     * @returns {object} 200 - Un message de confirmation et la session {connected_user: false}
     */
    logout: (request, response) => {
        try {
            // tableau d'erreur
            const messageTab = [];
            // si l'utilisateur n'est pas connecter on renvoie la session a false avec un message
            if (request.session.user.connected_user === false) {
                const messageLogout = 'Aucun utilisateur n\'est connecté.';
                messageTab.push({messageLogout: messageLogout});
                return response.status(404).json({message: messageTab, session: request.session.user});
            };
            // si l'utilisateur est connecter on lui renvoie sa session avec un message de confirmation
            if (request.session.user.connected_user === true){
                request.session.user = {connected_user: false};
                const messageLogout = 'Vous avez été déconnecté de votre compte.';
                messageTab.push({messageLogout: messageLogout});
                return response.status(200).json({message: messageTab, session: request.session.user});
            };
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
};

module.exports = connexionController;