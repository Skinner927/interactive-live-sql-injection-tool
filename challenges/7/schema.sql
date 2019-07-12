-- SQLite
-- noinspection SqlNoDataSourceInspectionForFile

-- These first 2 tables are here to screw the user up as they'll be enumerated first
DROP TABLE IF EXISTS passwords_1337;
CREATE TABLE passwords_1337 (id integer, userId integer, hash text);
INSERT INTO passwords_1337 VALUES (1, 1, 'f8853a632dd9848fc74b784c5da76d78');
INSERT INTO passwords_1337 VALUES (2, 2, '4d7d2c8e7ca93db42fb9fe569663ddac');

DROP TABLE IF EXISTS users_1337;
CREATE TABLE users_1337 (id integer, name text, lastlogin text, email text, phoneNumber text, address text, password text, joinDate text);
INSERT INTO users_1337 VALUES (1, 'foo', '2000-01-01', '', '', '', '12a5c82b2b912b51c6cd3dd7beb318fd', '2001-01-01');
INSERT INTO users_1337 VALUES (2, 'bar', '2000-05-03', '', '', '', 'c75e54236423778b78f59c76a1ddd52a', '2001-01-01');

-- Begin real data

DROP TABLE IF EXISTS passwords_7738;
CREATE TABLE passwords_7738 (id integer, userId integer, hash text);
INSERT INTO passwords_7738 VALUES (1, 1, '381a0c68c8997981c3012c78f50c5233');
INSERT INTO passwords_7738 VALUES (2, 200, '6817a5d873b6bacfd950f26a8a1c154b');
INSERT INTO passwords_7738 VALUES (3, 90, '03a69effe70e17962c818ac28e77fc55');
INSERT INTO passwords_7738 VALUES (4, 100, 'fb03964891fa1bb11e3deea31d2058b7');


DROP TABLE IF EXISTS users_7738;
CREATE TABLE users_7738 (id integer, name text, lastlogin text, email text, phoneNumber text, address text, password text, joinDate text);
INSERT INTO users_7738 VALUES (1, 'Frank', '2089-01-01', '', '', '', '381a0c68c8997981c3012c78f50c5233', '2001-01-01');
INSERT INTO users_7738 VALUES (200, 'Joe', '2089-05-03', '', '', '', '6817a5d873b6bacfd950f26a8a1c154b', '2001-01-01');
INSERT INTO users_7738 VALUES (90, 'admin', '2089-03-09', '', '', '', '03a69effe70e17962c818ac28e77fc55', '2001-01-01');
INSERT INTO users_7738 VALUES (100, 'Stacy', '2089-03-09', '', '', '', 'fb03964891fa1bb11e3deea31d2058b7', '2001-01-01');


DROP TABLE IF EXISTS postings_2018;
CREATE TABLE postings_2018 (id integer, authorId integer, lastUpdated text, created text, display integer, body text);
INSERT INTO postings_2018 VALUES(1, 1, '2018-08-22', '2018-07-11', 1, 'Angola, like many African oil producing nations, is not diversified enough to weather the effects of the weak oil price. The sub-Saharan nation also subsidizes fuel, something the IMF has already warned against.');
INSERT INTO postings_2018 VALUES(2, 2, '2018-08-22', '2018-07-11', 1, 'Angola last received help from the IMF in 2009 after the global financial crisis. That program was worth $1.4 billion.');
INSERT INTO postings_2018 VALUES(3, 4, '2018-08-22', '2018-07-11', 1, 'Angola has requested help from the IMF including an "economic program" that could be "supported by financial assistance," according to the IMF. In other words, the country is seeking a bailout.');
