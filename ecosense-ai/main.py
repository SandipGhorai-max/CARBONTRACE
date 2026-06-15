"""
Main FastAPI server for EcoSense AI.
Includes Rate Limiting and static file serving.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import calculator
import assistant

# Load env variables
load_dotenv()

# Setup Rate Limiting (max 20 requests/minute per IP)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="EcoSense AI")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

class CalculationRequest(BaseModel):
    user_data: Dict[str, Any]

class ChatRequest(BaseModel):
    message: str
    chat_history: List[Dict[str, str]] = []

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main frontend application."""
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>EcoSense AI Server Running. Please add static/index.html</h1>"

@app.get("/health")
@limiter.limit("20/minute")
async def health_check(request: Request):
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/calculate")
@limiter.limit("20/minute")
async def calculate_footprint(request: Request, data: CalculationRequest):
    """Calculate the carbon footprint and generate AI insights."""
    try:
        report = calculator.generate_footprint_report(data.user_data)
        
        # Get dynamic AI insights
        insights = assistant.generate_ai_insights(report)
        report["insights"] = insights
        
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
@limiter.limit("20/minute")
async def chat(request: Request, data: ChatRequest):
    """Handle chat conversations with Claude."""
    try:
        reply = assistant.handle_chat(data.message, data.chat_history)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
