-- 1. CREAR LA ORGANIZACIÓN (TENANT)
INSERT INTO organizations (id, name, nit, subscription_status)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'Distribuidora Central GT', 
    '9988776-5', 
    'active'
);

-- 2. CREAR PERFILES (ADMIN Y REPARTIDOR)
-- Nota: En un entorno real, estos IDs vienen de la tabla auth.users
INSERT INTO profiles (id, organization_id, full_name, role)
VALUES 
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Henry Chinchilla', 'admin'),
    (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Juan Repartidor', 'repartidor');

-- 3. CREAR CLIENTES CON UBICACIÓN (GEOMETRÍA POSTGIS)
INSERT INTO customers (organization_id, tax_id, business_name, owner_name, location)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001', 
        '1234567-K', 
        'Tienda El Parque', 
        'Don Jose', 
        ST_SetSRID(ST_MakePoint(-90.5132, 14.6418), 4326) -- Parque Central, Zona 1
    ),
    (
        '00000000-0000-0000-0000-000000000001', 
        '7654321-0', 
        'Abarrotes Obelisco', 
        'Doña Maria', 
        ST_SetSRID(ST_MakePoint(-90.5111, 14.5986), 4326) -- El Obelisco, Zona 10
    );

-- 4. SIMULAR TELEMETRÍA (RASTREO)
-- Insertamos puntos de movimiento para que el reporte de liquidación calcule kilometraje
INSERT INTO route_logs (profile_id, organization_id, location, recorded_at)
SELECT 
    p.id, 
    p.organization_id, 
    ST_SetSRID(ST_MakePoint(-90.51 + (random() * 0.01), 14.60 + (random() * 0.01)), 4326),
    NOW() - (interval '1 hour' * i)
FROM profiles p, generate_series(1, 10) i
WHERE p.role = 'repartidor' LIMIT 10;