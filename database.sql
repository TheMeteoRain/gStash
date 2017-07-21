


DROP DATABASE IF EXISTS poe;
CREATE DATABASE poe;
\connect poe


DROP TABLE IF EXISTS Stashes;
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
  accountName varchar(128) DEFAULT '' PRIMARY KEY,
  lastCharacterName varchar(128) DEFAULT NULL,
  lastSeen bigint DEFAULT 0
);


CREATE TABLE ChangeId (
  id SERIAL NOT NULL,
  nextChangeId varchar(128) NOT NULL DEFAULT '' UNIQUE,
  processed smallint DEFAULT '0',
  PRIMARY KEY (id,nextChangeId)
);
INSERT INTO ChangeId(nextChangeId, processed) VALUES('0', '0');

CREATE TABLE Leagues (
  leagueName varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  active smallint DEFAULT '0',
  poeTradeId varchar(128) DEFAULT ''
);


CREATE TABLE Currencies (
  id SERIAL NOT NULL,
  timestamp bigint NOT NULL DEFAULT '0',
  league varchar(128) NOT NULL DEFAULT '',
  sell varchar(128) NOT NULL DEFAULT '',
  currencyKey varchar(128) NOT NULL DEFAULT '' UNIQUE,
  PRIMARY KEY (currencyKey,id),
  CONSTRAINT Currencies_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (leagueName)
);


CREATE TABLE CurrencyStats (
  id SERIAL NOT NULL PRIMARY KEY,
  buy varchar(128) NOT NULL DEFAULT '',
  mean real DEFAULT '0',
  median real DEFAULT '0',
  mode real DEFAULT '0',
  min real DEFAULT '0',
  max real DEFAULT '0',
  currencyKey varchar(128) NOT NULL DEFAULT '',
  CONSTRAINT currencystats_ibfk_1 FOREIGN KEY (currencyKey) REFERENCES Currencies (currencyKey)
);

CREATE TABLE Stashes (
  stashId varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  stashName varchar(128) DEFAULT NULL,
  stashType varchar(128) DEFAULT NULL,
  publicStash smallint DEFAULT '0'
);

CREATE TABLE Items (
  w smallint NOT NULL DEFAULT '0',
  h smallint NOT NULL DEFAULT '0',
  ilvl smallint NOT NULL DEFAULT '0',
  icon varchar(1024) DEFAULT NULL,
  league varchar(128) NOT NULL DEFAULT '',
  itemId varchar(128) NOT NULL DEFAULT '' PRIMARY KEY,
  name varchar(128) DEFAULT NULL,
  typeLine varchar(128) DEFAULT NULL,
  identified smallint NOT NULL DEFAULT '0',
  verified smallint NOT NULL DEFAULT '0',
  corrupted smallint NOT NULL DEFAULT '0',
  lockedToCharacter smallint DEFAULT '0',
  frameType smallint DEFAULT '0',
  x smallint DEFAULT '0',
  y smallint DEFAULT '0',
  inventoryId varchar(128) DEFAULT NULL,
  accountName varchar(128) NOT NULL DEFAULT '',
  stashId varchar(128) NOT NULL DEFAULT '',
  socketAmount smallint NOT NULL DEFAULT '0',
  linkAmount smallint NOT NULL DEFAULT '0',
  available smallint NOT NULL DEFAULT '0',
  addedTs bigint DEFAULT '0',
  updatedTs bigint DEFAULT '0',
  flavourText varchar(1024) DEFAULT NULL,
  price varchar(128) DEFAULT NULL,
  crafted smallint DEFAULT '0',
  CONSTRAINT Items_ibfk_1 FOREIGN KEY (league) REFERENCES Leagues (leagueName),
  CONSTRAINT Items_ibfk_2 FOREIGN KEY (accountName) REFERENCES Accounts (accountName),
  CONSTRAINT Items_ibfk_3 FOREIGN KEY (stashId) REFERENCES Stashes (stashID)
);

CREATE TYPE modType AS ENUM ('EXPLICIT','IMPLICIT','CRAFTED','ENCHANTED');

CREATE TABLE Mods (
  itemId varchar(128) DEFAULT NULL,
  modName varchar(256) NOT NULL DEFAULT '0',
  modValue1 varchar(256) DEFAULT '0',
  modValue2 varchar(128) DEFAULT '0',
  modValue3 varchar(128) DEFAULT '0',
  modValue4 varchar(128) DEFAULT '0',
  modType modType DEFAULT 'IMPLICIT',
  modKey varchar(128) DEFAULT NULL UNIQUE,
  CONSTRAINT Mods_ibfk_1 FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);


CREATE TABLE Properties (
  itemId varchar(128) DEFAULT NULL,
  propertyName varchar(128) NOT NULL DEFAULT '0',
  propertyValue1 varchar(128) DEFAULT '0',
  propertyValue2 varchar(128) DEFAULT '0',
  propertyKey varchar(128) NOT NULL DEFAULT '' UNIQUE,
  CONSTRAINT Properties_ibfk_1 FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);


CREATE TABLE Requirements (
  itemId varchar(128) DEFAULT NULL,
  requirementName varchar(128) NOT NULL DEFAULT '0',
  requirementValue smallint DEFAULT '0',
  requirementKey varchar(128) NOT NULL DEFAULT '' UNIQUE,
  CONSTRAINT Requirements_ibfk_1 FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);


CREATE TABLE Sockets (
  itemId varchar(128) DEFAULT NULL,
  socketGroup smallint DEFAULT '0',
  socketAttr char(1) DEFAULT NULL,
  socketKey varchar(128) NOT NULL DEFAULT '' UNIQUE,
  CONSTRAINT Sockets_ibfk_1 FOREIGN KEY (itemId) REFERENCES Items (itemId) ON DELETE CASCADE
);


