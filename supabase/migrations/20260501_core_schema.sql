-- ==========================================
-- GEOTRACK TMS: ESQUEMA DE BASE DE DATOS CORE
-- "Control total en cada kilómetro"
-- ==========================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de Organizaciones (Empresas Clientes del SaaS)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    nit TEXT UNIQUE, -- Identificación fiscal de la empresa
    logo_url TEXT,
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'trial')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Perfiles de Usuario (Auth vinculada a la empresa)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'vendedor', 'repartidor')),
    is_active BOOLEAN DEFAULT true,
    last_location GEOGRAPHY(POINT, 4326), -- Ubicación en tiempo real
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Clientes (Puntos de visita/entrega)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    tax_id TEXT NOT NULL, -- NIT o DPI del propietario
    business_name TEXT NOT NULL,
    owner_name TEXT,
    phone TEXT,
    location GEOGRAPHY(POINT, 4326), -- Coordenadas para el Mapa
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Unicidad: No pueden haber dos NIT iguales dentro de la misma empresa
    UNIQUE(organization_id, tax_id)
);

-- 5. SEGURIDAD: PROTECCIÓN ANTI-BORRADO FÍSICO
-- Esta función impide que se use el comando DELETE. Solo se permite borrado lógico.
CREATE OR REPLACE FUNCTION block_physical_delete()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Acceso Denegado: En GeoTrack TMS los registros no se borran, se desactivan lógicamente por seguridad.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_no_delete_customers BEFORE DELETE ON customers FOR EACH ROW EXECUTE FUNCTION block_physical_delete();
CREATE TRIGGER tr_no_delete_profiles BEFORE DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION block_physical_delete();

-- 6. RLS (ROW LEVEL SECURITY): AISLAMIENTO MULTI-EMPRESA
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo ven datos de su propia organización
CREATE POLICY "Tenant Isolation" ON customers
FOR ALL USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Profile Isolation" ON profiles
FOR SELECT USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
-- FUNCIÓN DE SEGURIDAD: BORRADO CON DOBLE LLAVE
-- Requiere dos llaves distintas para ejecutar una limpieza de tablas
CREATE OR REPLACE FUNCTION dangerous_wipe_data(key_one TEXT, key_two TEXT)
RETURNS TEXT AS $$
DECLARE
    -- En producción, estos hashes se comparan contra variables de entorno seguras
    secret_a TEXT := 'FRASE_SECRETA_ADMIN_A'; 
    secret_b TEXT := 'FRASE_SECRETA_ADMIN_B';
BEGIN
    IF key_one = secret_a AND key_two = secret_b THEN
        -- Borrado en cascada de datos operativos, no de configuración
        TRUNCATE TABLE customers, profiles CASCADE;
        RETURN 'Operación exitosa: Base de datos reiniciada bajo protocolo de doble llave.';
    ELSE
        RAISE EXCEPTION 'Error de seguridad: Las llaves de autorización no coinciden.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;