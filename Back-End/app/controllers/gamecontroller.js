// On récupère le models game
const game = require('../models/game');

const gameController = {
    /**
     * Sert a récupérer tout les personnages jouable
     * @returns {object} 200 - La liste des personnages jouable et la session
     */
    getAllCharacterPlayable: async (request, response) => {
        try {
            // on recupère tout les personnable jouable
            const allCharacter = await game.findAllCharacterPlayable();

            response.status(200).json({character: allCharacter, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());  
        };
    },
    /**
     * Sert a récupérer tout les personnages d'avatar
     * @returns {object} 200 - La liste des personnages pour la selection d'avatar et la session
     */
    getAllCharacter: async (request, response) => {
        try {
            // on recupère tout les personnable pour les avatars
            const allCharacter = await game.findAllCharacterAvatar();

            response.status(200).json({character: allCharacter, session: request.session.user});
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());  
        };
    },
    /**
     * Sert a récupérer une histoire et toute ses scène (Pour le moment seulement l'histoire 1)
     * @param number - id de l'histoire passé en slug
     * @returns {object} 200 - L'histoire complète et la session
     */
    getHistory: async (request, response) => {
        try {
            // Si le slug correspond a l'histoire 1
            if (request.params.id === '1' || request.params.id === 1) {
                // on attend le retour de la methode qui recupère une histoire par son id
                const oneHistory = await game.findHistoryById(request.params.id);
    
                const sceneTab = [];
    
                for (let index = 1; index <= 11; index++) {
                    if (index === 1 || index === 3 || index === 5 || index === 6 || index === 8) {
                        const oneScene = await game.findSceneTextById(index);
                        sceneTab.push(oneScene);
                    };
                    if (index === 4) {
                        const oneScene = await game.findSceneOpponnentById(index);
                        sceneTab.push(oneScene);
                    };
                    if (index === 2 || index === 7) {
                        const oneScene = await game.findSceneClickableElementById(index);
                        if (index === 2) {
                            const data = {
                                scene_id: oneScene[0].scene_id,
                                scene_name: oneScene[0].scene_name,
                                scene_description: oneScene[0].scene_description,
                                scene_opponent_id: oneScene[0].scene_opponent_id,
                                scene_type: oneScene[0].scene_type,
                                clickable_element: {
                                    clickable_element_name: oneScene[0].clickable_element_name,
                                    clickable_element_shape: oneScene[0].clickable_element_shape,
                                    clickable_element_coords: oneScene[0].clickable_element_coords
                                },
                                clickable_element2: {
                                    clickable_element_name: oneScene[1].clickable_element_name,
                                    clickable_element_shape: oneScene[1].clickable_element_shape,
                                    clickable_element_coords: oneScene[1].clickable_element_coords
                                }
                            };
                            sceneTab.push(data);
                        } else {
                            sceneTab.push(oneScene[0]);
                        };
                    };
                    if (index === 9 || index === 10 || index === 11) {
                        const oneScene = await game.findSceneFinishById(index);
                        sceneTab.push(oneScene);
                    };
                };
                
                const history = { // je configure l'objet de l'histoire
                    history_id: oneHistory[0].history_id,
                    history_name: oneHistory[0].history_name,
                    history_description: oneHistory[0].history_description,
                    history_difficulty: oneHistory[0].history_difficulty,
                    playable_character_id: [1,2],
                    scene_list: [
                        { // Scene 1
                            details_scene: sceneTab[0],
                            previous_scene_id: oneHistory[0].previous_scene_id,
                            next_scene_id: oneHistory[0].next_scene_id,
                            next_scene_name: 'Démarrer',
                            img_scene: 'https://i.ibb.co/9tjk959/Alcatraz-01.png'
                        },
                        { // Scene 2
                            details_scene: sceneTab[1],
                            previous_scene_id: oneHistory[1].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[1].next_scene_id,
                                next_scene_name: 'Vieillard',
                                img_element: sceneTab[3].opponent_img
                            },
                            next_scene2: {
                                next_scene_id2: oneHistory[2].next_scene_id,
                                next_scene_name2: 'Porte',
                                img_element: 'https://i.ibb.co/74FSjBh/cellule-porte-solo-02.png'
                            },
                            img_scene: 'https://i.ibb.co/7zMgn0v/cellule-01.png',
                        },
                        { // Scene 3
                            details_scene: sceneTab[2],
                            previous_scene_id: oneHistory[3].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[3].next_scene_id,
                                next_scene_name: 'Faire la bagarre'
                            },
                            next_scene2: {
                                next_scene_id2: oneHistory[4].next_scene_id,
                                next_scene_name2: 'Un brin de causette'
                            },
                            img_scene: 'https://i.ibb.co/7zMgn0v/cellule-01.png',
                            img_opponent: sceneTab[3].opponent_img
                        },
                        { // Scene 4
                            details_scene: sceneTab[3],
                            previous_scene_id: oneHistory[5].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[5].next_scene_id,
                                next_scene_name: 'Suite'
                            },
                            next_scene2: {
                                next_scene_id2: oneHistory[6].next_scene_id,
                                next_scene_name2: 'GameOver'
                            },
                            img_scene: 'https://i.ibb.co/7zMgn0v/cellule-01.png',
                            img_opponent: sceneTab[3].opponent_img
                        },
                        { // Scene 5
                            details_scene: sceneTab[4],
                            previous_scene_id: oneHistory[7].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[7].next_scene_id,
                                next_scene_name: 'Suite'
                            },
                            img_scene: 'https://i.ibb.co/7zMgn0v/cellule-01.png',
                            img_opponent: sceneTab[3].opponent_img
                        },
                        { // Scene 6
                            details_scene: sceneTab[5],
                            previous_scene_id: oneHistory[8].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[8].next_scene_id,
                                next_scene_name: 'Débarrasser le plancher'
                            },
                            next_scene2: {
                                next_scene_id2: oneHistory[9].next_scene_id,
                                next_scene_name2: `Rester ici`
                            },
                            img_scene: 'https://i.ibb.co/7zMgn0v/cellule-01.png'
                        },
                        { // Scene 7
                            details_scene: sceneTab[6],
                            previous_scene_id: oneHistory[10].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[10].next_scene_id,
                                next_scene_name: 'Barque',
                                img_element: 'https://i.ibb.co/0C3BP6F/Bord-de-mer-barque-solo-02.png'
                            },
                            img_scene: 'https://i.ibb.co/hYz5yrG/Bord-de-mer-barque-01.png'
                        },
                        { // Scene 8
                            details_scene: sceneTab[7],
                            previous_scene_id: oneHistory[11].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[11].next_scene_id,
                                next_scene_name: 'Si le vieillard est en vie'
                            },
                            next_scene2: {
                                next_scene_id2: oneHistory[12].next_scene_id,
                                next_scene_name2: `Si le veillard est mort`
                            },
                            finish_text: `Suite`,
                            img_scene: 'https://i.ibb.co/hYz5yrG/Bord-de-mer-barque-01.png'
                        },
                        { // Scene 9
                            details_scene: sceneTab[8],
                            previous_scene_id: oneHistory[13].previous_scene_id,
                            finish_text: `Game Over, vous êtes mort !`,
                            img_scene: 'https://i.ibb.co/vJT3LjN/Fin-03.png'
                        },
                        { // Scene 10
                            details_scene: sceneTab[9],
                            previous_scene_id: oneHistory[14].previous_scene_id,
                            finish_text: `Bravo, vous avez terminé le jeu mais vous êtes maudit !`,
                            img_scene: 'https://i.ibb.co/VWy0dxL/Fin-en-etant-maudit-01.png'
                        },
                        { // Scene 11
                            details_scene: sceneTab[10],
                            previous_scene_id: oneHistory[15].previous_scene_id,
                            finish_text: `Bravo, vous avez terminé le jeu en ayant levé la malédiction !`,
                            img_scene: 'https://i.ibb.co/L9gs2Yd/Fin-sans-etre-maudit-01.png'
                        },
                    ]
                };
    
                response.status(200).json({history: history, session: request.session.user});
                // Si le slug correspond a l'histoire 2
            } else if (request.params.id === '2' || request.params.id === 2) {
                // on attend le retour de la methode qui recupère une histoire par son id
                const oneHistory = await game.findHistoryById(request.params.id);
    
                const sceneTab = [];
    
                for (let index = 12; index <= 17; index++) {
                    if (index === 12) {
                        const oneScene = await game.findSceneTextById(index);
                        sceneTab.push(oneScene);
                    };
                    if (index === 13 || index === 14 || index === 15) {
                        const oneScene = await game.findSceneOpponnentById(index);
                        sceneTab.push(oneScene);
                    };
                    if (index === 16 || index === 17) {
                        const oneScene = await game.findSceneFinishById(index);
                        sceneTab.push(oneScene);
                    };
                };
                
                const history2 = { // je configure l'objet de l'histoire
                    history_id: oneHistory[0].history_id,
                    history_name: oneHistory[0].history_name,
                    history_description: oneHistory[0].history_description,
                    history_difficulty: oneHistory[0].history_difficulty,
                    playable_character_id: [4,5,6],
                    scene_list: [
                        { // Scene 12
                            details_scene: sceneTab[0],
                            previous_scene_id: oneHistory[0].previous_scene_id,
                            next_scene_id: oneHistory[0].next_scene_id,
                            next_scene_name: 'Démarrer',
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                        { // Scene 13
                            details_scene: sceneTab[1],
                            previous_scene_id: oneHistory[1].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[1].next_scene_id,
                                next_scene_name: 'Suite'
                            },
                            next_scene2: {
                                next_scene_id2: 16,
                                next_scene_name2: 'GameOver'
                            },
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                        { // Scene 14
                            details_scene: sceneTab[2],
                            previous_scene_id: oneHistory[2].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[2].next_scene_id,
                                next_scene_name: 'Suite'
                            },
                            next_scene2: {
                                next_scene_id2: 16,
                                next_scene_name2: 'GameOver'
                            },
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                        { // Scene 15
                            details_scene: sceneTab[3],
                            previous_scene_id: oneHistory[3].previous_scene_id,
                            next_scene: {
                                next_scene_id: oneHistory[3].next_scene_id,
                                next_scene_name: 'Suite'
                            },
                            next_scene2: {
                                next_scene_id2: 16,
                                next_scene_name2: 'GameOver'
                            },
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                        { // Scene 16
                            details_scene: sceneTab[4],
                            previous_scene_id: [15, 14, 13],
                            finish_text: `Game Over, vous êtes mort !`,
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                        { // Scene 17
                            details_scene: sceneTab[5],
                            previous_scene_id: oneHistory[5].previous_scene_id,
                            finish_text: `Bravo, vous êtes le grand maitre de l'arène !`,
                            img_scene: 'https://i.ibb.co/MgZtkPg/Arene-grand-Format-01.png'
                        },
                    ]
                };
                
                response.status(200).json({history: history2, session: request.session.user});
            } else {
                const message = `L'histoire demandée n'est pas disponible.`
                response.status(404).json({message: message, session: request.session.user});
            }
        } catch (error) {
            console.trace(error);
            return response.status(500).json(error.tostring());
        };
    },
};

module.exports = gameController;