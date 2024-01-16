DROP TABLE IF EXISTS image64;

CREATE TABLE image64 (
	img_id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
	note_id UUID,
	base64_code TEXT
);
