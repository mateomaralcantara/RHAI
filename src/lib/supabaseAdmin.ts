// src/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en variables de entorno')
}

// Cliente ADMIN: usar SIEMPRE en backend (API routes / server actions)
// NUNCA exponer SERVICE_ROLE en el cliente
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})
