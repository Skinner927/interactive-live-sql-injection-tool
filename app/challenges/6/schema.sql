-- SQLite
-- noinspection SqlNoDataSourceInspectionForFile
DROP TABLE IF EXISTS users;
CREATE TABLE users (id integer, username text, lastlogin text, password text);


INSERT INTO users VALUES (1, 'Frank', '01-01-2089', '098f6bcd4621d373cade4e832627b4f6');
INSERT INTO users VALUES (2, 'Joe', '05-03-2089', '2ab96390c7dbe3439de74d0c9b0b1767');
INSERT INTO users VALUES (300, 'admin', '03-09-2089', 'aa407e606284780081cbe987386cd385');
INSERT INTO users VALUES (4, 'Stacy', '03-09-2089', '7eaa9bafb41c734fbbf3134588603114');


DROP TABLE IF EXISTS articles;
CREATE TABLE articles (id integer, author integer, body text);

INSERT INTO articles VALUES(1, 1, 'Angola, like many African oil producing nations, is not diversified enough to weather the effects of the weak oil price. The sub-Saharan nation also subsidizes fuel, something the IMF has already warned against.');
INSERT INTO articles VALUES(2, 2, 'Angola last received help from the IMF in 2009 after the global financial crisis. That program was worth $1.4 billion.');
INSERT INTO articles VALUES(3, 4, 'Angola has requested help from the IMF including an "economic program" that could be "supported by financial assistance," according to the IMF. In other words, the country is seeking a bailout.');
