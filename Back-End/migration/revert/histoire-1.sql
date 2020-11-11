-- Revert heros:histoire-1 from pg

BEGIN;

DROP VIEW scene_text;

DROP VIEW scene_opponent;

DROP VIEW scene_clickable_element;

DROP VIEW scene_finish;

COMMIT;

BEGIN;

DELETE FROM game.history_has_scene;

DELETE FROM game.history_has_categories;

DELETE FROM game.scene_has_text;

DELETE FROM game.scene_has_clickable_element;

DELETE FROM game.party;

DELETE FROM game.history;

DELETE FROM game.scene;

DELETE FROM game.character;

DELETE FROM game.type;

DELETE FROM game.categories;

DELETE FROM game.text_in_game;

DELETE FROM game.clickable_element;

COMMIT;

