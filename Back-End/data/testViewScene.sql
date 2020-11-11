------- recupération d'histoire
SELECT history.id AS history_id,
        history.name AS history_name,
        history.description AS history_description,
        history.difficulty AS history_difficulty,
        history_has_scene.scene_id,
        history_has_scene.previous_scene_id,
        history_has_scene.next_scene_id
FROM game.history
JOIN game.history_has_scene ON history_has_scene.history_id = history.id;

------- scene_1 -- scene de départ ok  scene_text
SELECT  scene.id AS scene_id,
        scene.name AS scene_name,
        scene.description AS scene_description,
        "type"."name" AS "scene_type",
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id
WHERE scene.id = 1;

------- scene_2 -- scene clickable (vieillard ou cellule) ok  scene_clickable_element
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS "type_name", 
        clickable_element.contact_information 
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_clickable_element ON scene_has_clickable_element.scene_id = scene.id
JOIN game.clickable_element ON clickable_element.id = scene_has_clickable_element.clickable_element_id
WHERE scene.id = 2;

------- scene_3 -- Si click sur vieillard => scene de choix (attaquer ou discuter) ok   scene_text
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type,
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id
WHERE scene.id = 3;

------- scene_4 -- Si click sur combat => scene de combat => retour sur scene 2 ok  scene_opponent
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
JOIN game.character ON "character"."id" = scene.opponent_id
WHERE scene.id = 4;

------- scene_5 -- Si click sur discution => scene de discution => retour sur scene 2  scene_text
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type,
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id
WHERE scene.id = 5;

------- scene_6 -- Si click sur cellule => scene de choix (sortir => bord de mer ou rester => cellule)  scene_text
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type, 
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id
WHERE scene.id = 6;

------- scene_7 -- Si click sur sortir => scene clickable (barque)  scene_clickable_element
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type, 
        clickable_element.contact_information 
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_clickable_element ON scene_has_clickable_element.scene_id = scene.id
JOIN game.clickable_element ON clickable_element.id = scene_has_clickable_element.clickable_element_id
WHERE scene.id = 7;

------- scene_8 -- Si click sur barque => scene de choix (partir = scene de fin)  scene_text
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type,
        text_in_game.description AS scene_text
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_text ON scene_has_text.scene_id = scene.id
JOIN game.text_in_game ON text_in_game.id = scene_has_text.text_in_game_id
WHERE scene.id = 8;

------- scene_9 -- scene de fin si gameover  scene_finish
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
WHERE scene.id = 9;

------- scene_10 -- scene de fin si sortie et vieillard en vie  scene_finish
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
WHERE scene.id = 10;

------- scene_11 -- scene de fin si sortie et vieillard mort  scene_finish
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
WHERE scene.id = 11;


--------------------------------------------------------------------------
-- 4 genre de scene sont identifier:
-------------scene_text
-------------scene_opponent
-------------scene_clickable_element
-------------scene_finish

--------------------------------------------------------------------------
-------------scene_text -- id => 1,3,5,6,8

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

--------------------------------------------------------------------------
-------------scene_opponent -- id => 4

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

--------------------------------------------------------------------------
-------------scene_clickable_element -- id => 2,7

CREATE VIEW scene_clickable_element AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type, 
        clickable_element.contact_information 
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id
JOIN game.scene_has_clickable_element ON scene_has_clickable_element.scene_id = scene.id
JOIN game.clickable_element ON clickable_element.id = scene_has_clickable_element.clickable_element_id;

--------------------------------------------------------------------------
-------------scene_finish -- id => 9,10,11

CREATE VIEW scene_finish AS
SELECT  scene.id AS scene_id,
        scene.name AS scene_name, 
        scene.description AS scene_description, 
        "type"."name" AS scene_type
FROM game.scene
JOIN game.type ON "type"."id" = scene.type_id;

--------------------------------------------------------------------------

SELECT  history.*,
        categories.name AS categories_name
FROM game.history
JOIN game.history_has_categories ON history_has_categories.history_id = history.id
JOIN game.categories ON history_has_categories.categories_id = categories.id
GROUP BY history.id;

SELECT  categories.name
FROM game.categories
JOIN game.history_has_categories ON history_has_categories.categories_id = categories.id
WHERE history_has_categories.history_id = 1;