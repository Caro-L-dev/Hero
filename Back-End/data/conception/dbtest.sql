BEGIN;

CREATE SCHEMA nav AUTHORIZATION heros;
CREATE SCHEMA game AUTHORIZATION heros;

CREATE TABLE nav.game_details ( -- TABLE BOARD TABLEAU DES SCORES
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "avatar" text NOT NULL,
  "displayName" text NOT NULL,
  "gameWin" int,
  "gameOver" int,
  "gamePlay" int
);

CREATE TABLE nav.user ( -- NE PEUT ETRE CREE AVANT DETAILS_GAME_USER
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "userName" text NOT NULL UNIQUE,
  "email" text NOT NULL,
  "password" text NOT NULL, 
  "role" text DEFAULT 'user',
  "created_at" timestamptz DEFAULT NOW(),
  "updated_at" timestamptz DEFAULT NULL,
  "detail_id" int REFERENCES nav.game_details(id)
);

CREATE TABLE game.character ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "playable" boolean NOT NULL,
  "hp" float NOT NULL,
  "atk" float NOT NULL,
  "def" float NOT NULL
);

CREATE TABLE game.history ( -- NE PEUT ETRE CREE AVANT CHARACTER
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "description" text,
  "difficulty" text,
  "created_at" timestamptz DEFAULT NOW(),
  "updated_at" timestamptz DEFAULT NULL
);

CREATE TABLE game.type (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE
);

CREATE TABLE game.item ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "hp" float NOT NULL,
  "atk" float NOT NULL,
  "def" float NOT NULL
);

CREATE TABLE game.scene ( -- NE PEUT ETRE CREE AVANT CHARACTER ET TYPE
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "description" text,
  "type_id" int REFERENCES game.type(id),
  "opponent_id" int REFERENCES game.character(id),
  "item_id" int REFERENCES game.item(id)
);

CREATE TABLE game.categories ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE
);

CREATE TABLE game.text_in_game ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "description" text NOT NULL
);

CREATE TABLE game.clickable_element (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "contact_information" text
);

CREATE TABLE game.party ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "user_id" int REFERENCES nav.user(id),
  "playable_id" int REFERENCES game.character(id),
  "history_id" int REFERENCES game.history(id)
);

CREATE TABLE game.history_has_scene ( -- table de liaison, histoire(id), scéne(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "history_id" int REFERENCES game.history(id),
  "scene_id" int REFERENCES game.scene(id),
  "previous_scene_id" int REFERENCES game.scene(id),
  "next_scene_id" int REFERENCES game.scene(id)
);

CREATE TABLE game.history_has_categories ( -- table de liaison, histoire(id), categories(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "history_id" int REFERENCES game.history(id),
  "categories_id" int REFERENCES game.categories(id)
);

CREATE TABLE game.scene_has_text ( -- table de liaison, scene(id), text_in_game(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "scene_id" int REFERENCES game.scene(id),
  "text_in_game_id" int REFERENCES game.text_in_game(id)
);

CREATE TABLE game.scene_has_item ( -- table de liaison, scene(id), text_in_game(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "scene_id" int REFERENCES game.scene(id),
  "item_id" int REFERENCES game.item(id)
);

CREATE TABLE game.scene_has_clickable_element ( -- table de liaison, scene(id), clickable_element(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "scene_id" int REFERENCES game.scene(id),
  "clickable_element_id" int REFERENCES game.clickable_element(id)
);

CREATE TABLE game.character_has_item ( -- table de liaison, character(id), item(id)
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "character_id" int REFERENCES game.character(id),
  "item_id" int REFERENCES game.item(id)
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA nav TO heros;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA game TO heros;

COMMIT;

BEGIN;

INSERT INTO nav.user (
    "userName", 
    "email", 
    "password"
    ) 
    VALUES  ('Philippe', 'philippe@oclock.io', 'test'),
            ('Chuck', 'chuck@oclock.io', 'test');

INSERT INTO nav.game_details (
    "avatar", 
    "displayName", 
    "gameWin",
    "gameOver",
    "gamePlay"
    ) 
    VALUES  ('Warrior', 'warrior_test', '0', '3', '3'),
            ('Ranger', 'ranger_test', '1', '2', '3');

INSERT INTO game.character (
    "name", 
    "playable",
    "hp",
    "atk",
    "def"
    )
    VALUES  ('Warrior', 'true', '20', '5', '10'),
            ('Ranger', 'true', '15', '10', '5'),
            ('Mage', 'true', '10', '10', '15'),
            ('Lich', 'false', '30', '5', '7'),
            ('Goblin', 'false', '20', '3', '2');

INSERT INTO game.type ( 
    "name"
    )
    VALUES  ('Début'),
            ('Cliquable'),
            ('Choix'),
            ('Combat'),
            ('Discution'),
            ('Déplacement'),
            ('Fin');

INSERT INTO game.history ( 
    "name",
    "description",
    "difficulty"
    )
    VALUES ('Matrio et Luigri', 'Aide Matrio et Luigri a retrouver la princesse Pear', 'easy'),
            ('test-histoire', 'test-description', 'easy');

INSERT INTO game.scene ( 
    "name",
    "description"
    )
    VALUES ('test', 'scene de test'),
           ('test2', 'scene de test2');

INSERT INTO game.item (
    "name", 
    "hp",
    "atk",
    "def"
    )
    VALUES ('weapon', 0, 5, 0),
           ('Armor', 0, 0, 5);

INSERT INTO game.categories ( 
    "name"
    )
    VALUES ('fantastic');

INSERT INTO game.text_in_game ( 
    "description"
    )
    VALUES ('Vous vous réveillez en prison mais vous ne savez comment vous êtes arrivé là... 
    La porte ne semble pas verrouillée pour autant et un vieillard gît dans un coin sombre.'),
    ('Hum...
    Cela fait si longtemps...
    Je n''ai vu que des rats depuis des années...
    Rien d''autre de vivant...
    Tuez-moi pour mettre fin à cette malédiction'),
    ('Tuez-moi ou vous serez maudit à jamais en partant d''ici !'),
    ('Vous voyez au loin une une sortie vers l''extérieur. Quelle aubaine ! Vous pourriez vous enfuir sans aucun soucis, Philosophie.'),
    ('Vous montez sur la barque mais la mer l''emporte immédiatement ! Vous ne savez pas comment revenir en arrière et ça ne vous dérange pas plus que ça... LIBRE !');

COMMIT;

BEGIN;

UPDATE nav.user SET "detail_id" = 1, "updated_at" = now() WHERE "id" = 1;
UPDATE nav.user SET "detail_id" = 2, "updated_at" = now() WHERE "id" = 2;

UPDATE game.scene SET "type_id" = 1, "opponent_id" = 4, "item_id" = 1 WHERE "id" = 1;

INSERT INTO game.party ( 
    "user_id",
    "playable_id",
    "history_id"
    )
    VALUES (1, 1, 1);

INSERT INTO game.history_has_scene ( 
    "history_id",
    "scene_id",
    "previous_scene_id",
    "next_scene_id"
    )
    VALUES (1, 1, null, 2);

INSERT INTO game.history_has_categories ( 
    "history_id",
    "categories_id"
    )
    VALUES (1, 1);

INSERT INTO game.scene_has_text ( 
    "scene_id",
    "text_in_game_id"
    )
    VALUES (1, 1);

INSERT INTO game.scene_has_item ( 
    "scene_id",
    "item_id"
    )
    VALUES (1, 1);

COMMIT;