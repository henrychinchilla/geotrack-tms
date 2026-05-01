-- TRIGGER PARA VALIDAR CREACIÓN DE USUARIOS
-- Asegura que un Admin no pueda crear a un Super-Admin
CREATE OR REPLACE FUNCTION validate_user_role() 
RETURNS TRIGGER AS $$
BEGIN
    -- El Administrador de empresa solo puede crear Vendedores o Repartidores
    IF (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' AND NEW.role = 'super_admin' THEN
        RAISE EXCEPTION 'Permiso denegado: No puedes crear usuarios con privilegios superiores.';
    END IF;

    -- Forzar que el nuevo usuario pertenezca a la misma organización que su creador
    NEW.organization_id := (SELECT organization_id FROM profiles WHERE id = auth.uid());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_validate_role
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION validate_user_role();