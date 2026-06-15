import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from calculator import calculate_transport, calculate_diet, calculate_energy, generate_footprint_report

def test_calculate_transport_ev():
    data = {
        "car_type": "car_ev",
        "car_km_per_week": "100"
    }
    # 100 * 52 * 0.053 = 275.6
    assert abs(calculate_transport(data) - 275.6) < 0.1

def test_calculate_transport_zero():
    data = {}
    # default car_type is petrol but km is 0
    assert calculate_transport(data) == 0.0

def test_calculate_diet_vegan():
    data = {
        "diet_type": "vegan"
    }
    # 1.5 tons = 1500 kg
    assert calculate_diet(data) == 1500.0

def test_calculate_energy_high():
    data = {
        "electricity_kwh_per_month": "500",
        "gas_kwh_per_month": "200"
    }
    # 500 * 12 * 0.233 = 1398
    # 200 * 12 * 0.183 = 439.2
    # total = 1837.2
    assert abs(calculate_energy(data) - 1837.2) < 0.1

def test_generate_footprint_report():
    data = {
        "car_type": "car_petrol",
        "car_km_per_week": "100",
        "diet_type": "vegetarian",
        "electricity_kwh_per_month": "300",
        "gas_kwh_per_month": "50"
    }
    report = generate_footprint_report(data)
    assert report["total_kg"] > 0
    assert report["total_tons"] > 0
    assert "status" in report
    assert "highest_category" in report
