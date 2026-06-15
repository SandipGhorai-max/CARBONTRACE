import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from assistant import generate_persona, generate_weekly_goal

def test_generate_persona_champion():
    assert "Climate Champion" in generate_persona(1.5)

def test_generate_persona_average():
    assert "Average Citizen" in generate_persona(3.5)

def test_generate_persona_high():
    assert "High Emitter" in generate_persona(6.0)

def test_generate_weekly_goal():
    goal = generate_weekly_goal(5.0, "transport")
    # 5 tons = 5000kg. 10% = 500kg. weekly = 500/52 = 9.6
    assert "9.6" in goal
    assert "transport" in goal
