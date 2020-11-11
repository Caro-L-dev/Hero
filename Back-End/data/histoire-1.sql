BEGIN;

INSERT INTO game.character (
    "name", 
    "playable",
    "hp",
    "atk",
    "def"
    )
    VALUES  ('Warrior', 'true', '20', '7', '10'),
            ('Ranger', 'true', '15', '10', '5'),
            ('Vieillard', 'false', '20', '3', '2');

INSERT INTO game.type ( 
    "name"
    )
    VALUES  ('Début'),
            ('Cliquable'),
            ('Choix'),
            ('Combat'),
            ('Fin');

INSERT INTO game.history ( 
    "name",
    "description",
    "difficulty"
    )
    VALUES  ('Prison', 'Evadez-vous', 'easy');

INSERT INTO game.scene ( 
    "name",
    "description"
    )
    VALUES ('alcatraz', 'scene de depart'),
           ('door_and_opponent', 'scene clickable: cellule'),
           ('click_on_opponent', 'scene de choix: discution combat'),
           ('combat', 'scene de combat'),
           ('speak', 'scene de discution'),
           ('click_on_door', 'scene de choix: partir rester'),
           ('raft', 'scene clickable: bord de mer'),
           ('click_on_raft', 'scene de choix: partir'),
           ('game_over', 'scene de fin: gameover'),
           ('game_neutral', 'scene de fin: sortir maudit sans avoir tuer le Vieillard'),
           ('game_win', 'scene de fin: sortir en ayant tuer le Vieillard');

INSERT INTO game.categories ( 
    "name"
    )
    VALUES  ('horror'),
            ('fantastic');

INSERT INTO game.text_in_game ( 
    "description"
    )
    VALUES ('Vous vous réveillez en prison mais vous ne savez comment vous êtes arrivé là... La porte ne semble pas verrouillée pour autant et un vieillard gît dans un coin sombre.'),
    ('Hum... Cela fait si longtemps... Je n''ai vu que des rats depuis des années... Rien d''autre de vivant... Tuez-moi pour mettre fin à cette malédiction'),
    ('Tuez-moi ou vous serez maudit à jamais en partant d''ici !'),
    ('Vous voyez au loin une une sortie vers l''extérieur. Quelle aubaine ! Vous pourriez vous enfuir sans aucun soucis, Philosophie.'),
    ('Vous montez sur la barque mais la mer l''emporte immédiatement ! Vous ne savez pas comment revenir en arrière et ça ne vous dérange pas plus que ça... LIBRE !');

INSERT INTO game.clickable_element ( 
    "name",
    "shape",
    "coords"
    )
    VALUES  ('porte', 'rect', '0,0,500,500'),
            ('vieillard', 'rect', '500,0,1000,500'),
            ('barque', 'rect', '0,0,1000,1000');

COMMIT;

BEGIN;

UPDATE game.scene SET "type_id" = 1, "opponent_id" = null WHERE "id" = 1;
UPDATE game.scene SET "type_id" = 2, "opponent_id" = null WHERE "id" = 2;
UPDATE game.scene SET "type_id" = 3, "opponent_id" = null WHERE "id" = 3;
UPDATE game.scene SET "type_id" = 4, "opponent_id" = 3 WHERE "id" = 4;
UPDATE game.scene SET "type_id" = 3, "opponent_id" = null WHERE "id" = 5;
UPDATE game.scene SET "type_id" = 3, "opponent_id" = null WHERE "id" = 6;
UPDATE game.scene SET "type_id" = 2, "opponent_id" = null WHERE "id" = 7;
UPDATE game.scene SET "type_id" = 3, "opponent_id" = null WHERE "id" = 8;
UPDATE game.scene SET "type_id" = 5, "opponent_id" = null WHERE "id" = 9;
UPDATE game.scene SET "type_id" = 5, "opponent_id" = null WHERE "id" = 10;
UPDATE game.scene SET "type_id" = 5, "opponent_id" = null WHERE "id" = 11;

INSERT INTO game.history_has_scene ( 
    "history_id",
    "scene_id",
    "previous_scene_id",
    "next_scene_id"
    )
    VALUES  (1, 1, null, 2),
            (1, 2, 1, 3),
            (1, 2, 1, 6),
            (1, 3, 2, 4),
            (1, 3, 2, 5),
            (1, 4, 3, 2),
            (1, 4, 3, 9),
            (1, 5, 3, 2),
            (1, 6, 2, 7),
            (1, 6, 2, 2),
            (1, 7, 6, 8),
            (1, 8, 7, 10),
            (1, 8, 7, 11),
            (1, 9, 4, null),
            (1, 10, 8, null),
            (1, 11, 8, null);

           

INSERT INTO game.history_has_categories ( 
    "history_id",
    "categories_id"
    )
    VALUES  (1, 1),
            (1, 2);

INSERT INTO game.scene_has_text ( 
    "scene_id",
    "text_in_game_id"
    )
    VALUES  (1, 1),
            (3, 2),
            (5, 3),
            (6, 4),
            (8, 5);

INSERT INTO game.scene_has_clickable_element ( 
    "scene_id",
    "clickable_element_id"
    )
    VALUES  (2, 1),
            (2, 2),
            (7, 3);

COMMIT;

BEGIN;

CREATE VIEW scene_text AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name,
        scene.description AS scene_description,
        "type"."name" AS scene_type,
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id;

CREATE VIEW scene_opponent AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type,
        "character"."name" AS opponent_name,
        "character"."hp" AS opponent_hp,
        "character"."atk" AS opponent_atk,
        "character"."def" AS opponent_def
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.character ON "character"."id" = scene.opponent_id;

CREATE VIEW scene_clickable_element AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type, 
        clickable_element.name AS clickable_element_name,
        clickable_element.shape AS clickable_element_shape,
        clickable_element.coords  AS clickable_element_coords
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_clickable_element ON scene_has_clickable_element.scene_id = scene.id
JOIN game.clickable_element ON clickable_element.id = scene_has_clickable_element.clickable_element_id;

CREATE VIEW scene_finish AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id;

COMMIT;