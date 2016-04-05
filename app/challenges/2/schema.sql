-- SQLite
-- noinspection SqlNoDataSourceInspectionForFile
DROP TABLE IF EXISTS users;
CREATE TABLE users (id integer, username text, password text);


INSERT INTO users VALUES (1, 'frank', '098f6bcd4621d373cade4e832627b4f6');
INSERT INTO users VALUES (2, 'admin', '32dc710633eb1542f4a28a442b604ad0');
INSERT INTO users VALUES (3, 'joe', '2ab96390c7dbe3439de74d0c9b0b1767');
