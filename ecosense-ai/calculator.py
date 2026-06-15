"""
Carbon Footprint Calculator Engine
Handles rule-based footprint calculation for transport, diet, and energy.
"""
import json
import os
from typing import Dict, Any

# Load emission factors constants
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "emission_factors.json")
try:
    with open(DATA_FILE, "r") as f:
        EMISSION_FACTORS = json.load(f)
except FileNotFoundError:
    # Fallback default if file is missing during tests
    EMISSION_FACTORS = {
        "transport": {"car_petrol": 0.192, "car_diesel": 0.171, "car_ev": 0.053, "flight_short": 0.150, "flight_long": 0.115, "public_transit": 0.041},
        "diet": {"meat_heavy": 3.3, "mixed": 2.5, "vegetarian": 1.7, "vegan": 1.5},
        "energy": {"electricity_kwh": 0.233, "gas_kwh": 0.183},
        "shopping": {"clothing_item": 15.0, "electronics_item": 50.0}
    }

def calculate_transport(data: Dict[str, Any]) -> float:
    """Calculate transport emissions in kg CO2e."""
    total = 0.0
    car_type = data.get("car_type", "car_petrol")
    car_km = float(data.get("car_km_per_week", 0)) * 52
    total += car_km * EMISSION_FACTORS["transport"].get(car_type, 0.192)
    
    transit_km = float(data.get("transit_km_per_week", 0)) * 52
    total += transit_km * EMISSION_FACTORS["transport"]["public_transit"]
    
    flight_short = float(data.get("flights_short_per_year", 0)) * 1000  # Assume avg 1000km per short flight
    flight_long = float(data.get("flights_long_per_year", 0)) * 5000   # Assume avg 5000km per long flight
    total += flight_short * EMISSION_FACTORS["transport"]["flight_short"]
    total += flight_long * EMISSION_FACTORS["transport"]["flight_long"]
    
    return total

def calculate_diet(data: Dict[str, Any]) -> float:
    """Calculate diet emissions in kg CO2e."""
    diet_type = data.get("diet_type", "mixed")
    # Base yearly factor (tons) converted to kg
    return EMISSION_FACTORS["diet"].get(diet_type, 2.5) * 1000

def calculate_energy(data: Dict[str, Any]) -> float:
    """Calculate home energy emissions in kg CO2e."""
    electricity_kwh = float(data.get("electricity_kwh_per_month", 0)) * 12
    gas_kwh = float(data.get("gas_kwh_per_month", 0)) * 12
    
    total = (electricity_kwh * EMISSION_FACTORS["energy"]["electricity_kwh"]) + \
            (gas_kwh * EMISSION_FACTORS["energy"]["gas_kwh"])
    return total

def calculate_shopping(data: Dict[str, Any]) -> float:
    """Calculate shopping emissions in kg CO2e."""
    clothing = float(data.get("clothing_items_per_month", 0)) * 12
    electronics = float(data.get("electronics_items_per_year", 0))
    
    return (clothing * EMISSION_FACTORS["shopping"]["clothing_item"]) + \
           (electronics * EMISSION_FACTORS["shopping"]["electronics_item"])

def generate_footprint_report(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a comprehensive footprint report."""
    try:
        transport = calculate_transport(user_data)
        diet = calculate_diet(user_data)
        energy = calculate_energy(user_data)
        shopping = calculate_shopping(user_data)
        
        total_kg = transport + diet + energy + shopping
        total_tons = round(total_kg / 1000, 2)
        
        categories = {
            "transport": round(transport, 2),
            "diet": round(diet, 2),
            "energy": round(energy, 2),
            "shopping": round(shopping, 2)
        }
        
        highest_category = max(categories, key=categories.get)
        
        # Determine status
        status = "green"
        if total_tons > 4.0:
            status = "red"
        elif total_tons > 2.0:
            status = "amber"
            
        return {
            "total_kg": round(total_kg, 2),
            "total_tons": total_tons,
            "status": status,
            "categories": categories,
            "highest_category": highest_category,
            "global_average_tons": 4.0,
            "paris_target_tons": 2.0
        }
    except Exception as e:
        # Default fallback in case of errors
        return {
            "error": str(e),
            "total_kg": 0,
            "total_tons": 0,
            "status": "red",
            "categories": {}
        }
