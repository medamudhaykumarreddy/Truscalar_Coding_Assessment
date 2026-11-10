-- Seed: 001_seed_data.sql
-- Description: Idempotent seed data for departments and faculty

-- Insert Departments
INSERT INTO departments (code, name, building, contact_email)
VALUES
    ('CSE', 'Computer Science & Engineering', 'Alan Turing Block', 'cse-dept@university.edu'),
    ('ECE', 'Electronics & Communication Engineering', 'Nikola Tesla Hall', 'ece-dept@university.edu'),
    ('MECH', 'Mechanical Engineering', 'James Watt Complex', 'mech-dept@university.edu'),
    ('CIVIL', 'Civil & Environmental Engineering', 'Smeaton Hall', 'civil-dept@university.edu'),
    ('MATH', 'Applied Mathematics & Statistics', 'Ramanujan Science Tower', 'math-dept@university.edu')
ON CONFLICT (code) DO NOTHING;

-- Insert Initial Faculty Members (linking with existing department IDs)
INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-CSE-001',
    'Dr. Aris Thorne',
    'aris.thorne@university.edu',
    '+1 (555) 234-5678',
    d.id,
    'Professor & HOD',
    'Distributed Systems & Cloud Architecture',
    16,
    'ACTIVE'
FROM departments d WHERE d.code = 'CSE'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-CSE-002',
    'Dr. Elena Rostova',
    'elena.rostova@university.edu',
    '+1 (555) 345-6789',
    d.id,
    'Associate Professor',
    'Artificial Intelligence & Deep Learning',
    18,
    'ACTIVE'
FROM departments d WHERE d.code = 'CSE'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-CSE-003',
    'Prof. Marcus Vance',
    'marcus.vance@university.edu',
    '+1 (555) 456-7890',
    d.id,
    'Assistant Professor',
    'Database Systems & Query Optimization',
    20,
    'ACTIVE'
FROM departments d WHERE d.code = 'CSE'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-ECE-001',
    'Dr. Sophia Chen',
    'sophia.chen@university.edu',
    '+1 (555) 567-8901',
    d.id,
    'Professor',
    'VLSI Design & Embedded Systems',
    16,
    'ACTIVE'
FROM departments d WHERE d.code = 'ECE'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-ECE-002',
    'Prof. David Kim',
    'david.kim@university.edu',
    '+1 (555) 678-9012',
    d.id,
    'Assistant Professor',
    'Digital Signal Processing & RF Communication',
    22,
    'ACTIVE'
FROM departments d WHERE d.code = 'ECE'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-MECH-001',
    'Dr. Julian Sterling',
    'julian.sterling@university.edu',
    '+1 (555) 789-0123',
    d.id,
    'Professor & Dean',
    'Thermal Dynamics & Aerospace Propulsion',
    14,
    'ACTIVE'
FROM departments d WHERE d.code = 'MECH'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-MATH-001',
    'Dr. Sarah Al-Mansoor',
    'sarah.almansoor@university.edu',
    '+1 (555) 890-1234',
    d.id,
    'Associate Professor',
    'Combinatorics & Graph Algorithms',
    18,
    'ACTIVE'
FROM departments d WHERE d.code = 'MATH'
ON CONFLICT (faculty_code) DO NOTHING;

INSERT INTO faculty (faculty_code, full_name, email, phone, department_id, designation, specialization, max_weekly_hours, status)
SELECT
    'FAC-CIVIL-001',
    'Prof. Robert Hayes',
    'robert.hayes@university.edu',
    '+1 (555) 901-2345',
    d.id,
    'Assistant Professor',
    'Structural Engineering & Seismic Analysis',
    20,
    'ON_LEAVE'
FROM departments d WHERE d.code = 'CIVIL'
ON CONFLICT (faculty_code) DO NOTHING;
