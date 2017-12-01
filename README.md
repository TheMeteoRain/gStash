# Path of Exile API

Database
Stashes : The stash unique id, the stash name, the stash type and wether it is public or not
Sockets : The item id, the socket group, the socket type and a socket unique id
Requirements : The item id, the requirement name, its value and a requirement unique id
Properties : The item id, the property name, its values (max 2 of them) and a property unique id
Mods : The item id, the mod name, its values (max 4 of them), its type and a mod unique id
Items : Basically every fields in an item with price
Leagues : The league name, and wether or not it is active
ChangeId : Contains the next changeId and wether it was processed by the indexer or not
Accounts : Which stores every account name, the last character used with this account and the last time seen online

Useful information
1. The "name" field sometimes contains a custom markup to support localisation in other languages. If you're only interested in English, then it's safe to strip the markup out (anything between "<" and ">" should suffice).
2. The Public Stash Tab API contains no historical data, everything you receive is in it's current state. You can assume that any item you retrieve through the API is verified, at least until the stash tab itself is present in a future update. "w" and "h" do indeed refer to the items size when in your inventory.
3. The "sockets" field is an array of sockets, which in turn belong to a group. All sockets in the same group are linked. The "attr" in the group refers to the attribute of the socket, "D" standing for "Dexterity" in this case (a green socket). "I" (blue), "S" (red), and "G" (white) are the other ones you'll find here.
4. It's safe to ignore the "lockedToCharacter" field. It should probably be removed from the output it if it's false... A good point!
5. There's a few parts to this one! "displayMode" can be four things: 0 means name should go before the values. 1 means name should go after the values. 2 is a progress bar (for skill gem experience). 3 means that the name should have occurances of %1, %2, etc replaced with the values. "type" is an internal thing to keep track of what the property is actually referencing (name can be localised). The last value in "values" is the display style, which dictates which colour should be used when displaying the value. I've included all the relevant information here before. 0 = Default #FFFFFF 1 = Augmented #8888FF 2 = Unmet #D20000 3 = Physical Damage #FFFFFF 4 = Fire Damage #960000 5 = Cold Damage #366492 6 = Lightning Damage #FFD700 7 = Chaos Damage #D02090 "frameType" is reasonably self explanatory, the "x" and "y" is the location of the item inside the stash tab. 0 = Normal 1 = Magic 2 = Rare 3 = Unique 4 = Gem 5 = Currency 6 = Divination Card 7 = Quest 8 = Prophecy

## Database

### Item
| Column                  | Type                   |      Description      |
| ----------------------- |:----------------------:| ---------------------:|
| additional_properties   | see properties table   | see properties table |
| art_filename            | string                 | divination card ar |
| corrupted               | boolean                | |
| cosmetic_mods           | see mods table         | see mods table |
| crafted_mods            | see mods table         | master mods |
| descr_text              | string                 | description text |
| duplicated              | boolean                | item is mirrored   |
| enchanted_mods          | see mods table         | labyrinth mods |
| explicit_mods           | see mods table         | $1 |
| flavour_text            | string                 | flavour text is present on unique items |
| frame_type              | smallint               | item rarity (0 = Normal 1 = Magic 2 = Rare 3 = Unique 4 = Gem 5 = Currency 6 = Divination Card 7 = Quest 8 = Prophecy) |
| h                       | smallint               | slot height |
| icon                    | string                 | item picture art |
| item_id                 | string                 | item id, will change if you use currency on it |
| identified              | boolean                | $1 |
| ilvl                    | smallint               | item level  |
| implicit_mods           | see mods table         | $1 |
| inventory_id            | string                 | $ |
| is_relic                | boolean                | $1 |
| league                  | string                 | standard/hardcore |
| locked_to_character     | boolean                | $1 |
| max_stack_size          | smallint               | $1 |
| name                    | string                 | unique item's name |
| next_level_requirements | see requirements table | $1 |
| note                    | string                 | usually used to display price |
| properties              | see properties table   | see properties table |
| prophecy_diff_text      | string                 | $1 |
| prophecy_text           | string                 | $1 |
| requirements            | see requirements table | $1 |
| sec_description_text    | string                 | $1 |
| socketed_items          | are                    | $1 |
| sockets                 | see sockets table      | $1 |
| stack_size              | smallint               | $1 |
| support                 | boolean                | $1 |
| talisman_tier           | smallint               | $1 |
| type_line               | string                 | $1 |
| utility_mods            | see mods table         | $1 |
| verified                | boolean                | whether or not the item is actually owned by the player at the time (irrelevant for the Stash Tab API) |
| w                       | smallint               | slow width |
| x                       | smallint               | stash position x |
| y                       | smallint               | $1 |
