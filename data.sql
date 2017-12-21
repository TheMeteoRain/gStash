INSERT INTO ChangeId(next_change_id, processed) VALUES('0', '0');

INSERT INTO Leagues(league_name, active)
VALUES ('Standard', '1'), ('Hardcore', '1'), ('SSF Standard', '1'), ('SSF Hardcore', '1'),
('Harbinger', '1'), ('Hardcore Harbinger', '1'), ('SSF Harbinger', '1'), ('SSF Harbinger HC', '1'),
('Legacy', '1'), ('Hardcore Legacy', '1'), ('SSF Legacy', '1'), ('SSF HC Legacy', '1');

INSERT INTO FrameType(id, frame_type_value)
VALUES (0, 'Normal'), (1, 'Magic'), (2, 'Rare'), (3, 'Unique'), (4, 'Gem'), (5,'Currency'), (6, 'Divination card'),
(7,'Quest item'), (8, 'Prophecy'), (9, 'Relic');

INSERT INTO ValueType
VALUES (0, 'Default'), (1, 'Augmented'), (2, 'Unmet'), (3, 'Physical'), (4, 'Fire'), (5, 'Cold'), (6, 'Lightning'), (7, 'Chaos');