-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your admissions documents and their embeddings
CREATE TABLE admissions_knowledge (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,          -- The chunk of text from FAQs, admission policies, etc.
  metadata JSONB,                 -- e.g., source URL, specific exam tag (JEE, NEET), state
  embedding VECTOR(768)           -- Gemini embeddings are 768 dimensions
);

-- Note: Google's text-embedding-004 model outputs 768 dimensions

-- Create a function to similarity search for embeddings
CREATE OR REPLACE FUNCTION match_admissions_knowledge (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    metadata,
    1 - (admissions_knowledge.embedding <=> query_embedding) AS similarity
  FROM admissions_knowledge
  WHERE 1 - (admissions_knowledge.embedding <=> query_embedding) > match_threshold
  ORDER BY admissions_knowledge.embedding <=> query_embedding
  LIMIT match_count;
$$;
