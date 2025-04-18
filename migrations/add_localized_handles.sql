-- Add localized URL handles to recipe_translations table
ALTER TABLE recipe_translations ADD COLUMN handle TEXT;

-- Create a unique index for handle per locale 
-- This allows the same handle to be used in different languages
CREATE UNIQUE INDEX idx_recipe_translations_locale_handle ON recipe_translations(locale, handle);

-- Create a function to generate a unique handle based on title
CREATE OR REPLACE FUNCTION generate_unique_handle(title TEXT, locale TEXT)
RETURNS TEXT AS $$
DECLARE
  base_handle TEXT;
  unique_handle TEXT;
  counter INT := 0;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens
  base_handle := lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_handle := regexp_replace(base_handle, '\s+', '-', 'g');
  
  -- Start with the base handle
  unique_handle := base_handle;
  
  -- Check for existing handle and add a counter if needed
  WHILE EXISTS (
    SELECT 1 FROM recipe_translations 
    WHERE locale = $2 AND handle = unique_handle
  ) LOOP
    counter := counter + 1;
    unique_handle := base_handle || '-' || counter;
  END LOOP;
  
  RETURN unique_handle;
END;
$$ LANGUAGE plpgsql;

-- Populate existing translations with handles based on their titles
UPDATE recipe_translations
SET handle = generate_unique_handle(title, locale)
WHERE handle IS NULL;

-- Make handle required going forward
ALTER TABLE recipe_translations ALTER COLUMN handle SET NOT NULL;

-- Create an index for faster lookups by handle
CREATE INDEX idx_recipe_translations_handle ON recipe_translations(handle); 