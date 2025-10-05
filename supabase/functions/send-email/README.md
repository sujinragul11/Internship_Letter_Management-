# Send Email Edge Function

This Supabase Edge Function handles sending internship offer letters and completion certificates via email using the Resend API.

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref prriwnxtcqsnfblqycag
```

### 4. Get a Resend API Key

1. Sign up for a free account at [resend.com](https://resend.com)
2. Navigate to API Keys in your dashboard
3. Create a new API key
4. Copy the API key

### 5. Set the Secret in Supabase

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

Or set it via the Supabase Dashboard:
1. Go to your project settings
2. Navigate to Edge Functions > Secrets
3. Add a new secret: `RESEND_API_KEY` with your Resend API key

### 6. Deploy the Function

```bash
supabase functions deploy send-email
```

## Testing the Function

Once deployed, the function will be available at:
```
https://prriwnxtcqsnfblqycag.supabase.co/functions/v1/send-email
```

You can test it using curl:

```bash
curl -X POST https://prriwnxtcqsnfblqycag.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "type": "offer",
    "internData": {
      "name": "John Doe",
      "email": "test@example.com",
      "position": "Software Developer Intern",
      "startDate": "2025-11-01",
      "duration": "3 months",
      "location": "Remote",
      "stipend": "$500/month",
      "date": "2025-10-05"
    }
  }'
```

## Function Details

### Endpoint
- **URL**: `https://prriwnxtcqsnfblqycag.supabase.co/functions/v1/send-email`
- **Method**: POST
- **Auth**: Requires Supabase anon key in Authorization header

### Request Body
```json
{
  "type": "offer" | "completion",
  "internData": {
    "name": "string",
    "email": "string",
    "position": "string",
    "startDate": "string (ISO date)",
    "duration": "string",
    "location": "string",
    "stipend": "string",
    "date": "string (ISO date)"
  }
}
```

### Response
```json
{
  "success": true,
  "messageId": "string",
  "message": "string"
}
```

## Troubleshooting

### Function not found (404)
- Make sure you've deployed the function: `supabase functions deploy send-email`

### Email not configured error
- Verify the RESEND_API_KEY secret is set correctly
- Check the Resend API key is valid

### Email sending fails
- Check the Resend dashboard for delivery logs
- Verify the recipient email is valid
- Make sure your Resend account is verified

## Alternative: Using the Node.js Backend

If you prefer not to use the Edge Function, you can use the Node.js backend in the `server/` directory:

1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your email credentials
4. Start the server: `node index.js`

The frontend will automatically fall back to the Node.js backend if configured.
