-- Run this to able mods INDEX
DELETE FROM items WHERE item_id='d61da408345142587e08123703549074339231553d7d824aee139b0f9f3c2f66';

-- Change all tables to UNLOGGED
ALTER TABLE leagues SET UNLOGGED;
ALTER TABLE accounts SET UNLOGGED;
ALTER TABLE change_id SET UNLOGGED;
ALTER TABLE value_type SET UNLOGGED;
ALTER TABLE frame_type SET UNLOGGED;
ALTER TABLE stashes SET UNLOGGED;
ALTER TABLE items SET UNLOGGED;
ALTER TABLE sockets SET UNLOGGED;
ALTER TABLE properties SET UNLOGGED;
ALTER TABLE requirements SET UNLOGGED;
ALTER TABLE mods SET UNLOGGED;

-- Fill document attributes
UPDATE items SET document = to_tsvector(name || '. ' || type_line);

-- Create special indexes
CREATE INDEX idx_fts_search ON items USING gin(document) WHERE document IS NOT NULL;
CREATE INDEX idx_variable_data ON items USING gin (variable_data) WHERE variable_data IS NOT NULL;
CREATE INDEX idx_socket_amount ON items (((variable_data ->> 'socket_amount')::int)) WHERE (variable_data ->> 'socket_amount') IS NOT NULL;
CREATE INDEX idx_link_amount ON items (((variable_data ->> 'link_amount')::int)) WHERE (variable_data ->> 'link_amount') IS NOT NULL;

-- Add Primary keys
ALTER TABLE items ADD PRIMARY KEY (item_id);
ALTER TABLE mods ADD PRIMARY KEY (item_id, mod_name, mod_type);
ALTER TABLE properties ADD PRIMARY KEY (item_id, property_name);
ALTER TABLE requirements ADD PRIMARY KEY (item_id, requirement_name);
ALTER TABLE sockets ADD PRIMARY KEY (item_id, socket_order, socket_attr);

-- Add constraints
ALTER TABLE items ADD CONSTRAINT items_ibfk_1 FOREIGN KEY (league) REFERENCES leagues (league_name);
ALTER TABLE items ADD CONSTRAINT items_ibfk_2 FOREIGN KEY (account_name) REFERENCES accounts (account_name);
ALTER TABLE items ADD CONSTRAINT items_ibfk_3 FOREIGN KEY (stash_id) REFERENCES stashes (stash_id) ON DELETE CASCADE;
ALTER TABLE mods ADD CONSTRAINT mods_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE;
ALTER TABLE properties ADD CONSTRAINT properties_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE;
ALTER TABLE requirements ADD CONSTRAINT requirements_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE;
ALTER TABLE sockets ADD CONSTRAINT sockets_ibfk_1 FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE