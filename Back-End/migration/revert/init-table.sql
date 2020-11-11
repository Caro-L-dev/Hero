-- Revert heros:init-table from pg

BEGIN;

DROP SCHEMA nav CASCADE;

DROP SCHEMA game CASCADE;

COMMIT;
