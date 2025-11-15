DROP SCHEMA shelter CASCADE;

CREATE SCHEMA shelter
    CREATE TABLE users (
      id uuid   PRIMARY KEY,
      username text,
      email text,
      first_name text,
      last_name text,
      is_admin boolean,
      phone text,
      password_hash text,
      password_update_timestamp timestamp
    )
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
      email text,
      user_id uuid,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
    CREATE TABLE events (
      id uuid   PRIMARY KEY,
      name text,
      description text,
      start_datetime timestamp,
      end_datetime timestamp
    );
    
INSERT INTO shelter.users VALUES
	('94f74a94-f1ff-4669-bc34-b694639bd3f0',	'admin',	'asdf@asdf.com',	'John',	'Weber',	true,	NULL,	'e432acea851335940644a6e46e306e549bb56c84da544f64ed57df304694b1ba',	'2025-11-14 15:45:25.390606');
