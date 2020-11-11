const mainController = {
    /**
     * Une méthode de test
     * @group test - Route qui ne sert a rien, sauf a tester
     * @returns {string} 200 - Un message de bienvenue
     */
    sayHi: (request, response) => {
        response.send('Hello !');
    },
};

module.exports = mainController;