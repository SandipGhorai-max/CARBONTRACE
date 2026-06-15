"""
Claude AI Logic integration for EcoSense AI.
Includes Carbon Persona Classifier, Reduction Goal Generator, and Motivational Framing.
"""
import os
from typing import Dict, Any, List
from anthropic import Anthropic

# System Prompt defines the AI's personality and goals
SYSTEM_PROMPT = """
You are EcoSense AI, a smart, empathetic, and highly motivational Carbon Footprint Assistant.
Your goal is to help users understand their carbon footprint and reduce it without ever shaming them.
Always frame suggestions as opportunities for positive impact. 

Rules:
1. Always be encouraging and supportive.
2. If the user's footprint > 4 tons, gently suggest high-impact actions.
3. If < 2 tons, celebrate their achievements and suggest next-level milestones.
4. Base your advice on their specific highest emission category.
"""

def get_anthropic_client() -> Anthropic:
    """Initialize Anthropic client. Returns None if key is missing."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_key_here":
        return None
    return Anthropic(api_key=api_key)

def generate_persona(total_tons: float) -> str:
    """Classify user based on total emissions."""
    if total_tons <= 2.0:
        return "Climate Champion 🌍"
    elif total_tons <= 4.0:
        return "Average Citizen 🌱"
    else:
        return "High Emitter (Great Potential for Impact!) ⚡"

def generate_weekly_goal(total_tons: float, highest_category: str) -> str:
    """Suggest a specific kg CO2 target to cut per week."""
    # Aim for a 10% reduction over a year, broken down by week
    yearly_reduction_kg = (total_tons * 1000) * 0.10
    weekly_reduction_kg = round(yearly_reduction_kg / 52, 1)
    
    return f"Aim to reduce your emissions by {weekly_reduction_kg} kg CO2e this week, starting with small changes in your {highest_category} habits!"

def generate_ai_insights(report: Dict[str, Any], chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
    """Generate dynamic insights using Anthropic Claude."""
    total_tons = report.get("total_tons", 0)
    highest_category = report.get("highest_category", "general")
    
    persona = generate_persona(total_tons)
    weekly_goal = generate_weekly_goal(total_tons, highest_category)
    
    client = get_anthropic_client()
    
    if not client:
        # Fallback if no API key is provided
        return {
            "persona": persona,
            "weekly_goal": weekly_goal,
            "ai_message": f"You are a {persona}. {weekly_goal} (Add ANTHROPIC_API_KEY to .env for personalized AI insights!)"
        }
    
    try:
        # Construct the context for Claude
        context = f"User has a footprint of {total_tons} tons. Highest category is {highest_category}. Persona: {persona}."
        
        messages = []
        if chat_history:
            messages.extend(chat_history)
        
        messages.append({
            "role": "user",
            "content": f"Here is my footprint data: {context}. Give me a short, highly motivational 2-sentence piece of advice to reduce my emissions. Do not shame me."
        })
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150,
            temperature=0.7,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        
        ai_text = response.content[0].text
        
        return {
            "persona": persona,
            "weekly_goal": weekly_goal,
            "ai_message": ai_text
        }
    except Exception as e:
        return {
            "persona": persona,
            "weekly_goal": weekly_goal,
            "ai_message": f"Error connecting to AI: {str(e)}"
        }

def handle_chat(message: str, chat_history: List[Dict[str, str]]) -> str:
    """Handle follow-up questions in the chat interface."""
    client = get_anthropic_client()
    if not client:
        return "I am currently running in offline mode. Please configure your ANTHROPIC_API_KEY to chat with me!"
        
    try:
        messages = chat_history.copy()
        messages.append({"role": "user", "content": message})
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=300,
            temperature=0.7,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        
        return response.content[0].text
    except Exception as e:
        return f"Sorry, I encountered an error processing your request: {str(e)}"
