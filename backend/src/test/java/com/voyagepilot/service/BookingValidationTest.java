package com.voyagepilot.service;

import com.voyagepilot.dto.BookingRequest;
import com.voyagepilot.repository.BookingRepository;
import com.voyagepilot.repository.FlightOfferRepository;
import com.voyagepilot.repository.HotelOfferRepository;
import com.voyagepilot.repository.TripRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;

public class BookingValidationTest {

    @Test
    @DisplayName("Booking must throw IllegalArgumentException if confirmed=false")
    void testBookingExplicitConfirmationRequired() {
        BookingRepository bookingRepo = Mockito.mock(BookingRepository.class);
        TripRepository tripRepo = Mockito.mock(TripRepository.class);
        FlightOfferRepository flightRepo = Mockito.mock(FlightOfferRepository.class);
        HotelOfferRepository hotelRepo = Mockito.mock(HotelOfferRepository.class);

        BookingService service = new BookingService(bookingRepo, tripRepo, flightRepo, hotelRepo);

        BookingRequest unconfirmedRequest = new BookingRequest();
        unconfirmedRequest.setTripId("TRIP-GOA-001");
        unconfirmedRequest.setConfirmed(false); // Explicit confirmation omitted

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.createBooking(unconfirmedRequest);
        });

        assertTrue(ex.getMessage().contains("requires explicit user confirmation"));
    }
}
