package com.voyagepilot.service;

import com.voyagepilot.dto.BookingRequest;
import com.voyagepilot.model.Booking;
import com.voyagepilot.model.Trip;
import com.voyagepilot.repository.BookingRepository;
import com.voyagepilot.repository.FlightOfferRepository;
import com.voyagepilot.repository.HotelOfferRepository;
import com.voyagepilot.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.Random;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final TripRepository tripRepo;
    private final FlightOfferRepository flightRepo;
    private final HotelOfferRepository hotelRepo;

    public BookingService(BookingRepository bookingRepo,
                          TripRepository tripRepo,
                          FlightOfferRepository flightRepo,
                          HotelOfferRepository hotelRepo) {
        this.bookingRepo = bookingRepo;
        this.tripRepo = tripRepo;
        this.flightRepo = flightRepo;
        this.hotelRepo = hotelRepo;
    }

    public Booking createBooking(BookingRequest request) {
        if (!request.isConfirmed()) {
            throw new IllegalArgumentException("Simulated booking requires explicit user confirmation. Set confirmed=true to issue reservation.");
        }

        Optional<Trip> tripOpt = tripRepo.findById(request.getTripId());
        Trip trip = tripOpt.orElseGet(() -> {
            Trip t = new Trip();
            t.setOrigin("Chennai");
            t.setDestination("Goa");
            t.setTravelers(request.getTravelers() > 0 ? request.getTravelers() : 2);
            t.setTotalCost(27500);
            t.setStartDate("2024-11-20");
            t.setEndDate("2024-11-22");
            return t;
        });

        Booking booking = new Booking();
        booking.setTripId(request.getTripId());
        booking.setUserId("demo-traveler-01");
        booking.setBookingReference("BK-VP-2024-" + (1000 + new Random().nextInt(9000)));
        booking.setFlightOfferId(request.getFlightOfferId() != null ? request.getFlightOfferId() : "FL001");
        booking.setHotelOfferId(request.getHotelOfferId() != null ? request.getHotelOfferId() : "HT001");
        booking.setTravelers(request.getTravelers() > 0 ? request.getTravelers() : trip.getTravelers());
        booking.setOrigin(trip.getOrigin());
        booking.setDestination(trip.getDestination());
        booking.setStartDate(trip.getStartDate());
        booking.setEndDate(trip.getEndDate());
        booking.setCancellationPolicy("Free cancellation up to 24h prior to travel.");
        booking.setModificationPolicy("Free date modification subject to supplier seat availability.");
        booking.setSimulated(true);
        booking.setStatus("CONFIRMED");

        // Calculate verified total
        double total = 0;
        if (booking.getFlightOfferId() != null) {
            total += flightRepo.findById(booking.getFlightOfferId())
                    .map(f -> f.getPrice() * booking.getTravelers())
                    .orElse(9000.0);
        }
        if (booking.getHotelOfferId() != null) {
            total += hotelRepo.findById(booking.getHotelOfferId())
                    .map(h -> h.getPricePerNight() * 2) // 2 nights
                    .orElse(4400.0);
        }
        total += 14100; // Activities, dining, and local transfers
        booking.setTotalAmount(total);

        Booking saved = bookingRepo.save(booking);

        // Update trip entity
        trip.setBookingId(saved.getBookingReference());
        trip.setStatus("CONFIRMED");
        trip.setTotalCost(total);
        tripRepo.save(trip);

        return saved;
    }

    public Booking getBooking(String idOrRef) {
        return bookingRepo.findById(idOrRef)
                .or(() -> bookingRepo.findByBookingReference(idOrRef))
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + idOrRef));
    }

    public Booking cancelBooking(String idOrRef) {
        Booking booking = getBooking(idOrRef);
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalArgumentException("Booking " + booking.getBookingReference() + " is already cancelled.");
        }
        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(Instant.now());
        return bookingRepo.save(booking);
    }

    public Booking modifyBooking(String idOrRef, Booking updates) {
        Booking booking = getBooking(idOrRef);
        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalArgumentException("Cannot modify a cancelled booking.");
        }
        if (updates.getTravelers() > 0) {
            booking.setTravelers(updates.getTravelers());
        }
        if (updates.getStartDate() != null) {
            booking.setStartDate(updates.getStartDate());
        }
        if (updates.getEndDate() != null) {
            booking.setEndDate(updates.getEndDate());
        }
        booking.setStatus("MODIFIED");
        booking.setUpdatedAt(Instant.now());
        return bookingRepo.save(booking);
    }
}
