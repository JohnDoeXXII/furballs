DROP SCHEMA shelter CASCADE;

CREATE SCHEMA shelter
    CREATE TABLE animals (
      id uuid   PRIMARY KEY,
      shelter_id text,
      name text,
      dob date,
      type text,
      notes text
    )
    CREATE TABLE contacts (
      id uuid   PRIMARY KEY,
      first_name text,
      last_name text,
      phone text,
      email text
    )
    CREATE TABLE events (
      id uuid   PRIMARY KEY,
      name text,
      description text,
      start_datetime timestamp,
      end_datetime timestamp
    )
    CREATE TABLE users (
      id uuid   PRIMARY KEY,
      username text,
      email text,
      first_name text,
      last_name text,
      is_admin boolean,
      password_hash text,
      password_update_timestamp timestamp
    );
    
INSERT INTO shelter.users VALUES
	('94f74a94-f1ff-4669-bc34-b694639bd3f0',	'admin',	'asdf@asdf.com',	'John',	'Weber',	true,	'90b813664f8cc042cb074f5099b269793c5274c4c7c9f0519f144f93d04ef4f4',	'2025-11-14 15:45:25.390606');
