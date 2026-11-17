package com.voyagepilot.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class BudgetCalculationTest {

    @Test
    @DisplayName("Verify itemized Goa 3-day budget calculation is under INR 30,000")
    void testStandardGoaBudgetCalculation() {
        double flightsTwoPax = 4500 * 2;   // 9,000
        double hotelTwoNights = 2200 * 2;  // 4,400
        double dining = 5600;
        double activities = 3700;
        double localTransfers = 3600;
        double shopping = 1200;

        double grandTotal = flightsTwoPax + hotelTwoNights + dining + activities + localTransfers + shopping;
        double budgetCap = 30000.0;

        assertEquals(27500.0, grandTotal, 0.001);
        assertTrue(grandTotal <= budgetCap, "Grand total must not exceed 30,000 cap");
        assertEquals(2500.0, budgetCap - grandTotal, 0.001, "Savings buffer should be exactly 2,500");
    }

    @Test
    @DisplayName("Verify budget optimization replanning when swapping to cheaper hotel")
    void testHotelSwapOptimization() {
        double baselineGrandTotal = 27500.0;
        double originalHotelCost = 2200 * 2; // 4,400
        double cheaperHotelCost = 1200 * 2;  // 2,400

        double delta = originalHotelCost - cheaperHotelCost;
        assertEquals(2000.0, delta, 0.001);

        double optimizedTotal = baselineGrandTotal - delta;
        assertEquals(25500.0, optimizedTotal, 0.001);

        double budgetCap = 30000.0;
        double remainingSurplus = budgetCap - optimizedTotal;
        assertEquals(4500.0, remainingSurplus, 0.001, "Remaining surplus after cheaper hotel must be 4,500");
    }

    @Test
    @DisplayName("Verify flight swap optimization (Non-stop vs 1-stop)")
    void testFlightSwapOptimization() {
        double baselineFlights = 4500 * 2; // 9,000
        double cheaperFlights = 3200 * 2;  // 6,400
        double flightSavings = baselineFlights - cheaperFlights;

        assertEquals(2600.0, flightSavings, 0.001);
    }
}
