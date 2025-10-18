import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    const emailContent = `
      New Contact Form Submission
      
      From: ${formData.name} (${formData.email})
      Subject: ${formData.subject}
      
      Message:
      ${formData.message}
      
      ---
      Sent from Omkar Kadam's Portfolio Website
    `;

    const emailData = {
      to: "omkark2223@ternaengg.ac.in",
      from: formData.email,
      subject: `Portfolio Contact: ${formData.subject}`,
      message: emailContent,
      name: formData.name,
    };

    console.log("Contact form submission:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message received successfully! I'll get back to you soon." 
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to send message. Please try again." 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
