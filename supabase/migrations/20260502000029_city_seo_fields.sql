-- Phase 2 SEO: add city-specific content fields for CityHub enrichment
ALTER TABLE location_cities
  ADD COLUMN IF NOT EXISTS city_sections jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS key_areas     jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN location_cities.city_sections IS 'Rich content sections for the city hub page — array of {heading, blocks[]} matching the post_sections block schema.';
COMMENT ON COLUMN location_cities.key_areas IS 'Array of {name, description} objects for key business precincts, e.g. [{name: "Fortitude Valley", description: "..."}]';
