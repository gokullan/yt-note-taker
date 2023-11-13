DROP TABLE IF EXISTS image64

/* notes */
CREATE TABLE notes (
	img_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
	base64_code TEXT
);
