DROP SCHEMA shelter CASCADE;

CREATE SCHEMA shelter
    CREATE TABLE animals (id uuid, shelter_id text, name text, dob date, type text, notes text[]);