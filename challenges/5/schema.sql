-- SQLite
-- noinspection SqlNoDataSourceInspectionForFile
DROP TABLE IF EXISTS users;
CREATE TABLE users (id integer, username text, lastlogin text, password text);


INSERT INTO users VALUES (1, 'frank', '2089-01-01', '098f6bcd4621d373cade4e832627b4f6');
INSERT INTO users VALUES (2, 'joe', '2089-05-03', '2ab96390c7dbe3439de74d0c9b0b1767');
INSERT INTO users VALUES (3, 'admin', '2089-03-09', 'a4d731d37c88f9c4acc6dfbcedaf3eb6');


DROP TABLE IF EXISTS articles;
CREATE TABLE articles (id integer, author text, body text);

INSERT INTO articles VALUES(1, 'Frank', 'Angola, like many African oil producing nations, is not diversified enough to weather the effects of the weak oil price. The sub-Saharan nation also subsidizes fuel, something the IMF has already warned against.');
INSERT INTO articles VALUES(2, 'Jane', 'Angola last received help from the IMF in 2009 after the global financial crisis. That program was worth $1.4 billion.');
INSERT INTO articles VALUES(3, 'Arnold', 'Angola has requested help from the IMF including an "economic program" that could be "supported by financial assistance," according to the IMF. In other words, the country is seeking a bailout.');
INSERT INTO articles VALUES(4, 'Lucy', 'Africa''s second largest oil producer has been running out of cash since the crash in oil prices that began in 2014. Oil accounts for about 75% of government income and 95% of export revenues.');
