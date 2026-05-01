-- 1. TABLA DE RASTREO DE RUTA (TELEMETRÍA)
CREATE TABLE IF NOT EXISTS route_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS: Los repartidores solo pueden insertar su propia ubicación
ALTER TABLE route_logs ENABLE ROW LEVEL SECURITY;

-- Verificamos si la política existe antes de crearla para evitar errores
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own logs') THEN
        CREATE POLICY "Users can insert their own logs" ON route_logs
        FOR INSERT WITH CHECK (auth.uid() = profile_id);
    END IF;
END $$;

-- 3. VISTA CORREGIDA PARA EL CÁLCULO DE KILOMETRAJE
-- Esta versión utiliza una CTE para evitar el error de funciones de ventana anidadas
CREATE OR REPLACE VIEW daily_mileage AS
WITH point_distances AS (
    SELECT 
        profile_id,
        organization_id,
        DATE(recorded_at) as log_date,
        ST_Distance(
            location::geography, 
            LAG(location::geography) OVER (
                PARTITION BY profile_id, DATE(recorded_at) 
                ORDER BY recorded_at
            )
        ) as segment_distance
    FROM route_logs
)
SELECT 
    profile_id,
    organization_id,
    log_date,
    COALESCE(SUM(segment_distance), 0) / 1000 as total_km
FROM point_distances
GROUP BY profile_id, organization_id, log_date;