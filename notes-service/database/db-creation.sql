/*
CREATE USER notetaker_admin WITH PASSWORD 'something';
CREATE DATABASE notetaker;
GRANT ALL PRIVILEGES ON DATABASE notetaker TO notetaker_admin;
*/

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS video_list;
DROP TABLE IF EXISTS users;

/* users */
CREATE TABLE users (
	user_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
	username VARCHAR (50) UNIQUE NOT NULL,
	password VARCHAR (50) NOT NULL
);
INSERT INTO users (
	username,
	password
)
VALUES (
	'gokula.s',
	'samsung'
);

/* `video_list` */
CREATE TABLE video_list (
	video_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
	username VARCHAR (50) REFERENCES users(username),
	youtube_id VARCHAR (20),
	title VARCHAR (50),
	date_created TIMESTAMP
);

/* notes */
CREATE TABLE notes (
	note_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
	video_id UUID REFERENCES video_list(video_id),
	timestamp_ TIME,
	note_ VARCHAR (500)
);
