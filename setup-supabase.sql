-- ============================================
-- CONFIGURACIÓN DE SUPABASE
-- Ejecuta este script en Supabase > SQL Editor
-- ============================================

-- 1. Agregar columna github_url
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS github_url TEXT;

-- 2. Agregar columna repositorio_url
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS repositorio_url TEXT;

-- 3. Deshabilitar RLS para trabajos
ALTER TABLE trabajos DISABLE ROW LEVEL SECURITY;
