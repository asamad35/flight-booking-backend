import { Injectable } from '@nestjs/common';
import { Flight } from './interfaces/flight.interface';
import { FlightsRepository } from './flights.repository';
import { FlightDto } from './dto/flight.dto';
import { BookingDto } from './dto/booking.dto';
import { FlightSearchDto } from './dto/flight-search.dto';
import { indianCities } from '../data/mock-cities';
import { publicFlights } from '../data/mock-flights';

@Injectable()
export class FlightsService {
  constructor(private flightsRepository: FlightsRepository) {}

  getOriginCities() {
    return { cities: indianCities };
  }

  getDestinationCities() {
    return { cities: indianCities };
  }

  getPublicFlights(): { flights: Flight[] } {
    return { flights: publicFlights };
  }

  async getFlights(
    userId: string | null,
    filters?: FlightSearchDto,
  ): Promise<{ flights: Flight[] }> {
    // Get flights with more detailed information
    const flights = await this.flightsRepository.findAll(filters);
    return { flights };
  }

  async bookFlight(
    flightDto: FlightDto,
    userId: string,
  ): Promise<{ booking: BookingDto }> {
    // Process the flight booking
    const booking = await this.flightsRepository.createBooking(
      flightDto,
      userId,
    );
    return { booking };
  }

  async getUserBookings(userId: string): Promise<{ bookings: BookingDto[] }> {
    const bookings = await this.flightsRepository.findUserBookings(userId);
    return { bookings };
  }

  async getBookingById(
    bookingId: string,
    userId: string,
  ): Promise<{ booking: BookingDto }> {
    const booking = await this.flightsRepository.findBookingById(
      bookingId,
      userId,
    );
    return { booking };
  }

  async generateTicket(
    bookingId: string,
    userId: string,
  ): Promise<{ ticketDetails: any }> {
    // Get the booking first
    const booking = await this.flightsRepository.findBookingById(
      bookingId,
      userId,
    );

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Generate ticket details based on the booking
    const ticketDetails = {
      ticketNumber: `TKT-${booking.bookingId}`,
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      passengerDetails: booking.passengerDetails,
      flightDetails: {
        airline: booking.airline,
        flightNumber: booking.flightNumber,
        from: booking.from,
        to: booking.to,
        departureDate: booking.departureDate,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        cabin: booking.cabinClass,
      },
      boardingInstructions: {
        checkInTime: '2 hours before departure',
        boardingGate: 'To be announced',
        baggageAllowance: booking.cabinClass === 'Economy' ? '15kg' : '30kg',
        boardingTime: '30 minutes before departure',
      },
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingId}`,
      status: booking.status || 'Confirmed',
    };

    return { ticketDetails };
  }
}
