SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='poe';

DROP DATABASE IF EXISTS poe;
CREATE DATABASE poe;
\connect poe

--DROP TABLE IF EXISTS stashes CASCADE;
--DROP TABLE IF EXISTS sockets;
--DROP TABLE IF EXISTS requirements;
--DROP TABLE IF EXISTS properties;
--DROP TABLE IF EXISTS mods;
--DROP TABLE IF EXISTS items;
--DROP TABLE IF EXISTS currency_stats;
--DROP TABLE IF EXISTS currencies;
--DROP TABLE IF EXISTS leagues;
--DROP TABLE IF EXISTS change_id;
--DROP TABLE IF EXISTS accounts;
--DROP FUNCTION IF EXISTS search_items(TEXT, VARCHAR, INT, INT, INT, INT, INT, INT, INT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN);
SET DEFAULT_TEXT_SEARCH_CONFIG = 'english';
SET CLIENT_ENCODING TO 'UTF8';

CREATE TYPE modType AS ENUM ('EXPLICIT','IMPLICIT','CRAFTED','ENCHANTED','UTILITY');
CREATE TYPE frameType AS ENUM ('Normal', 'Magic', 'Rare', 'Unique', 'Gem', 'Currency', 'Divination card', 'Quest item', 'Prophecy', 'Relic');


CREATE UNLOGGED TABLE accounts (
  account_name VARCHAR(128) PRIMARY KEY,
  last_character_name VARCHAR(128) DEFAULT NULL,
  last_seen BIGINT DEFAULT 0
);


CREATE UNLOGGED TABLE change_id (
  id BIGSERIAL,
  next_change_id VARCHAR(128) PRIMARY KEY,
  downloaded BOOLEAN DEFAULT 'FALSE',
  uploaded BOOLEAN DEFAULT 'FALSE'
);
INSERT INTO change_id(next_change_id, downloaded, uploaded) VALUES('0', 'FALSE', 'FALSE');



CREATE UNLOGGED TABLE leagues (
  league_name VARCHAR(128) PRIMARY KEY,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE items_data (
  name VARCHAR(128) DEFAULT NULL,
  type VARCHAR(128) NOT NULL,
  disc VARCHAR(128) DEFAULT NULL,
  text VARCHAR(128) PRIMARY KEY
);

CREATE TABLE stats_data (
  id VARCHAR(256) PRIMARY KEY,
  text VARCHAR(512) NOT NULL,
  type VARCHAR(128) NOT NULL
);

CREATE UNLOGGED TABLE frame_type (
  id SMALLINT PRIMARY KEY,
  frame_type_value frameType NOT NULL
);
INSERT INTO frame_type(id, frame_type_value)
VALUES (0, 'Normal'), (1, 'Magic'), (2, 'Rare'), (3, 'Unique'), (4, 'Gem'), (5,'Currency'), (6, 'Divination card'),
(7,'Quest item'), (8, 'Prophecy'), (9, 'Relic');


CREATE TYPE vType AS ENUM ('Default', 'Augmented', 'Unmet', 'Physical','Fire', 'Cold', 'Lightning', 'Chaos');
CREATE UNLOGGED TABLE value_type (
  id SMALLINT PRIMARY KEY,
  value_type vType NOT NULL
);
INSERT INTO value_type
VALUES (0, 'Default'), (1, 'Augmented'), (2, 'Unmet'), (3, 'Physical'), (4, 'Fire'), (5, 'Cold'), (6, 'Lightning'), (7, 'Chaos');




CREATE UNLOGGED TABLE currencies (
  id BIGSERIAL NOT NULL,
  timestamp BIGINT NOT NULL DEFAULT '0',
  league VARCHAR(128) NOT NULL DEFAULT '',
  sell VARCHAR(128) NOT NULL DEFAULT '',
  currency_key VARCHAR(128) NOT NULL DEFAULT '' UNIQUE,
  PRIMARY KEY (currency_key,id),
  CONSTRAINT currencies_ibfk_1 FOREIGN KEY (league) REFERENCES leagues (league_name)
);


CREATE UNLOGGED TABLE currency_stats (
  id BIGSERIAL PRIMARY KEY,
  buy VARCHAR(128) NOT NULL DEFAULT '',
  mean REAL DEFAULT '0',
  median REAL DEFAULT '0',
  mode REAL DEFAULT '0',
  min REAL DEFAULT '0',
  max REAL DEFAULT '0',
  currency_key VARCHAR(128) NOT NULL DEFAULT '',
  CONSTRAINT currencystats_ibfk_1 FOREIGN KEY (currency_key) REFERENCES currencies (currency_key)
);


CREATE TYPE stash_type AS ENUM ('NormalStash','PremiumStash','QuadStash','EssenceStash','CurrencyStash','DivinationCardStash');
CREATE UNLOGGED TABLE stashes (
  stash_id VARCHAR(128) PRIMARY KEY,
  stash_name VARCHAR(128) DEFAULT NULL,
  stash_type stash_type DEFAULT 'NormalStash',
  stash_public BOOLEAN DEFAULT 'FALSE'
);


CREATE UNLOGGED TABLE items (
  account_name VARCHAR(128) NOT NULL,
  added_ts BIGINT DEFAULT NULL,
  corrupted BOOLEAN NOT NULL,
  crafted BOOLEAN NOT NULL,
  document TSVECTOR DEFAULT NULL,
  enchanted BOOLEAN NOT NULL,
  frame_type SMALLINT NOT NULL,
  h SMALLINT NOT NULL,
  icon VARCHAR(1024) DEFAULT NULL,
  identified BOOLEAN NOT NULL,
  ilvl SMALLINT DEFAULT NULL,
  inventory_id VARCHAR(128) DEFAULT NULL,
  item_id VARCHAR(128) PRIMARY KEY,
  league VARCHAR(128) DEFAULT NULL,
  name VARCHAR(128) DEFAULT NULL,
  stash_id VARCHAR(128) DEFAULT NULL,
  type_line VARCHAR(128) DEFAULT NULL,
  updated_ts BIGINT DEFAULT NULL,
  verified BOOLEAN NOT NULL,
  w SMALLINT DEFAULT NULL,
  x SMALLINT DEFAULT NULL,
  y SMALLINT DEFAULT NULL,
  variable_data JSONB DEFAULT NULL,
  CONSTRAINT items_ibfk_1 FOREIGN KEY (league) REFERENCES leagues (league_name),
  CONSTRAINT items_ibfk_2 FOREIGN KEY (account_name) REFERENCES accounts (account_name),
  CONSTRAINT items_ibfk_3 FOREIGN KEY (stash_id) REFERENCES stashes (stash_id) ON DELETE CASCADE
);


CREATE UNLOGGED TABLE mods (
  item_id VARCHAR(128) NOT NULL,
  mod_name TEXT NOT NULL,
  mod_type modType DEFAULT 'IMPLICIT',
  mod_value1 VARCHAR(256) DEFAULT NULL,
  mod_value2 VARCHAR(128) DEFAULT NULL,
  mod_value3 VARCHAR(128) DEFAULT NULL,
  mod_value4 VARCHAR(128) DEFAULT NULL,
  PRIMARY KEY (item_id, mod_type, mod_name),
  CONSTRAINT mods_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);


CREATE UNLOGGED TABLE properties (
  item_id VARCHAR(128) NOT NULL,
  property_name VARCHAR(128) NOT NULL,
  property_value1 VARCHAR(128) DEFAULT NULL,
  property_value2 VARCHAR(128) DEFAULT NULL,
  property_value_type SMALLINT DEFAULT NULL,
  property_display_mode SMALLINT DEFAULT NULL,
  property_progress DECIMAL DEFAULT NULL,
  PRIMARY KEY (item_id, property_name),
  CONSTRAINT properties_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);


CREATE UNLOGGED TABLE requirements (
  item_id VARCHAR(128) NOT NULL,
  requirement_name VARCHAR(128) NOT NULL,
  requirement_value VARCHAR(128) DEFAULT NULL,
  requirement_value_type SMALLINT DEFAULT NULL,
  requirement_display_mode SMALLINT DEFAULT NULL,
  PRIMARY KEY (item_id, requirement_name),
  CONSTRAINT requirements_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);


CREATE UNLOGGED TABLE sockets (
  item_id VARCHAR(128) NOT NULL,
  socket_order SMALLINT NOT NULL,
  socket_attr CHAR(1) NOT NULL,
  socket_group SMALLINT NOT NULL,
  PRIMARY KEY (item_id, socket_order),
  CONSTRAINT sockets_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE
);

--DROP FUNCTION IF EXISTS search_items(TEXT, VARCHAR, INT, INT, INT, INT, INT, INT, INT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN);
-- search_items('Belly of the beast wyrmscale', 'Standard', NULL, 0, 6, 0, 6, 0, 100, true, null, null, null, null);
CREATE OR REPLACE FUNCTION  search_items(
  search TEXT DEFAULT '',
  league_name VARCHAR DEFAULT 'Standard',
  frametype INT DEFAULT NULL,
  socket_amount_min INT DEFAULT 0,
  socket_amount_max INT DEFAULT 6,
  link_amount_min INT DEFAULT 0,
  link_amount_max INT DEFAULT 6,
  item_lvl_min INT DEFAULT 0,
  item_lvl_max INT DEFAULT 100,
  is_identified BOOLEAN DEFAULT NULL,
  is_verified BOOLEAN DEFAULT NULL,
  is_corrupted BOOLEAN DEFAULT NULL,
  is_enchanted BOOLEAN DEFAULT NULL,
  is_crafted BOOLEAN DEFAULT NULL
  ) RETURNS SETOF items AS $$
SELECT *
FROM items
WHERE
    ((LENGTH(TRIM(search)) = 0 AND type_line ILIKE '%' || search || '%') OR (document @@ to_tsquery(REGEXP_REPLACE(TRIM(search), '\s+', '&', 'g')))) AND
    league LIKE league_name AND ((frametype IS NULL) OR (frame_type = frametype)) AND
    ((variable_data->>'socket_amount')::int >= socket_amount_min AND (variable_data->>'socket_amount')::int <= socket_amount_max) AND 
    ((variable_data->>'link_amount')::int >= link_amount_min AND (variable_data->>'link_amount')::int <= link_amount_max) AND
    (ilvl BETWEEN item_lvl_min AND item_lvl_max) AND
    ((is_identified IS NULL AND identified IS NOT NULL) OR (is_identified IS TRUE AND identified IS TRUE) OR (is_identified IS FALSE AND identified IS FALSE)) AND
    ((is_verified IS NULL AND verified IS NOT NULL) OR (is_verified IS TRUE AND verified IS TRUE) OR (is_verified IS FALSE AND verified IS FALSE)) AND
    ((is_corrupted IS NULL AND corrupted IS NOT NULL) OR (is_corrupted IS TRUE AND corrupted IS TRUE) OR (is_corrupted IS FALSE AND corrupted IS FALSE)) AND
    ((is_enchanted IS NULL AND enchanted IS NOT NULL) OR (is_enchanted IS TRUE AND enchanted IS TRUE) OR (is_enchanted IS FALSE AND enchanted IS FALSE)) AND
    ((is_crafted IS NULL AND crafted IS NOT NULL) OR (is_crafted IS TRUE AND crafted IS TRUE) OR (is_crafted IS FALSE AND crafted IS FALSE))
$$ LANGUAGE SQL STABLE;


-- Create trigger when a new item is inserted
-- update document(ts_vector) column on a new item to match item's: name and type_line
CREATE FUNCTION create_document_on_item() RETURNS TRIGGER AS $create_document_on_item$
    BEGIN
        NEW.document := to_tsvector(NEW.name || '. ' || NEW.type_line);
        RETURN NEW;
    END;
$create_document_on_item$ LANGUAGE plpgsql;

CREATE TRIGGER create_document_on_item BEFORE INSERT ON items
    FOR EACH ROW EXECUTE PROCEDURE create_document_on_item();


CREATE INDEX idx_fts_search ON items USING gin(document);
CREATE INDEX idx_mods ON mods USING BTREE (item_id);
CREATE INDEX idx_properties ON properties USING BTREE (item_id);
CREATE INDEX idx_requirements ON requirements USING BTREE (item_id);
CREATE INDEX idx_sockets ON sockets USING BTREE (item_id);

-- SELECT relname, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze FROM pg_stat_all_tables WHERE schemaname = 'public';


-- VACUUM ANALYZE accounts;VACUUM ANALYZE stashes;VACUUM ANALYZE items;VACUUM ANALYZE properties;
-- VACUUM ANALYZE mods;VACUUM ANALYZE requirements;VACUUM ANALYZE sockets;
-- SELECT pg_reload_conf();



ALTER TABLE accounts SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE accounts SET (autovacuum_vacuum_threshold = 10);
ALTER TABLE accounts SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE accounts SET (autovacuum_analyze_threshold = 1000);
ALTER TABLE accounts SET (autovacuum_vacuum_scale_factor = 0.0);


ALTER TABLE stashes SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE stashes SET (autovacuum_vacuum_threshold = 10);
ALTER TABLE stashes SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE stashes SET (autovacuum_analyze_threshold = 1000);

ALTER TABLE items SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE items SET (autovacuum_vacuum_threshold = 50);
ALTER TABLE items SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE items SET (autovacuum_analyze_threshold = 1000);

ALTER TABLE sockets SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE sockets SET (autovacuum_vacuum_threshold = 100);
ALTER TABLE sockets SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE sockets SET (autovacuum_analyze_threshold = 1000);

ALTER TABLE properties SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE properties SET (autovacuum_vacuum_threshold = 100);
ALTER TABLE properties SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE properties SET (autovacuum_analyze_threshold = 1000);

ALTER TABLE requirements SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE requirements SET (autovacuum_vacuum_threshold = 100);
ALTER TABLE requirements SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE requirements SET (autovacuum_analyze_threshold = 1000);

ALTER TABLE mods SET (autovacuum_vacuum_scale_factor = 0.0);
ALTER TABLE mods SET (autovacuum_vacuum_threshold = 100);
ALTER TABLE mods SET (autovacuum_analyze_scale_factor = 0.2);
ALTER TABLE mods SET (autovacuum_analyze_threshold = 1000);
