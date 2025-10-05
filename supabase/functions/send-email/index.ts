import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const generateOfferLetterHTML = (internData: any) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .letter-container { max-width: 800px; margin: 20px auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e90ff 0%, #0066cc 50%, #003d99 100%); height: 120px; position: relative; overflow: hidden; }
        .logo-section { position: absolute; top: 20px; left: 30px; z-index: 10; }
        .company-logo { color: white; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .company-tagline { color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; }
        .letter-title { text-align: center; color: #0066cc; font-size: 28px; font-weight: bold; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; }
        .date-section { text-align: right; margin-bottom: 30px; color: #666; font-size: 14px; }
        .greeting { font-size: 16px; margin-bottom: 20px; color: #333; }
        .main-content { font-size: 15px; line-height: 1.8; margin-bottom: 30px; }
        .details-box { background: linear-gradient(135deg, #f8f9ff 0%, #e6f2ff 100%); border-left: 4px solid #0066cc; padding: 25px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .details-title { color: #0066cc; font-size: 18px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .detail-item { display: flex; margin-bottom: 10px; align-items: center; }
        .detail-label { font-weight: bold; color: #333; min-width: 120px; }
        .detail-label::after { content: ':'; margin-left: 5px; }
        .detail-value { color: #0066cc; font-weight: 600; margin-left: 10px; }
        .footer { background: linear-gradient(135deg, #003d99 0%, #0066cc 50%, #1e90ff 100%); color: white; padding: 30px; text-align: center; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .contact-info { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="letter-container">
        <div class="header">
            <div class="logo-section">
                <div class="company-logo">RORIRI</div>
                <div class="company-tagline">SOFTWARE SOLUTIONS PVT. LTD.</div>
            </div>
        </div>
        <div class="content">
            <h1 class="letter-title">Internship Offer Letter</h1>
            <div class="date-section">Date: ${new Date(internData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="greeting">Dear <strong>${internData.name}</strong>,</div>
            <div class="main-content">
                <p>We are delighted to offer you an internship position at <strong>Roriri Software Solutions Pvt. Ltd</strong>. After careful consideration of your qualifications and potential, we believe you will be a valuable addition to our dynamic team.</p>
            </div>
            <div class="details-box">
                <div class="details-title">Internship Details</div>
                <div class="detail-item"><span class="detail-label">Position</span><span class="detail-value">${internData.position}</span></div>
                <div class="detail-item"><span class="detail-label">Start Date</span><span class="detail-value">${new Date(internData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                <div class="detail-item"><span class="detail-label">Duration</span><span class="detail-value">${internData.duration}</span></div>
                <div class="detail-item"><span class="detail-label">Location</span><span class="detail-value">${internData.location}</span></div>
                <div class="detail-item"><span class="detail-label">Stipend</span><span class="detail-value">${internData.stipend}</span></div>
            </div>
            <div class="main-content" style="margin-top: 30px;">
                <p>We look forward to welcoming you to the Roriri family!</p>
                <p style="margin-top: 40px;"><strong>Warm regards,</strong></p>
                <p style="margin-top: 20px;"><strong>HR Department</strong></p>
                <p><strong>Roriri Software Solutions Pvt. Ltd</strong></p>
            </div>
        </div>
        <div class="footer">
            <div class="company-name">RORIRI IT PARK</div>
            <div class="contact-info">
                <div>+91 96770 18421</div>
                <div>services@roririsoft.com</div>
                <div>Nallanathapuram, Kalakad- 627 501</div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

const generateCompletionCertificateHTML = (internData: any) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Completion Certificate</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .certificate-container { max-width: 800px; margin: 20px auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e90ff 0%, #0066cc 50%, #003d99 100%); height: 120px; position: relative; overflow: hidden; }
        .logo-section { position: absolute; top: 20px; left: 30px; z-index: 10; }
        .company-logo { color: white; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
        .company-tagline { color: rgba(255,255,255,0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px; text-align: center; }
        .certificate-title { color: #0066cc; font-size: 32px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 3px; }
        .main-text { font-size: 18px; line-height: 1.8; margin-bottom: 30px; color: #333; }
        .intern-name { color: #0066cc; font-size: 28px; font-weight: bold; margin: 20px 0; text-decoration: underline; text-decoration-color: #ffd700; text-underline-offset: 8px; }
        .details-section { background: linear-gradient(135deg, #f8f9ff 0%, #e6f2ff 100%); border-radius: 15px; padding: 30px; margin: 30px 0; text-align: left; }
        .detail-label { font-weight: bold; color: #0066cc; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; }
        .detail-value { color: #333; font-size: 16px; font-weight: 600; margin-bottom: 15px; }
        .footer { background: linear-gradient(135deg, #003d99 0%, #0066cc 50%, #1e90ff 100%); color: white; padding: 30px; text-align: center; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
        .contact-info { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="header">
            <div class="logo-section">
                <div class="company-logo">RORIRI</div>
                <div class="company-tagline">SOFTWARE SOLUTIONS PVT. LTD.</div>
            </div>
        </div>
        <div class="content">
            <h1 class="certificate-title">Certificate of Completion</h1>
            <div class="main-text">This is to certify that</div>
            <div class="intern-name">${internData.name}</div>
            <div class="main-text">has successfully completed the internship program at<br><strong>Roriri Software Solutions Pvt. Ltd</strong></div>
            <div class="details-section">
                <div class="detail-label">Position</div>
                <div class="detail-value">${internData.position}</div>
                <div class="detail-label">Duration</div>
                <div class="detail-value">${internData.duration}</div>
                <div class="detail-label">Start Date</div>
                <div class="detail-value">${new Date(internData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="detail-label">Completion Date</div>
                <div class="detail-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
        </div>
        <div class="footer">
            <div class="company-name">RORIRI IT PARK</div>
            <div class="contact-info">
                <div>+91 96770 18421</div>
                <div>services@roririsoft.com</div>
                <div>Nallanathapuram, Kalakad- 627 501</div>
            </div>
        </div>
    </div>
</body>
</html>`;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { type, internData } = await req.json();

    if (!internData || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type and internData" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const htmlContent = type === "offer"
      ? generateOfferLetterHTML(internData)
      : generateCompletionCertificateHTML(internData);

    const subject = type === "offer"
      ? `Internship Offer Letter - ${internData.position} Position at Roriri Software Solutions`
      : `Internship Completion Certificate - ${internData.name}`;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error: "Email service not configured. Please contact the administrator.",
          details: "RESEND_API_KEY is missing"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Roriri Software Solutions <onboarding@resend.dev>",
        to: [internData.email],
        subject: subject,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.id,
        message: `${type === "offer" ? "Offer letter" : "Completion certificate"} sent successfully`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to send email",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
