# EcoSense AI — Smart Carbon Footprint Assistant 🌱

An AI-powered environmental assistant that calculates your carbon footprint, analyzes it dynamically, and uses Anthropic's Claude to provide motivational, actionable advice without shaming.

**Vertical:** Carbon Footprint / Environmental Sustainability

## 🏗️ Architecture

```text
┌───────────────┐      JSON Payload      ┌──────────────────┐
│               │ ─────────────────────► │                  │
│ Vanilla JS UI │                        │ FastAPI Server   │
│ (index.html)  │ ◄───────────────────── │ (main.py)        │
│               │    JSON + AI Insights  │                  │
└───────┬───────┘                        └────────┬─────────┘
        │                                         │
        │ Accessible UI                           │
        │ ARIA Labels                             ├──► calculator.py
        │ Canvas Charts                           │    (Emission Rule Engine)
        │ Rate-limited forms                      │
                                                  └──► assistant.py
                                                       (Anthropic Claude API)
```

## 🧠 How the AI Logic Works

The assistant operates on a hybrid decision tree + LLM architecture:
1. **Data Intake**: The `calculator.py` uses fixed, transparent constants from `data/emission_factors.json` to calculate real kg CO2e.
2. **Classification**: Based on the total score, the user is classified into a persona (e.g., "Climate Champion", "High Emitter").
3. **Target Generation**: A realistic weekly reduction goal (kg/week) is generated mathematically targeting a 10% annual reduction.
4. **LLM Orchestration**: The structured data (footprint, highest category, persona) is fed as context to Anthropic's Claude 3.5 Sonnet via `assistant.py`.
5. **Prompt Engineering**: The system prompt forces Claude to use "Motivational Framing" to provide hyper-personalized advice based on the user's highest emitting category, ensuring they are encouraged, never shamed.

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```
3. **Run the Server**
   ```bash
   uvicorn main:app --reload
   # Open http://localhost:8000 in your browser
   ```

## 📊 Assumptions & Emission Factors

All emission factors are stored in `data/emission_factors.json` to keep logic cleanly separated from constants. Key assumptions include:
- Flights: Short haul = 1000km avg, Long haul = 5000km avg.
- Electricity: Global average grid intensity 0.233 kg CO2e/kWh.
- Diet: Yearly values derived from Oxford Martin School standard diet studies (meat-heavy = 3.3t, vegan = 1.5t).

## 💬 Sample Conversation Flow

> **User**: I calculated my footprint and it's mostly transport.
> **EcoSense**: You're an Average Citizen! Aim to reduce your emissions by 4.5 kg CO2e this week. I see transport is your biggest area. Could you try taking the train just once this week or carpooling to work? Small steps make a huge difference! 🌍
