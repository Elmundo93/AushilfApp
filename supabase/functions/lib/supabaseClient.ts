// supabase/functions/lib/supabaseClient.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);