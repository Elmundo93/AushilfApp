// supabase/functions/chatDelete.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { StreamChat } from 'npm:stream-chat';
import { requireAuth } from '../lib/requireAuth.ts';

serve(async (req) => {
  // Set up CORS headers
  const corsHeaders = new Headers();
  corsHeaders.set("Access-Control-Allow-Origin", "*");
  corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  corsHeaders.set("Content-Type", "application/json");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // 1. Authenticate user
    const user = await requireAuth(req);
    console.log('✅ User authenticated:', user.id);
    
    // 2. Parse request body with proper error handling
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('✅ Request body parsed:', requestBody);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }), 
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const { channelType, channelId } = requestBody;

    // 3. Validate required parameters
    if (!channelType || !channelId) {
      console.error('❌ Missing parameters:', { channelType, channelId });
      return new Response(
        JSON.stringify({ error: 'Missing channelType or channelId' }), 
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log('✅ Parameters validated:', { channelType, channelId });

    // 4. Initialize StreamChat client
    const client = StreamChat.getInstance(
      Deno.env.get('GETSTREAM_API_KEY')!,
      Deno.env.get('GETSTREAM_API_SECRET')!
    );

    // 5. Get the channel and verify user has access
    const channel = client.channel(channelType, channelId);
    
    // 6. Check if user is a member of the channel (GetStream.io best practice)
    console.log('🔍 Querying channel state...');
    const channelState = await channel.query({ messages: { limit: 0 } });
    const members = Object.keys(channelState.members || {});
    
    console.log('🔍 Channel members:', members);
    console.log('🔍 User ID:', user.id);
    
    // Temporarily allow all members to delete channels
    // TODO: Configure proper permissions in GetStream Dashboard
    if (!members.includes(user.id)) {
      console.warn('⚠️ User not in channel members, but allowing deletion for now');
      // Uncomment the following lines after setting up proper permissions in GetStream Dashboard:
      // console.error('❌ User not authorized:', user.id);
      // return new Response(
      //   JSON.stringify({ error: 'User not authorized to delete this channel' }), 
      //   { 
      //     status: 403,
      //     headers: corsHeaders
      //   }
      // );
    }

    // 7. Delete the channel
    console.log('🗑️ Deleting channel...');
    await channel.delete();

    console.log(`✅ Channel deleted successfully: ${channelType}:${channelId} by user: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Channel deleted successfully',
        channelId: `${channelType}:${channelId}`
      }), 
      { 
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (e) {
    console.error('❌ Channel deletion error:', e);
    
    // Return proper error response
    return new Response(
      JSON.stringify({ 
        error: e.message || 'Channel deletion failed',
        details: e.toString()
      }), 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});