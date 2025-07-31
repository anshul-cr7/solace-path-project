import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using service role key to update user profile
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    console.log("Verifying payment for session:", session_id);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === "paid") {
      const userEmail = session.metadata?.user_email || session.customer_details?.email;
      const userId = session.metadata?.user_id;

      if (!userEmail || !userId) {
        throw new Error("User information not found in session metadata");
      }

      console.log("Payment verified, updating user profile:", userEmail);

      // Update user's premium status in the profiles table
      const { error } = await supabaseClient
        .from("profiles")
        .update({ is_premium: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Successfully updated user premium status");

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Premium access activated successfully!" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});