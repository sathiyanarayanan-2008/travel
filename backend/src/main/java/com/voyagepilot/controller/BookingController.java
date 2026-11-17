package com.voyagepilot.controller;

import com.voyagepilot.dto.ApiResponse;
import com.voyagepilot.dto.BookingRequest;
import com.voyagepilot.model.Booking;
import com.voyagepilot.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(ApiResponse.ok("Booking confirmed [SIMULATED]", booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBooking(@PathVariable String id) {
        Booking booking = bookingService.getBooking(id);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(@PathVariable String id) {
        Booking cancelled = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled [SIMULATED]", cancelled));
    }

    @PostMapping("/{id}/modify")
    public ResponseEntity<ApiResponse<Booking>> modifyBooking(@PathVariable String id, @RequestBody Booking updates) {
        Booking modified = bookingService.modifyBooking(id, updates);
        return ResponseEntity.ok(ApiResponse.ok("Booking modified [SIMULATED]", modified));
    }
}
