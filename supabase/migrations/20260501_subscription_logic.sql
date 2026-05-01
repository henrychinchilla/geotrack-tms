-- 1. FUNCIÓN PARA VERIFICAR EL ESTADO DE LA SUSCRIPCIÓN
-- Esta función se ejecuta en cada consulta para validar que la empresa está activa
CREATE OR REPLACE FUNCTION check_subscription_active() 
RETURNS BOOLEAN AS $$
DECLARE
    org_status TEXT;
    user_org_id UUID;
BEGIN
    -- Obtener la organización del usuario actual
    SELECT organization_id INTO user_org_id FROM profiles WHERE id = auth.uid();
    
    -- Obtener el estado de esa organización
    SELECT subscription_status INTO org_status FROM organizations WHERE id = user_org_id;

    -- Si es 'active', permite el paso; de lo contrario, bloquea
    RETURN (org_status = 'active');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. ACTUALIZAR POLÍTICAS DE SEGURIDAD (RLS) PARA CLIENTES
-- Ahora, para ver o crear clientes, no basta con ser de la misma empresa; la suscripción debe estar pagada
DROP POLICY IF EXISTS "Tenant Isolation" ON customers;

CREATE POLICY "Tenant Isolation with Subscription Check" ON customers
FOR ALL USING (
    organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND check_subscription_active() = true
);

-- 3. APLICAR LO MISMO PARA LA TABLA DE RASTREO (TELEMETRÍA)
-- Si no pagan, el mapa deja de recibir puntos de GPS
DROP POLICY IF EXISTS "Users can insert their own logs" ON route_logs;

CREATE POLICY "Telemetry with Subscription Check" ON route_logs
FOR INSERT WITH CHECK (
    auth.uid() = profile_id 
    AND check_subscription_active() = true
);

-- 4. COMENTARIO DE AUDITORÍA
COMMENT ON FUNCTION check_subscription_active IS 'Valida el estado de pago del Tenant antes de permitir cualquier operación de base de datos.';