-- Fix missing columns in subjects table
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS course text,
ADD COLUMN IF NOT EXISTS semester numeric;

-- Fix is_active column type
ALTER TABLE public.subjects 
ALTER COLUMN is_active TYPE text USING CASE WHEN is_active = true THEN 'active' ELSE 'inactive' END;

-- Insert sample subjects for testing
INSERT INTO public.subjects (name, code, is_active, course, semester) VALUES
('Mathematics', 'MATH101', 'active', 'Diploma In Electronics', 1),
('Physics', 'PHY101', 'active', 'Diploma In Electronics', 1),
('Chemistry', 'CHE101', 'active', 'Diploma In Electronics', 1),
('Computer Science', 'CS101', 'active', 'Diploma In Electronics', 1),
('English', 'ENG101', 'active', 'Diploma In Electronics', 1);
