DROP SCHEMA shelter CASCADE;

CREATE SCHEMA shelter
    CREATE TABLE animals (id uuid, shelter_id text, name text, dob date, type text, notes text)
    CREATE TABLE contacts (id uuid, first_name text, last_name text, phone text, email text)
    CREATE TABLE events (id uuid, name text, description text, start_datetime timestamp, end_datetime timestamp);
