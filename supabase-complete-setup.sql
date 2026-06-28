-- ============================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE
-- Ejecuta este script en Supabase > SQL Editor
-- ============================================

-- 1. Agregar columna github_url si no existe
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS github_url TEXT;

-- 2. Asegurar que repositorio_url existe
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS repositorio_url TEXT;

-- 3. Deshabilitar RLS para trabajos (permite inserts sin restricciones)
ALTER TABLE trabajos DISABLE ROW LEVEL SECURITY;

-- 4. Verificar la estructura de la tabla trabajos
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'trabajos' 
ORDER BY ordinal_position;

-- Resultado esperado:
-- id, user_id, titulo, semana, descripcion, curso, url, nombre, repositorio_url, github_url, created_at, updated_at
