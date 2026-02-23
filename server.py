"""
Waikanae Beach Takeaways - Combined SMS + Voice AI Server
Single Flask server handling both SMS and Voice ordering via Twilio + OpenAI.
Deploy to Railway/Render, then point Twilio webhooks here.
"""
from flask import Flask, request, Response
from twilio.twiml.messaging_response import MessagingResponse
from twilio.twiml.voice_response import VoiceResponse, Gather
import openai
import os
import json
from datetime import datetime

app = Flask(__name__)

TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')

_client = None

def get_client():
    global _client
    if _client is None:
        _client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    return _client

# State management
sms_conversations = {}
voice_conversations = {}

MENU_CONTEXT = """FULL MENU WITH PRICES:

FISH: Fish Regular $5.80 | Battered Fish $6.20 | Crumbed Fish (ask) | Large Fish Fillet $14.90 | Tarakihi $15.50 | Gurnard $17.20 | Snapper (ask)

SEAFOOD: Oyster $2.80 | Mussel $3.00 | Prawn $3.80 | Scallop $3.50 | Crab Stick $3.00 | Squid Ring $3.50 | Paua Pattie $4.90 | Fish Cake $2.70 | Shrimp Pattie $2.50

BURGERS: Hamburger $7.50 | Cheeseburger $8.50 | Chicken Burger $9.00 | Fish Burger $10.00 | Vege Burger $9.50 | Bacon & Egg $9.00 | BLT $9.00 | Steak Burger $10.00 | Hawaiian $10.00 | The Lot $14.00 | Kapiti Burger $15.00

TOASTIES: Ham & Cheese $5.50 | Cheese & Onion $5.00 | Ham Cheese & Onion $6.50 | Ham Cheese Onion & Tomato $7.50

CHIPS & FRIES: Scoops S $4.50 L $6.50 | Fries S $4.50 L $6.50 | Wedges S $5.50 L $7.50 | Kumara Chips S $5.50 L $8.50 | Onion Rings S $5.00 L $7.50 | Garlic Bread $5.50 | Cheese Roll $2.20

OTHER: Spring Roll $3.00 | Dim Sim $2.60 | Corn Dog $3.00 | Chicken Nuggets 6pc $6.00 12pc $10.50 | Battered Sausage $4.00 | Battered Hot Dog $3.00 | Hot Dog plain $2.00 | Pineapple Ring $3.00 | Egg $2.00 | Potato Fritter $2.50 | Hash Brown $2.00 | Donuts $2.50

DINNER BOXES: Fish & Chips $12.00 | Burger & Chips $13.00 | Chicken Tenders & Chips $13.00 | Mixed Seafood & Chips $16.00 | Oyster & Chips $14.00

KIDS PACKS (w/ juice): Fish Bites & Chips $8.00 | Nuggets & Chips $8.00 | Hot Dog & Chips $7.00 | Mini Burger & Chips $9.00

FAMILY PACKS: Small $35.00 (4 fish, chips, 6 nuggets, 4 scoops, sauce) | Large $55.00 (6 fish, large chips, 12 nuggets, 6 scoops, onion rings, sauce)

SAUCES: $1.50 each - Tomato, Aioli, Sweet Chilli, BBQ, Tartare

DRINKS: Can $3.00 | Water $3.00 | Juice Box $3.00 | Milkshake $6.50 | Thick Shake $7.50
Flavours: Chocolate, Strawberry, Vanilla, Banana, Caramel, Lime, Blue Heaven

OPENING HOURS:
Mon: Closed | Tue: 11:30-2pm & 4-8pm | Wed: Closed | Thu: 11:30-2pm & 4-8pm | Fri: 11:30-2pm & 4-8pm | Sat: 12-3pm & 4-8pm | Sun: 12-3pm & 4-8pm

ADDRESS: 40 Rangihiroa Street, Waikanae Beach
PHONE: 042 938 332"""

SMS_SYSTEM = f"""You are the SMS ordering assistant for Waikanae Beach Takeaways.

{MENU_CONTEXT}

RULES:
- Keep messages SHORT (SMS character limits)
- Friendly, casual NZ tone
- Use 1-2 emojis max per message
- Calculate totals accurately
- Flow: take order → confirm items + total → ask pickup time → ask name → confirm everything
- End with: "Order confirmed! See you at [time] 🐟 40 Rangihiroa St, Waikanae Beach"
- If outside hours, mention hours and suggest ordering for next open time"""

VOICE_SYSTEM = f"""You are a friendly phone ordering assistant for Waikanae Beach Takeaways.

{MENU_CONTEXT}

RULES:
- Keep responses to 2-3 SHORT sentences (this is spoken aloud)
- Speak naturally like a real person
- NZ casual and warm
- If you can't understand, ask to repeat
- Flow: greet → take order → confirm + total → pickup time → name → final confirm
- Always confirm before finishing"""


def get_ai_response(messages, max_tokens=300):
    try:
        response = get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None


# ========== SMS ENDPOINTS ==========

@app.route('/sms', methods=['POST'])
def sms_reply():
    from_number = request.form.get('From', '')
    body = request.form.get('Body', '').strip()
    
    if from_number not in sms_conversations:
        sms_conversations[from_number] = [
            {"role": "system", "content": SMS_SYSTEM}
        ]
    
    sms_conversations[from_number].append({"role": "user", "content": body})
    
    # Keep last 20 messages
    if len(sms_conversations[from_number]) > 21:
        sms_conversations[from_number] = [sms_conversations[from_number][0]] + sms_conversations[from_number][-20:]
    
    reply = get_ai_response(sms_conversations[from_number])
    if not reply:
        reply = "Sorry, quick tech hiccup! Ring us on 042 938 332 to order 📞"
    
    sms_conversations[from_number].append({"role": "assistant", "content": reply})
    
    resp = MessagingResponse()
    resp.message(reply)
    return str(resp)


# ========== VOICE ENDPOINTS ==========

@app.route('/voice', methods=['POST'])
def voice_answer():
    call_sid = request.form.get('CallSid', '')
    voice_conversations[call_sid] = [
        {"role": "system", "content": VOICE_SYSTEM}
    ]
    
    response = VoiceResponse()
    gather = Gather(
        input='speech',
        action='/voice/process',
        method='POST',
        speech_timeout=3,
        timeout=10,
        language='en-AU'
    )
    gather.say(
        "Hey there! Welcome to Waikanae Beach Takeaways. What can I get for you today?",
        voice='Polly.Amy'
    )
    response.append(gather)
    # If no input, try again once
    gather2 = Gather(
        input='speech',
        action='/voice/process',
        method='POST',
        speech_timeout=3,
        timeout=10,
        language='en-AU'
    )
    gather2.say("Hello? Just let me know what you'd like to order.", voice='Polly.Amy')
    response.append(gather2)
    response.say("No worries, give us a ring back when you're ready! Bye!", voice='Polly.Amy')
    response.hangup()
    
    return Response(str(response), mimetype='text/xml')


@app.route('/voice/process', methods=['POST'])
def voice_process():
    call_sid = request.form.get('CallSid', '')
    speech_result = request.form.get('SpeechResult', '')
    
    if call_sid not in voice_conversations:
        voice_conversations[call_sid] = [
            {"role": "system", "content": VOICE_SYSTEM}
        ]
    
    voice_conversations[call_sid].append({"role": "user", "content": speech_result})
    
    if len(voice_conversations[call_sid]) > 15:
        voice_conversations[call_sid] = [voice_conversations[call_sid][0]] + voice_conversations[call_sid][-14:]
    
    reply = get_ai_response(voice_conversations[call_sid], max_tokens=150)
    if not reply:
        reply = "Sorry, could you repeat that for me?"
    
    voice_conversations[call_sid].append({"role": "assistant", "content": reply})
    
    is_complete = any(phrase in reply.lower() for phrase in ['see you', 'goodbye', 'bye', 'order confirmed', "we'll have it ready"])
    
    response = VoiceResponse()
    
    if is_complete:
        response.say(reply, voice='Polly.Amy', language='en-NZ')
        response.say("Thanks for calling! See you soon!", voice='Polly.Amy')
        response.hangup()
        if call_sid in voice_conversations:
            del voice_conversations[call_sid]
    else:
        gather = Gather(
            input='speech',
            action='/voice/process',
            method='POST',
            speech_timeout=3,
            timeout=10,
            language='en-AU'
        )
        gather.say(reply, voice='Polly.Amy')
        response.append(gather)
        # Retry once if no input
        gather2 = Gather(
            input='speech',
            action='/voice/process',
            method='POST',
            speech_timeout=3,
            timeout=8,
            language='en-AU'
        )
        gather2.say("Sorry, I didn't catch that. Could you say that again?", voice='Polly.Amy')
        response.append(gather2)
        response.say("No worries, call back anytime! Bye!", voice='Polly.Amy')
        response.hangup()
    
    return Response(str(response), mimetype='text/xml')


# ========== HEALTH CHECK ==========

@app.route('/', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return json.dumps({
        "status": "ok",
        "service": "Waikanae Beach Takeaways AI Ordering",
        "active_sms": len(sms_conversations),
        "active_calls": len(voice_conversations),
        "timestamp": datetime.now().isoformat()
    }), 200, {'Content-Type': 'application/json'}


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port)

