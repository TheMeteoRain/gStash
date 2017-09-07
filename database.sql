


DROP DATABASE IF EXISTS poe;
CREATE DATABASE poe;
\connect poe


DROP TABLE IF EXISTS Stashes CASCADE;
DROP TABLE IF EXISTS Sockets;
DROP TABLE IF EXISTS Requirements;
DROP TABLE IF EXISTS Properties;
DROP TABLE IF EXISTS Mods;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS CurrencyStats;
DROP TABLE IF EXISTS Currencies;
DROP TABLE IF EXISTS Leagues;
DROP TABLE IF EXISTS ChangeId;
DROP TABLE IF EXISTS Accounts;


CREATE TABLE Accounts (
  account_name varchar(128) DEFAULT '' PRIMARY KEY,
  last_character_name varchar(128) DEFAULT NULL,
  last_seen bigint DEFAULT 0
);


CREATE TABLE ChangeId (
  id BIGSERIAL NOT NULL,
  nextChangeId varchar(128) NOT NULL DEFAULT '' UNIQUE,
  processed boolean DEFAULT 'false',
  PRIMARY KEY (id,nextChangeId)
);
INSERT INTO ChangeId(nextChangeId, processed) VALUES('0', '0');

CREATE TABLE Leagues (
  leagueName varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  active smallint DEFAULT '0',
  poeTradeId varchar(128) DEFAULT ''
);
INSERT INTO Leagues(leagueName, active) VALUES('Standard', '1');
INSERT INTO Leagues(leagueName, active) VALUES('Hardcore', '1');
INSERT INTO Leagues(leagueName, active) VALUES('SSF Standard', '1');
INSERT INTO Leagues(leagueName, active) VALUES('SSF Hardcore', '1');
INSERT INTO Leagues(leagueName, active) VALUES('Legacy', '1');
INSERT INTO Leagues(leagueName, active) VALUES('Hardcore Legacy', '1');
INSERT INTO Leagues(leagueName, active) VALUES('SSF Legacy', '1');
INSERT INTO Leagues(leagueName, active) VALUES('SSF HC Legacy', '1');


CREATE TABLE Currencies (
  id BIGSERIAL NOT NULL,
  timestamp bigint NOT NULL DEFAULT '0',
  league varchar(128) NOT NULL DEFAULT '',
  sell varchar(128) NOT NULL DEFAULT '',
  currencyKey varchar(128) NOT NULL DEFAULT '' UNIQUE,
  PRIMARY KEY (currencyKey,id),
  CONSTRAINT Currencies_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (leagueName)
);


CREATE TABLE CurrencyStats (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  buy varchar(128) NOT NULL DEFAULT '',
  mean real DEFAULT '0',
  median real DEFAULT '0',
  mode real DEFAULT '0',
  min real DEFAULT '0',
  max real DEFAULT '0',
  currencyKey varchar(128) NOT NULL DEFAULT '',
  CONSTRAINT currencystats_ibfk_1 FOREIGN KEY (currencyKey) REFERENCES Currencies (currencyKey)
);

CREATE TYPE StashType AS ENUM ('NormalStash','PremiumStash','QuadStash','EssenceStash','CurrencyStash','DivinationStash');
CREATE TABLE Stashes (
  stash_id varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  stash_name varchar(128) DEFAULT NULL,
  stash_type varchar(128) DEFAULT NULL,
  stash_public boolean DEFAULT 'FALSE'
);


CREATE TABLE Items (
  w smallint NOT NULL DEFAULT '0',
  h smallint NOT NULL DEFAULT '0',
  ilvl smallint NOT NULL DEFAULT '0',
  icon varchar(1024) DEFAULT NULL,
  league varchar(128) NOT NULL DEFAULT '',
  item_id varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  name varchar(128) DEFAULT NULL,
  type_line varchar(128) DEFAULT NULL,
  identified boolean NOT NULL DEFAULT 'FALSE',
  verified boolean NOT NULL DEFAULT 'FALSE',
  corrupted boolean NOT NULL DEFAULT 'FALSE',
  locked_to_character boolean DEFAULT 'FALSE',
  frame_type smallint DEFAULT '0',
  x smallint DEFAULT '0',
  y smallint DEFAULT '0',
  inventory_id varchar(128) DEFAULT NULL,
  account_name varchar(128) NOT NULL DEFAULT '',
  stash_id varchar(128) NOT NULL DEFAULT '',
  socket_amount smallint NOT NULL DEFAULT '0',
  link_amount smallint NOT NULL DEFAULT '0',
  available boolean NOT NULL DEFAULT TRUE,
  added_ts bigint DEFAULT '0',
  updated_ts bigint DEFAULT '0',
  flavour_text varchar(1024) DEFAULT NULL,
  price varchar(128) DEFAULT NULL,
  enchanted boolean DEFAULT 'FALSE',
  crafted boolean DEFAULT 'FALSE',
  CONSTRAINT Items_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (leagueName),
  CONSTRAINT Items_ibfk_2 FOREIGN KEY (account_name) REFERENCES Accounts (account_name),
  CONSTRAINT Items_ibfk_3 FOREIGN KEY (stash_id) REFERENCES Stashes (stash_id)
);

CREATE TYPE mod_type AS ENUM ('EXPLICIT','IMPLICIT','CRAFTED','ENCHANTED');
CREATE TABLE Mods (
  item_id varchar(128) DEFAULT NULL,
  mod_name varchar(256) NOT NULL DEFAULT '0',
  mod_value1 varchar(256) DEFAULT '0',
  mod_value2 varchar(128) DEFAULT '0',
  mod_value3 varchar(128) DEFAULT '0',
  mod_value4 varchar(128) DEFAULT '0',
  mod_type mod_type DEFAULT 'IMPLICIT',
  mod_key varchar(128) DEFAULT NULL UNIQUE,
  CONSTRAINT Mods_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Properties (
  item_id varchar(128) DEFAULT NULL,
  property_name varchar(128) NOT NULL DEFAULT '0',
  property_value1 varchar(128) DEFAULT '0',
  property_value2 varchar(128) DEFAULT '0',
  property_key BIGSERIAL NOT NULL,
  CONSTRAINT Properties_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Requirements (
  item_id varchar(128) DEFAULT NULL,
  requirement_name varchar(128) NOT NULL DEFAULT '0',
  requirement_value smallint DEFAULT '0',
  requirement_key BIGSERIAL NOT NULL,
  CONSTRAINT Requirements_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);


CREATE TABLE Sockets (
  item_id varchar(128) DEFAULT NULL,
  socket_group smallint DEFAULT '0',
  socket_attr char(1) DEFAULT NULL,
  socket_key BIGSERIAL NOT NULL,
  CONSTRAINT Sockets_ibfk_1 FOREIGN KEY (item_id) REFERENCES Items (item_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX item ON Items USING BTREE (item_id);
