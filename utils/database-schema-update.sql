-- Database schema update to align is_active field with string usage
-- This updates the subjects table to use VARCHAR instead of BOOLEAN for is_active

-- Step 1: Add a new temporary column for string values
ALTER TABLE public.subjects 
ADD COLUMN is_active_string VARCHAR(10);

-- Step 2: Migrate existing boolean values to string values
UPDATE public.subjects 
SET is_active_string = CASE 
    WHEN is_active = true THEN 'active'
    WHEN is_active = false THEN 'inactive'
    ELSE 'inactive'
END;

-- Step 3: Drop the old boolean column
ALTER TABLE public.subjects 
DROP COLUMN is_active;

-- Step 4: Rename the new column to is_active
ALTER TABLE public.subjects 
RENAME COLUMN is_active_string TO is_active;

-- Step 5: Add constraint to ensure only valid values
ALTER TABLE public.subjects 
ADD CONSTRAINT check_is_active_valid 
CHECK (is_active IN ('active', 'inactive'));

-- The final schema will have:
-- is_active VARCHAR(10) NOT NULL CHECK (is_active IN ('active', 'inactive'))
