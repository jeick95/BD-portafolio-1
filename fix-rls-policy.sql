-- ============================================
-- CORRECCIÓN DE POLÍTICAS RLS PARA TRABAJOS
-- Ejecuta este script en Supabase > SQL Editor
-- ============================================

-- Eliminar TODAS las políticas existentes de trabajos
DROP POLICY IF EXISTS "Todos pueden ver trabajos" ON trabajos;
DROP POLICY IF EXISTS "Admins pueden insertar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Admins pueden gestionar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Solo admins pueden insertar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus trabajos" ON trabajos;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus trabajos" ON trabajos;

-- Permitir que CUALQUIERA pueda insertar trabajos (sin restricción RLS)
CREATE POLICY "Cualquiera puede insertar trabajos"
ON trabajos FOR INSERT
WITH CHECK (true);

-- Permitir que CUALQUIERA pueda ver trabajos
CREATE POLICY "Cualquiera puede ver trabajos"
ON trabajos FOR SELECT
USING (true);

-- Permitir que CUALQUIERA pueda actualizar trabajos
CREATE POLICY "Cualquiera puede actualizar trabajos"
ON trabajos FOR UPDATE
USING (true);

-- Permitir que CUALQUIERA pueda eliminar trabajos
CREATE POLICY "Cualquiera puede eliminar trabajos"
ON trabajos FOR DELETE
USING (true);

-- Mostrar resultado
SELECT 'Políticas RLS actualizadas correctamente' AS resultado;
