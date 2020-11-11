const profile = require('../models/profile');
const user = require('../models/user');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

const profileController = {
    /**
     * Sert a récupérer les infos du compte
     * @returns {object} 200 - La session ou toute les infos son deja présente
     */
    getOne: (request, response) => {
        try {
            // Le profil est deja enregistrer dans la session pas besoin de requete a la bdd on renvoie la session 
            response.status(200).json({session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
    /**
     * Sert a modifié les infos du compte
     * @param number - id récupérer dans la session
     * @param string - userName passé dans le body
     * @param string - email passé dans le body
     * @param string - password passé dans le body
     * @param string - passwordConfirm passé dans le body
     * @returns {object} 200 - Un message de confirmation de la modification et la session mis a jour
     */
    edit: async (request, response) => { 
        try {
            // tableau d'erreur
            const messageTab = [];
            // tableau de confirm
            const messageTabConfirm = [];

            const data = { // je configure l'objet a envoyer en bdd
                id: request.session.user.id,
                userName: null,
                email: null,
                password: null
            };

            if (request.body.userName !== undefined) { // Si il y'a un userName dans la requete
                const checkUser = await user.findByUserName(request.body.userName); // On verifie si le userName existe en bdd
        
                if (checkUser !== undefined) { // Si il existe on stock un message d'erreur dans messageTab
                    const messageUserName = "Nom d'utilisateur déjà enregistré en base de donnée";
                    messageTab.push({messageUserName: messageUserName});
                } else { // Sinon on le stock le userName du body dans data
                    data.userName = request.body.userName;
                    const messageUserNameConfirm = "Votre nom d''utilisateur a bien été modifié.";
                    messageTabConfirm.push({messageUserNameConfirm: messageUserNameConfirm});
                };
            } else { // Sinon on stock le userName de la session dans data
                data.userName = request.session.user.userName;
            };

            if (request.body.email !== undefined) { // Si il y'a un email dans la requete
                // On verifie si le format d'email est valide
                if (!emailValidator.validate(request.body.email)) { // Si l'email n'est pas valide on stock un message d'erreur dans messageTab
                    const messageEmail = `Votre e-mail n\'est pas valide.`;
                    messageTab.push({messageEmail: messageEmail});
                } else { // Sinon on stock l'email du body dans data
                    data.email = request.body.email;
                    const messageEmailConfirm = 'L\'e-mail a bien été modifié.';
                    messageTabConfirm.push({messageEmailConfirm: messageEmailConfirm});
                };
            } else { // Sinon on stock l'email de la session dans data
                data.email = request.session.user.email;
            };

            if (request.body.password !== undefined && request.body.passwordConfirm !== undefined) { // Si il y a un password et sa confirmation dans la requete
                // On verifie si le mdp et sa confirmation correspondent
                if (request.body.password !== request.body.passwordConfirm) { // Si il ne correspondent pas on stock un message d'erreur dans messageTab 
                    const messagePassword = "La confirmation du mot de passe ne correspond pas.";
                    messageTab.push({messagePassword: messagePassword});
                } else { // Sinon on crypt le password et on le stock dans data
                    const salt = await bcrypt.genSalt(10);
                    const encryptedPassword = await bcrypt.hash(request.body.password, salt);
                    data.password = encryptedPassword;
                    const messagePasswordConfirm = 'Le mot de passe a bien été modifié.';
                    messageTabConfirm.push({messagePasswordConfirm: messagePasswordConfirm});
                };
            } else if (request.body.password && request.body.passwordConfirm === undefined) { // Si un des 2 password demander manque => message d'erreur
                const messagePassword = "Veuillez remplir les deux champs de votre mot de passe.";
                messageTab.push({messagePassword: messagePassword});
            } else if (request.body.password === undefined && request.body.passwordConfirm) { // Si un des 2 password demander manque => message d'erreur
                const messagePassword = "Veuillez remplir les deux champs de votre mot de passe.";
                messageTab.push({messagePassword: messagePassword});
            } else { // Si aucun password renseigner on recupère le password en bdd pour le ranger dans data
                const userBdd = await user.findById(request.session.user.id);
                data.password = userBdd.password;
            };

            if (messageTab.length > 0) { // Si notre tableau de message est supérieur à 0 on le retourne
                return response.status(404).json({message: messageTab, session: request.session.user});
            };
            // Lancement de la requete pour update les infos
            const userEdit = await profile.editProfile(data);
            // Une fois les infos mis a jour en bdd il faut les stocker dans la session pour qu'elle soit a jour 
            request.session.user = {
                connected_user: true,
                id: userEdit.id,
                userName: userEdit.userName,
                email: userEdit.email,
                detail_id: userEdit.detail_id,
                avatar: request.session.user.avatar,
                displayName: request.session.user.displayName,
                gameWin: request.session.user.gameWin,
                gameOver: request.session.user.gameOver,
                gamePlay: request.session.user.gamePlay
            }
            // ON renvoie le message de la bdd et la session mis a jour
            response.status(200).json({message: messageTabConfirm, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
    /**
     * Sert a supprimé un compte avec ses stats et toute les party jouer
     * @param number - id récupérer dans la session
     * @param string - detail_id récupérer dans la session
     * @returns {object} 200 - Un message de confirmation de la suppression et la session mis a jour sur { connected_user: false }
     */
    delete: async (request, response) => {
        try {
            // Requete pour supprimer un utilisateur et ses details de jeux
            const userDelete = await profile.deleteProfile(request.session.user);
            // On repasse la session a deconnecter
            request.session.user = {connected_user: false};
            // On renvoie tous ca 
            response.status(200).json({message: userDelete, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
};

module.exports = profileController;