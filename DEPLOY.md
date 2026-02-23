# Waikanae Beach Takeaways - AI Ordering Deployment

## Architecture
- **Website**: GitHub Pages (static) — wingfieldgemini.github.io/WaikanaeBeachTakeaways
- **AI Server**: Railway (Flask + Gunicorn) — handles SMS + Voice
- **AI**: OpenAI GPT-4o-mini
- **Phone**: Twilio — +1 (910) 405-7473

## 3 Ordering Channels
1. **Website chat widget** — built into the site (demo mode, no API needed)
2. **SMS** — text the Twilio number, AI handles conversation
3. **Voice** — call the Twilio number, AI takes order by phone

## Deploy to Railway

1. Go to https://railway.app — sign in with GitHub
2. New Project → Deploy from GitHub repo → select `WaikanaeBeachTakeaways`
3. Add environment variables:
   - `OPENAI_API_KEY` = (your OpenAI key)
   - `TWILIO_ACCOUNT_SID` = (your Twilio SID)
   - `TWILIO_AUTH_TOKEN` = (your Twilio auth token)
4. Deploy — Railway gives you a URL like `https://waikanae-xyz.up.railway.app`

## Configure Twilio Webhooks

After deploy, go to Twilio Console → Phone Numbers → +19104057473:
- **SMS webhook**: `https://YOUR-RAILWAY-URL/sms` (POST)
- **Voice webhook**: `https://YOUR-RAILWAY-URL/voice` (POST)

## Twilio Credentials
- Account SID: (stored in env vars)
- Auth Token: (stored in env vars)
- Phone: +19104057473
- Phone SID: PNd9b3ffa06c20d21a5806e78a449bed64

## Cost
- Twilio: ~$1.50/mo (number) + ~$0.0075/SMS + ~$0.015/min voice
- OpenAI: ~$0.15/1M input tokens, ~$0.60/1M output tokens (GPT-4o-mini)
- Railway: Free tier (500 hours/mo)
- **Estimated total: $10-15/mo for a small takeaway shop's volume**
