// on recupère le router de express
const { Router } = require('express');

// on require tous les controllers
const mainController = require('./controllers/maincontroller');
const storieController = require('./controllers/storiecontroller');
const profileController = require('./controllers/profilcontroller');
const boardController = require('./controllers/boardcontroller');
const connexionController = require('./controllers/connexioncontroller');
const gameController = require('./controllers/gamecontroller');

// middleWare qui check si l'utilisateur est connecter pour donner l'accès a certaine page
const checkConnexion = require('./middlewares/checkConnexion');

const router = Router();

/**
 * Une route de test
 * @route GET /sayHi
 * @group test - Route qui ne sert a rien, sauf a tester
 * @returns {string} 200 - Un message de bienvenue
 */
router.get('/sayHi', mainController.sayHi);

/* ---------- Route accécible sans connexion ---------- */

/* ---------- Route histoire ---------- */
/**
 * Récupère toutes les histoires
 * @route GET /stories
 * @group stories - Route qui sert a récupérer les histoires
 * @returns {object} 200 - La liste des histoires et la session
 */
router.get('/stories', storieController.getAll);
/**
 * Récupère une histoire
 * @route GET /stories/:id(\\d+)
 * @group stories - Route qui sert a récupérer les histoires 
 * @returns {object} 200 - Une histoire par son id et la session
 */
router.get('/stories/:id(\\d+)', storieController.getById);

/* ---------- Route connexion ---------- */
/**
 * Créé un compte
 * @route POST /sign-up
 * @group connexion - Route en lien avec la connexion 
 * @returns {object} 200 - Le user enregistré en BDD avec un message de confirmation et la session
 */
router.post('/sign-up', connexionController.signup);
/**
 * Ce connecter
 * @route POST /log-in
 * @group connexion - Route en lien avec la connexion 
 * @returns {object} 200 - Un message de confirmation de la connexion et la session
 */
router.post('/log-in', connexionController.login);
/**
 * Check de la connexion
 * @route POST /login-check
 * @group connexion - Route en lien avec la connexion 
 * @returns {object} 200 - Un message de confirmation si l'utilisateur est connecté ou non et la session
 */
router.post('/login-check', connexionController.loginCheck);
/**
 * Déconnexion de utilisateur
 * @route GET /login-check
 * @group connexion - Route en lien avec la connexion 
 * @returns {object} 200 - Un message de confirmation de la déconnexion et la session
 */
router.post('/log-out', connexionController.logout);

/* ---------- Route accécible seulement avec connexion ---------- */

/* ---------- Route profile ---------- */
/**
 * Récupérer les informations profil
 * @route GET /profile
 * @group profile - Route en lien avec les données utilisateur
 * @returns {object} 200 - Un message de confirmation, les données utilisateur et la session
 */
router.get('/profile', checkConnexion, profileController.getOne);
/**
 * Modifier les informations profil
 * @route PATCH /profile/edit
 * @group profile - Route en lien avec les données utilisateur
 * @returns {object} 200 - Un message de confirmation, les données utilisateur mis a jour et la session
 */
router.patch('/profile/edit', checkConnexion, profileController.edit);
/**
 * Supprimer son compte (ATTENTION)
 * @route DELETE /profile/delete
 * @group profile - Route en lien avec les données utilisateur
 * @returns {object} 200 - Un message de confirmation de la suppression et la session 
 */
router.delete('/profile/delete', checkConnexion, profileController.delete);

/* ---------- Route detail de jeu ---------- */
/**
 * Récupérer des informations profil de jeu
 * @route GET /board
 * @group board - Route en lien avec les données de jeu personnel
 * @returns {object} 200 - Un message de confirmation, les informations du profil de jeu et la session 
 */
router.get('/board', checkConnexion, boardController.getOneBoard);
/**
 * Récupérer tout les personnages pour la modification d'avatar
 * @route GET /board/characters
 * @group board - Route en lien avec les données de jeu personnel
 * @returns {object} 200 - Un message de confirmation, les differents personnages et la session 
 */
router.get('/board/characters', checkConnexion, gameController.getAllCharacter);
/**
 * Modifier des informations profil de jeu (Avatar et displayName)
 * @route PATCH /board/edit
 * @group board - Route en lien avec les données de jeu personnel
 * @returns {object} 200 - Un message de confirmation, les informations du profil de jeu mis a jour et la session 
 */
router.patch('/board/edit', checkConnexion, boardController.edit);

/* ---------- Route de jeu ---------- */
/**
 * Récupérer tout les personnages jouables
 * @route GET /characters
 * @group game - Route en lien avec le jeu
 * @returns {object} 200 - Un message de confirmation, les differents personnages jouable et la session 
 */
router.get('/characters', checkConnexion, gameController.getAllCharacterPlayable);
/**
 * Récupérer toute l'histoire 
 * @route GET /characters
 * @group game - Route en lien avec le jeu
 * @returns {object} 200 - Un message de confirmation, toute l'histoire et la session 
 */
router.get('/stories/:id(\\d+)/play', checkConnexion, gameController.getHistory);
/**
 * Mettre a jour les stats de jeu d'un user
 * @route POST /stories/:id(\\d+)/finish
 * @group game - Route en lien avec le jeu
 * @returns {object} 200 - Un message de confirmation, les stats de jeu mis a jour et la session 
 */
router.post('/stories/:id(\\d+)/finish', checkConnexion, boardController.editStat);

module.exports = router;