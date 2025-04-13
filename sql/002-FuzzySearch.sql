ALTER TABLE search
    ADD text varchar;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX search_trgm_idx ON search USING GIN (text gin_trgm_ops);