-- Demo shelter data initialization script

DO $$
DECLARE
    now timestamp := CURRENT_TIMESTAMP;
BEGIN
    INSERT INTO shelter.contacts (id, first_name, last_name, phone, email, user_id) VALUES
        (gen_random_uuid(), 'Sarah', 'Johnson', NULL, 'sarah.johnson@example.com', NULL),
        (gen_random_uuid(), 'Michael', 'Chen', '555-0123', NULL, NULL);
    
    INSERT INTO shelter.animals (id, shelter_id, name, dob, date_of_intake, type, notes) VALUES
        (gen_random_uuid(), '25-001', 'Buddy', (now - INTERVAL '3 years')::date, (now - INTERVAL '25 days')::date, 'Dog', 'Friendly golden retriever mix, great with kids'),
        (gen_random_uuid(), '25-002', 'Luna', (now - INTERVAL '1 year 8 months')::date, (now - INTERVAL '18 days')::date, 'Cat', 'Playful kitten, loves toys'),
        (gen_random_uuid(), '25-003', 'Max', (now - INTERVAL '5 years 6 months')::date, (now - INTERVAL '10 days')::date, 'Dog', 'Energetic border collie, needs active home'),
        (gen_random_uuid(), '25-004', 'Bella', (now - INTERVAL '7 years')::date, (now - INTERVAL '3 days')::date, 'Dog', 'Senior dog, very gentle and quiet'),
        (gen_random_uuid(), '25-005', 'Whiskers', (now - INTERVAL '2 years 3 months')::date, (now - INTERVAL '5 days')::date, 'Cat', 'Calm and affectionate tabby'),
        (gen_random_uuid(), '25-006', 'Shadow', (now - INTERVAL '4 years 2 months')::date, (now - INTERVAL '28 days')::date, 'Cat', 'Independent black cat, good mouser');
    
END $$;
