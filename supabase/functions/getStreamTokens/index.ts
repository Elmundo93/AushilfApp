import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { create,  Header } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Load environment variables


serve(async (req: Request) => {
  console.log("Edge function invoked");

  // Set up CORS headers
  const corsHeaders = new Headers();
  corsHeaders.set("Access-Control-Allow-Origin", "*"); // Replace '*' with your app's origin in production
  corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  corsHeaders.set("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    // Handle preflight requests
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Extract JWT from Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or invalid");
    return new Response(
      JSON.stringify({ error: "Not authorized" }),
      { status: 401, headers: corsHeaders }
    );
  }
  const jwt = authHeader.split(" ")[1];

  // Initialize Supabase client
  const supabaseUrl = 'http://host.docker.internal:54321';
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase configuration missing");
    return new Response(
      JSON.stringify({ error: "Supabase configuration missing" }),
      { status: 500, headers: corsHeaders }
    );
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    console.log("Verifying JWT and extracting user ID");
    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) {
      console.error("Invalid token:", error ? error.message : "No user found");
      throw new Error("Invalid token");
    }
    const userId = user.id;
    console.log("User ID:", userId);

    // GetStream configuration
    const apiKey = 'p8vdfnctx7qc'; // Your GetStream API key
    const apiSecret = 'rkprffbdnxyppg8akd28d233vrhtwjr7we3j7rj8k62vmu3jfgvdqgjn2eghju8f'; // Your GetStream API secret

    if (!apiKey || !apiSecret) {
      console.error("GetStream configuration missing");
      return new Response(
        JSON.stringify({ error: "GetStream configuration missing" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Generate GetStream token
    console.log("Generating GetStream token");

    const payload = {
      user_id: userId,
    };

    const header: Header = {
      alg: "HS256",
      typ: "JWT",
    };

    // Encode the API secret using UTF-8
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiSecret);

    // Import the keyData as a CryptoKey
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Create the token
    const streamToken = await create(header, payload, cryptoKey);
    console.log("GetStream token generated");

    return new Response(
      JSON.stringify({ token: streamToken, apiKey }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 401, headers: corsHeaders }
    );
  }
});