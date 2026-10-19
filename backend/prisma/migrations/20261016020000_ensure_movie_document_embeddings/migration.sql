BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "MovieDocument"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1536),
  ADD COLUMN IF NOT EXISTS "embeddingModel" TEXT,
  ADD COLUMN IF NOT EXISTS "embeddedContentHash" TEXT,
  ADD COLUMN IF NOT EXISTS "embeddedAt" TIMESTAMP(3);

-- An existing column must have the same dimensions as the embedding service.
DO $$
BEGIN
  IF (
    SELECT format_type(atttypid, atttypmod)
    FROM pg_attribute
    WHERE attrelid = '"MovieDocument"'::regclass
      AND attname = 'embedding'
      AND NOT attisdropped
  ) IS DISTINCT FROM 'vector(1536)' THEN
    RAISE EXCEPTION 'MovieDocument.embedding must use vector(1536)';
  END IF;
END $$;

COMMIT;
