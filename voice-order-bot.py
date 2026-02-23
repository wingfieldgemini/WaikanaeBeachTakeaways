"""
Waikanae Beach Takeaways - Voice AI Ordering Bot
Receives Twilio voice webhooks, uses speech-to-text + OpenAI + TTS for phone ordering.
"""
from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
import openai
import os

app = Flask(__name__)

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Conversation state per call
call_states = {}

SYSTEM_PROMPT = """You are a friendly phone ordering assistant for Waikanae Beach Takeaways, a fish & chips shop in Waikanae Beach, New Zealand.

Keep responses SHORT and conversational — this is spoken aloud on a phone call. Max 2-3 sentences per response.

MENU HIGHLIGHTS (mention only what's relevant):
- Fish: Regular $5.80, Battered $6.20, Large Fillet $14.90, Tarakihi $15.50, Gurnard $17.20
- Burgers: Hamburger $7.50, Cheeseburger $8.50, Chicken $9, Fish $10, The Lot $14, Kapiti $15
- Chips: Scoops/Fries S $4.50 L $6.50, Wedges S $5.50 L $7.50, Kumara S $5.50 L $8.50
- Dinner Boxes: Fish & Chips $12, Burger & Chips $13, Mixed Seafood $16
- Family Packs: Small $35 (4 fish, chips, nuggets, scoops, sauce), Large $55
- Kids Packs: $7-9 with juice
- Drinks: Cans $3, Milkshake $6.50, Thick Shake $7.50

FLOW:
1. Greet warmly, ask what they'd like
2. Take their order, confirm items
3. Give total
4. Ask pickup time
5. Ask name
6. Confirm everything: items, total, time, name
7. Say goodbye warmly

RULES:
- Speak naturally, like a real person on the phone
- Use simple language (no jargon)
- If you can't understand, ask them to repeat
- Always confirm the order before finishing
- Be warm and friendly — NZ casual"""


@app.route('/voice', methods=['POST'])
def voice_answer():
    """Initial greeting when call comes in."""
    call_sid = request.form.get('CallSid', '')
    call_states[call_sid] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    response = VoiceResponse()
    gather = Gather(
        input='speech',
        action='/voice/process',
        method='POST',
        speech_timeout='auto',
        language='en-NZ'
    )
    gather.say(
        "Hey there! Welcome to Waikanae Beach Takeaways. What can I get for you today?",
        voice='Polly.Amy',
        language='en-NZ'
    )
    response.append(gather)
    
    # If no input, prompt again
    response.say("Sorry, I didn't catch that. Give us a ring back when you're ready!", voice='Polly.Amy')
    response.hangup()
    
    return Response(str(response), mimetype='text/xml')


@app.route('/voice/process', methods=['POST'])
def voice_process():
    """Process speech input and respond."""
    call_sid = request.form.get('CallSid', '')
    speech_result = request.form.get('SpeechResult', '')
    
    if call_sid not in call_states:
        call_states[call_sid] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
    
    call_states[call_sid].append({"role": "user", "content": speech_result})
    
    # Keep conversation manageable
    if len(call_states[call_sid]) > 15:
        call_states[call_sid] = [call_states[call_sid][0]] + call_states[call_sid][-14:]
    
    try:
        ai_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=call_states[call_sid],
            max_tokens=150,
            temperature=0.7
        )
        reply = ai_response.choices[0].message.content
    except Exception as e:
        reply = "Sorry, I'm having a little trouble. Could you repeat that for me?"
    
    call_states[call_sid].append({"role": "assistant", "content": reply})
    
    # Check if order is complete (look for goodbye signals)
    is_complete = any(phrase in reply.lower() for phrase in ['see you', 'goodbye', 'bye', 'order confirmed', 'we\'ll have it ready'])
    
    response = VoiceResponse()
    
    if is_complete:
        response.say(reply, voice='Polly.Amy', language='en-NZ')
        response.say("Thanks for calling Waikanae Beach Takeaways. See you soon!", voice='Polly.Amy')
        response.hangup()
        # Clean up
        del call_states[call_sid]
    else:
        gather = Gather(
            input='speech',
            action='/voice/process',
            method='POST',
            speech_timeout='auto',
            language='en-NZ'
        )
        gather.say(reply, voice='Polly.Amy', language='en-NZ')
        response.append(gather)
        
        response.say("Sorry, I didn't catch that. Could you say that again?", voice='Polly.Amy')
        response.redirect('/voice/process')
    
    return Response(str(response), mimetype='text/xml')


@app.route('/health', methods=['GET'])
def health():
    return 'OK'


if __name__ == '__main__':
    app.run(port=5051, debug=True)
