-- Deploy heros:init-table to pg

BEGIN;

CREATE SCHEMA nav AUTHORIZATION heros;
CREATE SCHEMA game AUTHORIZATION heros;

CREATE TABLE nav.game_details (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "avatar" text NOT NULL,
  "displayName" text NOT NULL,
  "gameWin" int DEFAULT 0,
  "gameOver" int DEFAULT 0,
  "gamePlay" int DEFAULT 0
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
  "def" float NOT NULL,
  "image" text
);

CREATE TABLE game.history ( -- NE PEUT ETRE CREE AVANT CHARACTER
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "description" text,
  "difficulty" text,
  "img" text,
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
  "opponent_id" int REFERENCES game.character(id)
);

CREATE TABLE game.categories ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "color" text
);

CREATE TABLE game.text_in_game ( 
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "description" text NOT NULL
);

CREATE TABLE game.clickable_element (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text,
  "shape" text,
  "coords" text
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