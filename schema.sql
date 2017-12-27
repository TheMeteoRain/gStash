
DROP DATABASE IF EXISTS poe;
CREATE DATABASE poe;
\connect poe


--DROP TABLE IF EXISTS Stashes CASCADE;
--DROP TABLE IF EXISTS Sockets;
--DROP TABLE IF EXISTS Requirements;
--DROP TABLE IF EXISTS Properties;
--DROP TABLE IF EXISTS Mods;
--DROP TABLE IF EXISTS Items;
--DROP TABLE IF EXISTS CurrencyStats;
--DROP TABLE IF EXISTS Currencies;
--DROP TABLE IF EXISTS Leagues;
--DROP TABLE IF EXISTS ChangeId;
--DROP TABLE IF EXISTS Accounts;
--DROP FUNCTION IF EXISTS search_items(TEXT, VARCHAR, INT, INT, INT, INT, INT, INT, INT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN);
SET DEFAULT_TEXT_SEARCH_CONFIG = 'english';

CREATE TABLE Accounts (
  account_name VARCHAR(128) PRIMARY KEY,
  last_Character_name VARCHAR(128) DEFAULT NULL,
  last_seen BIGINT DEFAULT 0
);


CREATE TABLE ChangeId (
  id BIGSERIAL NOT NULL,
  next_change_id VARCHAR(128) NOT NULL DEFAULT '' UNIQUE,
  processed BOOLEAN DEFAULT 'false',
  PRIMARY KEY (id,next_change_id)
);
INSERT INTO ChangeId(next_change_id, processed) VALUES('0', '0');



CREATE TABLE Leagues (
  league_name VARCHAR(128) NOT NULL DEFAULT '' PRIMARY KEY,
  active SMALLINT DEFAULT '0',
  poeTradeId VARCHAR(128) DEFAULT ''
);
INSERT INTO Leagues(league_name, active)
VALUES ('Standard', '1'), ('Hardcore', '1'), ('SSF Standard', '1'), ('SSF Hardcore', '1'),
('Harbinger', '1'), ('Hardcore Harbinger', '1'), ('SSF Harbinger', '1'), ('SSF Harbinger HC', '1'),
('Legacy', '1'), ('Hardcore Legacy', '1'), ('SSF Legacy', '1'), ('SSF HC Legacy', '1');


CREATE TYPE frame_type AS ENUM ('Normal', 'Magic', 'Rare', 'Unique', 'Gem', 'Currency', 'Divination card', 'Quest item', 'Prophecy', 'Relic');
CREATE TABLE FrameType (
  id SMALLINT PRIMARY KEY,
  frame_type_value frame_type NOT NULL
);
INSERT INTO FrameType(id, frame_type_value)
VALUES (0, 'Normal'), (1, 'Magic'), (2, 'Rare'), (3, 'Unique'), (4, 'Gem'), (5,'Currency'), (6, 'Divination card'),
(7,'Quest item'), (8, 'Prophecy'), (9, 'Relic');


CREATE TYPE value_type AS ENUM ('Default', 'Augmented', 'Unmet', 'Physical','Fire', 'Cold', 'Lightning', 'Chaos');
CREATE TABLE ValueType (
  id SMALLINT PRIMARY KEY,
  value_type value_type NOT NULL
);
INSERT INTO ValueType
VALUES (0, 'Default'), (1, 'Augmented'), (2, 'Unmet'), (3, 'Physical'), (4, 'Fire'), (5, 'Cold'), (6, 'Lightning'), (7, 'Chaos');


CREATE TABLE Currencies (
  id BIGSERIAL NOT NULL,
  timestamp BIGINT NOT NULL DEFAULT '0',
  league VARCHAR(128) NOT NULL DEFAULT '',
  sell VARCHAR(128) NOT NULL DEFAULT '',
  currency_key VARCHAR(128) NOT NULL DEFAULT '' UNIQUE,
  PRIMARY KEY (currency_key,id),
  CONSTRAINT Currencies_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (league_name)
);


CREATE TABLE CurrencyStats (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  buy VARCHAR(128) NOT NULL DEFAULT '',
  mean REAL DEFAULT '0',
  median REAL DEFAULT '0',
  mode REAL DEFAULT '0',
  min REAL DEFAULT '0',
  max REAL DEFAULT '0',
  currency_key VARCHAR(128) NOT NULL DEFAULT '',
  CONSTRAINT currencystats_ibfk_1 FOREIGN KEY (currency_key) REFERENCES Currencies (currency_key)
);


CREATE TYPE stash_type AS ENUM ('NormalStash','PremiumStash','QuadStash','EssenceStash','CurrencyStash','DivinationStash');
CREATE TABLE Stashes (
  stash_id VARCHAR(128) NOT NULL DEFAULT '' PRIMARY KEY,
  stash_name VARCHAR(128) DEFAULT NULL,
  stash_type stash_type DEFAULT 'NormalStash',
  stash_public BOOLEAN DEFAULT 'FALSE'
);


CREATE TABLE Items (
  account_name VARCHAR(128) NOT NULL,
  added_ts BIGINT DEFAULT 0,
  art_filename VARCHAR(1024) DEFAULT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  corrupted BOOLEAN NOT NULL DEFAULT FALSE,
  crafted BOOLEAN DEFAULT FALSE,
  descr_text VARCHAR(2048) DEFAULT NULL,
  duplicated BOOLEAN DEFAULT FALSE,
  document TSVECTOR DEFAULT NULL,
  enchanted BOOLEAN DEFAULT FALSE,
  flavour_text VARCHAR(1024) DEFAULT NULL,
  frame_type SMALLINT DEFAULT 0,
  h SMALLINT DEFAULT 0,
  icon VARCHAR(1024) DEFAULT NULL,
  identified BOOLEAN NOT NULL DEFAULT FALSE,
  ilvl SMALLINT NOT NULL DEFAULT 0,
  inventory_id VARCHAR(128) DEFAULT NULL,
  is_relic BOOLEAN DEFAULT FALSE,
  item_id VARCHAR(128) NOT NULL PRIMARY KEY,
  league VARCHAR(128) DEFAULT NULL,
  link_amount SMALLINT DEFAULT NULL,
  max_stack_size SMALLINT DEFAULT NULL,
  name VARCHAR(128) DEFAULT NULL,
  note VARCHAR(128) DEFAULT NULL,
  prophecy_diff_text VARCHAR(1024) DEFAULT NULL,
  prophecy_text VARCHAR(2048) DEFAULT NULL,
  sec_decription_text VARCHAR(4096) DEFAULT NULL,
  socket_amount SMALLINT DEFAULT NULL,
  stack_size SMALLINT DEFAULT NULL,
  stash_id VARCHAR(128) DEFAULT NULL,
  support BOOLEAN DEFAULT TRUE,
  talisman_tier SMALLINT DEFAULT NULL,
  type_line VARCHAR(128) DEFAULT NULL,
  updated_ts BIGINT DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  w SMALLINT DEFAULT 0,
  x SMALLINT DEFAULT 0,
  y SMALLINT DEFAULT 0,
  CONSTRAINT Items_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (league_name),
  CONSTRAINT Items_ibfk_2 FOREIGN KEY (account_name) REFERENCES Accounts (account_name),
  CONSTRAINT Items_ibfk_3 FOREIGN KEY (stash_id) REFERENCES Stashes (stash_id) ON DELETE CASCADE
);

CREATE TYPE mod_type AS ENUM ('EXPLICIT','IMPLICIT','CRAFTED','ENCHANTED');
CREATE TABLE Mods (
  item_id VARCHAR(128) NOT NULL,
  mod_name VARCHAR(256) NOT NULL,
  mod_value1 VARCHAR(256) DEFAULT NULL,
  mod_value2 VARCHAR(128) DEFAULT NULL,
  mod_value3 VARCHAR(128) DEFAULT NULL,
  mod_value4 VARCHAR(128) DEFAULT NULL,
  mod_type mod_type DEFAULT 'IMPLICIT',
  mod_key BIGSERIAL NOT NULL,
  CONSTRAINT Mods_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Properties (
  item_id VARCHAR(128) NOT NULL,
  property_name VARCHAR(128) NOT NULL,
  property_value1 VARCHAR(128) DEFAULT NULL,
  property_value2 VARCHAR(128) DEFAULT NULL,
  property_value_type SMALLINT DEFAULT NULL,
  property_display_mode SMALLINT DEFAULT NULL,
  property_progress DECIMAL DEFAULT NULL,
  property_key BIGSERIAL NOT NULL,
  CONSTRAINT Properties_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Requirements (
  item_id VARCHAR(128) NOT NULL,
  requirement_name VARCHAR(128) NOT NULL,
  requirement_value VARCHAR(128) DEFAULT NULL,
  requirement_value_type SMALLINT DEFAULT NULL,
  requirement_display_mode SMALLINT DEFAULT NULL,
  requirement_key BIGSERIAL NOT NULL,
  PRIMARY KEY (item_id, requirement_name),
  CONSTRAINT Requirements_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Sockets (
  item_id VARCHAR(128) NOT NULL,
  socket_group SMALLINT DEFAULT '0',
  socket_attr CHAR(1) DEFAULT NULL,
  socket_key BIGSERIAL NOT NULL,
  CONSTRAINT Sockets_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

--DROP FUNCTION IF EXISTS search_items(TEXT, VARCHAR, INT, INT, INT, INT, INT, INT, INT, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN);

CREATE FUNCTION search_items(search TEXT DEFAULT '', league_name VARCHAR DEFAULT 'Standard', frametype INT DEFAULT NULL,
  socket_amount_min INT DEFAULT 0, socket_amount_max INT DEFAULT 6, link_amount_min INT DEFAULT 0,
  link_amount_max INT DEFAULT 6, item_lvl_min INT DEFAULT 0, item_lvl_max INT DEFAULT 100,
  is_identified BOOLEAN DEFAULT NULL, is_verified BOOLEAN DEFAULT NULL, is_corrupted BOOLEAN DEFAULT NULL,
  is_enchanted BOOLEAN DEFAULT NULL, is_crafted BOOLEAN DEFAULT NULL) RETURNS SETOF items AS $$
SELECT *
FROM items
WHERE
    ((LENGTH(TRIM(search)) = 0 AND type_line ILIKE '%' || search || '%') OR (document @@ to_tsquery(REGEXP_REPLACE(TRIM(search), '\s+', '&', 'g')))) AND
    league LIKE league_name AND ((frametype IS NULL) OR (frame_type = frametype)) AND
    (socket_amount BETWEEN socket_amount_min AND socket_amount_max) AND (link_amount BETWEEN link_amount_min AND link_amount_max) AND (ilvl BETWEEN item_lvl_min AND item_lvl_max) AND
    ((is_identified IS NULL AND identified IS NOT NULL) OR (is_identified IS TRUE AND identified IS TRUE) OR (is_identified IS FALSE AND identified IS FALSE)) AND
    ((is_verified IS NULL AND identified IS NOT NULL) OR (is_verified IS TRUE AND identified IS TRUE) OR (is_verified IS FALSE AND identified IS FALSE)) AND
    ((is_corrupted IS NULL AND identified IS NOT NULL) OR (is_corrupted IS TRUE AND identified IS TRUE) OR (is_corrupted IS FALSE AND identified IS FALSE)) AND
    ((is_enchanted IS NULL AND identified IS NOT NULL) OR (is_enchanted IS TRUE AND identified IS TRUE) OR (is_enchanted IS FALSE AND identified IS FALSE)) AND
    ((is_crafted IS NULL AND identified IS NOT NULL) OR (is_crafted IS TRUE AND identified IS TRUE) OR (is_crafted IS FALSE AND identified IS FALSE))
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

CREATE UNIQUE INDEX item ON Items USING BTREE (item_id);
CREATE INDEX idx_fts_search ON items USING gin(document);
CREATE INDEX idx_mods ON mods USING BTREE (item_id);
CREATE INDEX idx_properties ON properties USING BTREE (item_id);
CREATE INDEX idx_requirements ON requirements USING BTREE (item_id);
CREATE INDEX idx_sockets ON sockets USING BTREE (item_id);

