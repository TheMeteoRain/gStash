SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='poe';

DROP DATABASE IF EXISTS poe;
CREATE DATABASE poe;
\connect poe

SET DEFAULT_TEXT_SEARCH_CONFIG = 'english';
SET CLIENT_ENCODING TO 'UTF8';


CREATE TABLE change_id (
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

CREATE UNLOGGED TABLE items_data (
  name VARCHAR(128) DEFAULT NULL,
  type VARCHAR(128) NOT NULL,
  disc VARCHAR(128) DEFAULT NULL,
  text VARCHAR(128) PRIMARY KEY
);

CREATE UNLOGGED TABLE stats_data (
  id VARCHAR(256) PRIMARY KEY,
  text VARCHAR(512) NOT NULL,
  type VARCHAR(128) NOT NULL
);


CREATE UNLOGGED TABLE accounts (
  account_name VARCHAR(128) PRIMARY KEY,
  last_character_name VARCHAR(128) DEFAULT NULL,
  last_seen BIGINT DEFAULT 0
);

CREATE TYPE stash_type AS ENUM ('NormalStash','PremiumStash','QuadStash','EssenceStash','CurrencyStash','DivinationCardStash', 'MapStash');
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
  item_id VARCHAR(128) NOT NULL,
  league VARCHAR(128) DEFAULT NULL,
  name VARCHAR(128) DEFAULT NULL,
  stash_id VARCHAR(128) DEFAULT NULL,
  type_line VARCHAR(128) DEFAULT NULL,
  updated_ts BIGINT DEFAULT NULL,
  verified BOOLEAN NOT NULL,
  w SMALLINT DEFAULT NULL,
  x SMALLINT DEFAULT NULL,
  y SMALLINT DEFAULT NULL,
  variable_data JSONB DEFAULT NULL
);


CREATE UNLOGGED TABLE mods (
  item_id VARCHAR(128) NOT NULL,
  mod_name TEXT NOT NULL,
  mod_type VARCHAR(50) DEFAULT 'IMPLICIT',
  mod_value1 VARCHAR(256) DEFAULT NULL,
  mod_value2 VARCHAR(128) DEFAULT NULL,
  mod_value3 VARCHAR(128) DEFAULT NULL,
  mod_value4 VARCHAR(128) DEFAULT NULL
);


CREATE UNLOGGED TABLE properties (
  item_id VARCHAR(128) NOT NULL,
  property_name VARCHAR(128) NOT NULL,
  property_values JSONB NOT NULL,
  property_display_mode SMALLINT DEFAULT NULL,
  property_progress DECIMAL DEFAULT NULL
);


CREATE UNLOGGED TABLE requirements (
  item_id VARCHAR(128) NOT NULL,
  requirement_name VARCHAR(128) NOT NULL,
  requirement_value VARCHAR(128) DEFAULT NULL,
  requirement_value_type SMALLINT DEFAULT NULL,
  requirement_display_mode SMALLINT DEFAULT NULL
);


CREATE UNLOGGED TABLE sockets (
  item_id VARCHAR(128) NOT NULL,
  socket_order SMALLINT NOT NULL,
  socket_attr CHAR(1) NOT NULL,
  socket_group SMALLINT NOT NULL
);

--  CREATE INDEX idx_fts_search ON items USING gin(document)
--  WHERE document IS NOT NULL;
--  CREATE INDEX idx_variable_data ON items USING gin (variable_data)
--  WHERE idx_variable_data IS NOT NULL;
--  ALTER TABLE items ADD PRIMARY KEY (item_id);
--  ALTER TABLE mods ADD PRIMARY KEY (item_id, mod_name, mod_type);
--  ALTER TABLE properties ADD PRIMARY KEY (item_id, property_name);
--  ALTER TABLE requirements ADD PRIMARY KEY (item_id, requirement_name);
--  ALTER TABLE sockets ADD PRIMARY KEY (item_id, socket_order, socket_attr);

-- ALTER TABLE items ADD CONSTRAINT items_ibfk_1 FOREIGN KEY (league) REFERENCES leagues (league_name)
-- ALTER TABLE items ADD CONSTRAINT items_ibfk_2 FOREIGN KEY (account_name) REFERENCES accounts (account_name)
-- ALTER TABLE items ADD CONSTRAINT items_ibfk_3 FOREIGN KEY (stash_id) REFERENCES stashes (stash_id) ON DELETE CASCADE

-- CREATE INDEX idx_socket_amount ON items (((variable_data ->> 'socket_amount')::int))
-- WHERE (variable_data ->> 'socket_amount') IS NOT NULL;
-- CREATE INDEX idx_link_amount ON items (((variable_data ->> 'link_amount')::int))
-- WHERE (variable_data ->> 'link_amount') IS NOT NULL;


