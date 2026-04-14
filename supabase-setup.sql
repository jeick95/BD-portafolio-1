-- ============================================
-- BASE DE DATOS PARA DESARROLLO DE APLICACIONES
-- Versión Unificada: perfiles + trabajos
-- ============================================

-- Limpieza previa
DROP TABLE IF EXISTS public.actividades CASCADE;
DROP TABLE IF EXISTS public.trabajos CASCADE;
DROP TABLE IF EXISTS public.archivos CASCADE;
DROP TABLE IF EXISTS public.perfiles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- 1. Tabla de perfiles de usuarios
CREATE TABLE public.perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    nombre TEXT,
    carrera TEXT,
    rol TEXT DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de trabajos (antes archivos)
CREATE TABLE public.trabajos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    semana TEXT NOT NULL,
    descripcion TEXT,
    curso TEXT,
    url TEXT,
    nombre TEXT, -- Nombre del archivo en storage
    repositorio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de actividades (logs)
CREATE TABLE public.actividades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES perfiles(id),
    accion TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, email, nombre, rol)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
        CASE 
            WHEN NEW.email = 'luffyjeick95074ku@gmail.com'
              OR NEW.email = 't01256d@ms.upla.edu.pe' 
              OR NEW.email = 'aranda@gmail.com' 
              OR NEW.email = 'arandat@gmail.com' THEN 'admin'
            ELSE 'usuario'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
DROP TRIGGER IF EXISTS update_perfiles_updated_at ON perfiles;
CREATE TRIGGER update_perfiles_updated_at
    BEFORE UPDATE ON perfiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_trabajos_updated_at ON trabajos;
CREATE TRIGGER update_trabajos_updated_at
    BEFORE UPDATE ON trabajos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Usuarios pueden ver todos los perfiles"
    ON perfiles FOR SELECT
    USING (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON perfiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Solo admins pueden insertar perfiles"
    ON perfiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM perfiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
        OR auth.uid() = id
    );

-- Políticas para trabajos
CREATE POLICY "Todos pueden ver trabajos"
    ON trabajos FOR SELECT
    USING (true);

-- Eliminamos las anteriores para evitar conflictos
DROP POLICY IF EXISTS "Solo admins pueden insertar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Solo admins pueden actualizar trabajos" ON trabajos;
DROP POLICY IF EXISTS "Solo admins pueden eliminar trabajos" ON trabajos;

-- Nueva política de inserción: El usuario debe ser el dueño (user_id) Y ser admin en su perfil
CREATE POLICY "Admins pueden insertar trabajos"
ON trabajos FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM perfiles
        WHERE id = auth.uid() AND rol = 'admin'
    )
);

-- Nueva política de actualización y borrado para admins
CREATE POLICY "Admins pueden gestionar trabajos"
ON trabajos FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM perfiles
        WHERE id = auth.uid() AND rol = 'admin'
    )
);

CREATE POLICY "Usuarios pueden crear actividades propias"
    ON actividades FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Crear usuario admin (después de registrarse con el email luffyjeick95074ku@gmail.com)
-- NOTA: Ejecutar esto manualmente después de que el admin se registre:
-- UPDATE perfiles SET rol = 'admin', nombre_completo = 'Administrador' WHERE email = 'luffyjeick95074ku@gmail.com';

-- Buckets para Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('archivos', 'archivos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para Storage
CREATE POLICY "Cualquiera puede subir archivos"
    ON storage.objects FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Cualquiera puede ver archivos públicos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'archivos' OR bucket_id = 'avatars');

CREATE POLICY "Solo admins pueden eliminar archivos"
    ON storage.objects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM perfiles
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );
