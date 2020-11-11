// On récupère le models history
const history = require('../models/history');

const storieController = {
    /**
     * Méthode pour récupérer toute les histoires
     * @returns {object} 200 - Une liste d'histoire et la session
     */
    getAll: async (request, response) => {
        try {
            // on attend le retour de la methode qui recupère toute les histoires
            const historyList = await history.findAll();
            // on parcours la liste d'histoire
            for (let oneHistory of historyList) {
                // Pour chaque histoire on recupère ses categories
                const categoriesForHistory = await history.categoriesByHistoryId(oneHistory.id);
                // on instancie un tableau vide
                const cat = [];
                // Pour chaque element de la liste des categories
                for (let element of categoriesForHistory) {
                    // On stock chaque element dans le tableau vide
                    cat.push(element);
                }
                // Une fois tout les element parcourue et stocker dans le tableau on le passe dans l'objet Onehistoire 
                // une fois le tableau de categories copier dans one histoiry, l'historyList est a jour 
                oneHistory.categories = cat;
            };
            // on renvoie les histoires et la session 
            return response.status(200).json({historylist: historyList, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
    /**
     * Méthode pour récupérer une histoire par son id
     * @param number - Id passé en slug
     * @returns {object} 200 - Une histoire par son id et la session
     */
    getById: async (request, response) => {
        try {
            // on attend le retour de la methode qui recupère une histoire par son id
            const oneHistory = await history.findById(request.params.id);
            // si un utilisateur est connecter, on renvoie l'histoire et la session 
            if (request.session.user) {
                return response.status(200).json({history: oneHistory, session: request.session.user});
            }
            // Sinon on renvoie que l'histoire
            response.status(200).json({history: oneHistory});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
};

module.exports = storieController;