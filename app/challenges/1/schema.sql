-- SQLite
-- noinspection SqlNoDataSourceInspectionForFile
DROP TABLE IF EXISTS users;
CREATE TABLE users (id integer, username text, password text);


INSERT INTO users VALUES (1, 'admin', 'f9242721e561a7d35f4e512e30129469');
