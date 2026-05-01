-- TABLA DE REGISTROS DE AUDITORÍA
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    profile_id UUID REFERENCES profiles(id),
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Solo los administradores pueden ver alertas de su empresa
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON audit_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin' 
        AND organization_id = audit_logs.organization_id
    )
);