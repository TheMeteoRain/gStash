# Path of Exile API

items has category property
http://api.pathofexile.com/leagues?type=main&compact=1
postgraphile -c postgres://localhost:5432/poe --watch
postgraphql -c postgres://localhost:5432/poe --watch
28.12.2017
download speed: 3 seconds
parsing speed: 0.150 seconds
saving speed: 14 seconds < create sql files

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

When a change is made to a stash, the entire stash is sent in an update. If you wish to track historical items, you will need to compare the previous items in the stash to the current items in the stash, otherwise you can simply delete any items matching the stash id and insert the new items.

Sources:
https://pathofexile.gamepedia.com/Item
https://pathofexile.gamepedia.com/Public_stash_tab_API
https://www.reddit.com/r/pathofexiledev/comments/55xrd7/how_to_get_started_reading_the_stash_api/
https://www.reddit.com/r/pathofexile/comments/6q941j/discussion_the_publicstashtabs_api_is_a_good/
http://poe.trade/html/tags.html

divination card art: http://www.pathofexile.com/image/gen/divination_cards/TheScarredMeadow.png
http://www.pathofexile.com/image/Art/2DItems/Divination/Images/DivinationCard.png?scale=1?1516225861000

# Database

## Item

**additional_properties**: Current item experience, required experience for next the level and progress in percents. [See properties](#properties). <br />
**art_filename**: Divination card art url. <br />
**corrupted**: Self explanatory. <br />
**cosmetic_mods**: Self explanatory. [See mods](#mods). <br />
**crafted_mods**: Master mods. [See mods](#mods). <br />
**descr_text**: Help text for an item "Right click to drink.", "Place into an item socket of the right colour to gain this skill." <br />
**duplicated**: Is item mirrored. <br />
**enchanted_mods**: Labyrinth mods. [See mods](#mods). <br />
**explicit_mods**: [See mods](#mods). <br />
**flavour_text**: Flavour text is present on unique items, to make them feel more distinct. <br />
**frame_type**: Item rarity (0 = Normal, 1 = Magic, 2 = Rare, 3 = Unique, 4 = Gem, 5 = Currency, 6 = Divination Card, 7 = Quest item, 8 = Prophecy item). <br />
**h**: Item slot height in inventory. <br />
**icon**: Item art url. <br />
**item_id**: Unique item id, will change if you use currency on it. <br />
**identified**: Is item identified. <br />
**ilvl**: Item level. <br />
**implicit_mods**: [See mods](#mods). <br />
**inventory_id**: slot? <br />
**is_relic**: Is item relic. Relics are unique items that have their original balance values. <br />
**league**: Item league (Standard/Hardcore/Leagcy/...) <br />
**locked_to_character**: useless <br />
**max_stack_size**: Item max stack size. usually present on currencies. <br />
**name**: Unique item's name. <br />
**next_level_requirements**: [See requirements](#requirements). <br />
**note**: Item note. People can set a note to item in stash. This is a typical way to set itemThere are two local tags: `~b/o` which specifies buyout price and `~price` which specifies a non-negotiable buyout price. <br />
**properties**: Array of properties. See properties(#properties). <br />
**prophecy_diff_text**: Prophecy difficulty text	??? <br />
**prophecy_text**: Self explanatory. <br />
**requirements**: [See requirements](#requirements). <br />
**sec_description_text**: Skill gem description. <br />
**~~socketed_items~~**: List of items(gems) socketed on an item. <br />
**sockets**: Array of sockets. [See sockets](#sockets). <br />
**stack_size**: Item current stack size. Usually present on currencies. <br />
**support**: Is item a skill gem or a support gem. Only relevant for gems. <br />
**talisman_tier**: Number representation of talisman's tier. Higher is better. <br />
**type_line**: Item name. Might contain localization `<<set:MS>><<set:M>><<set:S>>`, you can strip these. <br />
**utility_mods**: Flask utility mods. [See mods](#mods). <br />
**verified**: BS property. <br />
**w**: Item slot width in inventory. <br />
**x**: Item X coordinate in stash tab. <br />
**y**: Item Y coordinate in stash tab. <br />

## Requirements
**_item_id_**: Self explanatory. <br />
**requirement_name**: Name of the requirement (Level/Str/Dex/Int). <br />
**requirement_value**: Value representation of requirement condition. <br />
**requirement_value_type**: Signle [value type](#value-type). Display style, which dictates which colour should be used when displaying the value. <br />
**requirement_display_mode**: Dictates how requirement is displayed. [See display mode](#display-mode). <br />
**requirement_key**: Requirement's unique id. <br />
**~~requirement_type~~**: "type" is an internal thing to keep track of what the property is actually referencing (name can be localised). <br />

## Properties
**_item_id_**: Self explanatory. <br />
**property_name**: Name of the property. <br />
**property_value1**: First value of property (always present). <br />
**property_value2**: Second value of property (not always present). <br />
**property_value_types**: Array of [value types](#value-type). Display style, which dictates which colour should be used when displaying the value. <br />
**property_display_mode**: Dictates how requirement is displayed. [See display mode](#display-mode). <br />
**property_progress**: Additional properties's Experience	. <br />
**_property_key_**: Property's unique id. <br />
**~~requirement_type~~**: "type" is an internal thing to keep track of what the property is actually referencing (name can be localised). <br />

## Mods
**_item_id_**: Self explanatory. <br />
**mod_name**: Name of the modifier. <br />
**mod_value1**: First value of modifier. <br />
**mod_value2**: Second value of modifier. <br />
**mod_value3**: Third value of modifier. <br />
**mod_value4**: Fourth value of modifier. <br />
**mod_type**: EXPLICIT/IMPLICIT/CRAFTED/ENCHANTED. <br />
**mod_key**: Modifier's uique id. <br />

## Sockets
**_item_id_**: Self explanatory. <br />
**socket_group**: . <br />
**socket_attr**: First character of socket's attribute color (S/D/I/G). <br />
**socket_key**: Socket's unique id. <br />

#### Value type
0 = Default #FFFFFF 1 = Augmented #8888FF 2 = Unmet #D20000 3 = Physical Damage #FFFFFF 4 = Fire Damage #960000 5 = Cold Damage #366492 6 = Lightning Damage #FFD700 7 = Chaos Damage #D02090

#### Display mode
0 means name should go before the values. 1 means name should go after the values. 2 is a progress bar (for skill gem experience). 3 means that the name should have occurances of %1, %2, etc replaced with the values.
