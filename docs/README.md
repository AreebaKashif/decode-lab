# AI Customer Support Chatbot

Intelligent customer support chatbot with **Login → Home → Chat** flow.

## New Features (Updated)

- **Login Screen** — User enters Name, Email, optional Order Number
- **Home Screen** — Topic cards including **Damaged Parcel** & **Wrong Parcel**
- **Back button** — Return from chat to home
- **Conversation History** — Side panel with past sessions
- **Customer Support Logo** — Headset branding throughout
- All previous features: Intent recognition, Confidence score, Voice (STT/TTS), Multi-language, FAQ KB

## How to Run

1. Extract the zip
2. Open terminal in the folder
3. Run:
   ```
   python -m http.server 8080
   ```
4. Open browser: **http://localhost:8080**

## Flow

1. Login with your details
2. Choose a topic on the Home screen (or Start Live Chat)
3. Chat with the AI
4. Use **← Back** to return home
5. Open **History** (clock icon) to view past conversations
6. Logout when finished

## Topics Available

- Track Order
- Returns & Refunds
- **Damaged Parcel**
- **Wrong Parcel**
- Payments
- Account Help
- Shipping Info
- Contact Us

## Tech

HTML + CSS + Vanilla JS + Puter.js (free LLM) + Web Speech API
