BEGIN;

UPDATE nav.user SET "detail_id" = 1, "updated_at" = now() WHERE "id" = 1;
UPDATE nav.user SET "detail_id" = 2, "updated_at" = now() WHERE "id" = 2;

UPDATE game.scene SET "type_id" = 1, "opponent_id" = 4, "item_id" = 1 WHERE "id" = 1;
UPDATE game.scene SET "type_id" = 1, "opponent_id" = 5, "item_id" = 2 WHERE "id" = 2;
UPDATE game.scene SET "type_id" = 1, "opponent_id" = 6, "item_id" = 2 WHERE "id" = 3;
UPDATE game.scene SET "type_id" = 1, "opponent_id" = 4, "item_id" = 3 WHERE "id" = 4;
UPDATE game.scene SET "type_id" = 1, "opponent_id" = 4, "item_id" = 1 WHERE "id" = 5;
UPDATE game.scene SET "type_id" = 1, "opponent_id" = 4, "item_id" = 1 WHERE "id" = 6;

INSERT INTO game.party ( 
    "user_id",
    "playable_id",
    "history_id"
    )
    VALUES  (1, 1, 1),
            (1, 2, 1),
            (2, 1, 1);

INSERT INTO game.history_has_scene ( 
    "history_id",
    "scene_id",
    "previous_scene_id",
    "next_scene_id"
    )
    VALUES  (1, 1, null, 2),
            (1, 2, 1, 3),
            (1, 3, 2, 4),
            (1, 4, 3, 5),
            (1, 5, 4, 6),
            (1, 6, 5, null);

INSERT INTO game.history_has_categories ( 
    "history_id",
    "categories_id"
    )
    VALUES  (1, 1),
            (1, 2),
            (1, 3),
            (2, 2);

INSERT INTO game.scene_has_text ( 
    "scene_id",
    "text_in_game_id"
    )
    VALUES  (1, 1),
            (2, 2),
            (3, 4),
            (4, 3);

INSERT INTO game.scene_has_item ( 
    "scene_id",
    "item_id"
    )
    VALUES  (1, 1),
            (1, 2),
            (3, 4),
            (4, 3);

INSERT INTO game.scene_has_clickable_element ( 
    "scene_id",
    "clickable_element_id"
    )
    VALUES  (1, 1),
            (1, 2),
            (3, 4),
            (4, 3);

INSERT INTO game.character_has_item ( 
    "character_id",
    "item_id"
    )
    VALUES  (1, 1),
            (1, 2),
            (3, 4),
            (4, 3);

COMMIT;