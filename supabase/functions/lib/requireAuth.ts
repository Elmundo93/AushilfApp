import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header missing or invalid");
  }
  const jwt = authHeader.split(" ")[1];

  // Load environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration missing");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log("Verifying JWT and extracting user ID");
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) {
      console.error("Invalid token:", error ? error.message : "No user found");
      throw new Error("Invalid token");
    }
    
    console.log("User authenticated:", user.id);
    return user;
  } catch (e) {
    console.error("Auth error:", e);
    throw new Error("Token ungültig oder fehlerhaft: " + String(e));
  }
}