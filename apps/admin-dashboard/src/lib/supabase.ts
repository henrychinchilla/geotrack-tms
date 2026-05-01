import { createClient } from '@supabase/supabase-js';

// Estas variables las configuramos en el paso anterior en Vercel
const supabaseUrl = https://ryiadkbddanuyjrqzoxn.supabase.co || '';
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aWFka2JkZGFudXlqcnF6b3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTQxNzgsImV4cCI6MjA5MzIzMDE3OH0.vlN2JPzcvXdV8Zp9E9vBWYCmOKw3PxBJMF3Jvam1UDQ || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Atención: Faltan las variables de entorno de Supabase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);