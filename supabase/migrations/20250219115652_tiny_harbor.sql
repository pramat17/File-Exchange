-- schema.sql

-- 1. Activer l'extension pgcrypto (pour utiliser gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Créer la table shared_files dans le schéma public
CREATE TABLE IF NOT EXISTS public.shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  storage_path text NOT NULL,
  themes text[] NOT NULL DEFAULT '{}',
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. Activer la Row Level Security sur la table
ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;

-- 4. (Optionnel) Supprimer d'anciennes policies pour éviter des conflits
DROP POLICY IF EXISTS "Anyone can read files" ON public.shared_files;
DROP POLICY IF EXISTS "Anyone can insert files" ON public.shared_files;

-- 5. Créer la policy pour permettre à tout le monde de lire la table
CREATE POLICY "Anyone can read files"
  ON public.shared_files
  FOR SELECT
  TO public
  USING (true);

-- 6. Créer la policy pour permettre l'insertion à la fois pour les rôles anon et authenticated
CREATE POLICY "Anyone can insert files"
  ON public.shared_files
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);