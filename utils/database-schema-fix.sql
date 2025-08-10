-- Updated database schema to fix missing columns in subjects table

-- Add missing columns to subjects table
ALTER TABLE public.subjects 
ADD COLUMN IF NOT EXISTS course text,
ADD COLUMN IF NOT EXISTS semester numeric;

-- Update attendance table to use proper data types
ALTER TABLE public.attendance 
ALTER COLUMN semester TYPE numeric USING semester::numeric;

-- Ensure all tables have proper foreign key relationships
ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_subject_id_fkey 
FOREIGN KEY (subject_id) REFERENCES public.subjects(id);

ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id);
