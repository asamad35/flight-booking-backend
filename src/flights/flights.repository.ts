import { Injectable, NotFoundException } from '@nestjs/common';
import { Flight } from './interfaces/flight.interface';
import { FlightDto } from './dto/flight.dto';
import { BookingDto } from './dto/booking.dto';
import { FlightSearchDto } from './dto/flight-search.dto';
import { SortOption, BookingStatus } from './utils/flight.enums';
import { generateMockFlights } from './utils/flight.utils';
import {
  mockBookings,
  generateBookingId,
  createMockBooking,
} from '../data/mock-booking';
import { calculatePrice } from '../data/mock-flights';
import { hashSensitiveData } from '../utils/crypto.utils';

@Injectable()
export class FlightsRepository {
  private readonly flights: Flight[] = [];
  private readonly bookings: BookingDto[] = mockBookings;
  private bookingId = 1;

  async findAll(filters?: FlightSearchDto): Promise<Flight[]> {
    // Generate mock flights if none exist or if filters are provided
    let flights =
      this.flights.length > 0 && !filters
        ? this.flights
        : generateMockFlights(
            filters?.from || 'Delhi',
            filters?.to || 'Mumbai',
            filters?.departureDate || new Date().toISOString().split('T')[0],
            20,
          );

    // Apply filtering and sorting if provided
    if (filters) {
      // Apply price filtering - both formats supported
      if (
        filters.priceRange &&
        Array.isArray(filters.priceRange) &&
        filters.priceRange.length === 2
      ) {
        // Frontend format: priceRange as [min, max]
        const [min, max] = filters.priceRange;
        flights = flights.filter(
          (flight) => flight.price >= min && flight.price <= max,
        );
      } else if (
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined
      ) {
        // Legacy format: separate minPrice and maxPrice
        flights = flights.filter((flight) => {
          if (
            filters.minPrice !== undefined &&
            flight.price < filters.minPrice
          ) {
            return false;
          }
          if (
            filters.maxPrice !== undefined &&
            flight.price > filters.maxPrice
          ) {
            return false;
          }
          return true;
        });
      }

      // Apply airline filtering - both formats supported
      if (
        filters.airlines &&
        typeof filters.airlines === 'object' &&
        !Array.isArray(filters.airlines)
      ) {
        // Frontend format: airlines as {delta: true, united: false, ...}
        const airlinesConfig = filters.airlines as Record<string, boolean>;
        flights = flights.filter((flight) => {
          if (!flight.airline) return false;
          const airlineLowerCase = flight.airline
            .toLowerCase()
            .replace(' ', '');
          const airlineKey =
            airlineLowerCase === 'jetblue' ? 'jetBlue' : airlineLowerCase;
          return airlinesConfig[airlineKey] === true;
        });
      } else if (
        filters.airlineList &&
        Array.isArray(filters.airlineList) &&
        filters.airlineList.length > 0
      ) {
        // Alternative format: airlineList as string[]
        flights = flights.filter(
          (flight) =>
            flight.airline && filters.airlineList?.includes(flight.airline),
        );
      }

      // Apply stops filtering - both formats supported
      if (filters.stops && typeof filters.stops === 'object') {
        // Frontend format: stops as {direct: true, oneStop: false, ...}
        const stopsConfig = filters.stops as {
          direct: boolean;
          oneStop: boolean;
          multiStop: boolean;
        };

        flights = flights.filter((flight) => {
          if (flight.stops === 0 && !stopsConfig.direct) return false;
          if (flight.stops === 1 && !stopsConfig.oneStop) return false;
          if (flight.stops >= 2 && !stopsConfig.multiStop) return false;
          return true;
        });
      } else {
        // Legacy format: directOnly and maxStops
        if (filters.directOnly) {
          flights = flights.filter((flight) => flight.stops === 0);
        } else if (filters.maxStops !== undefined) {
          const maxStops = filters.maxStops;
          flights = flights.filter(
            (flight) =>
              typeof flight.stops === 'number' && flight.stops <= maxStops,
          );
        }
      }

      // Apply departure time filtering
      if (filters.departureTime && typeof filters.departureTime === 'object') {
        const timeConfig = filters.departureTime as {
          morning: boolean;
          afternoon: boolean;
          evening: boolean;
        };

        flights = flights.filter((flight) => {
          if (!flight.departureTime) return true;

          const hour = parseInt(flight.departureTime.split(':')[0]);
          const isMorning = hour >= 5 && hour < 12;
          const isAfternoon = hour >= 12 && hour < 17;
          const isEvening = hour >= 17 || hour < 5;

          if (isMorning && !timeConfig.morning) return false;
          if (isAfternoon && !timeConfig.afternoon) return false;
          if (isEvening && !timeConfig.evening) return false;

          return true;
        });
      }

      // Apply sorting
      if (filters.sortBy) {
        flights = this.sortFlights(flights, filters.sortBy);
      }
    }

    return flights;
  }

  async createBooking(
    flightDto: FlightDto,
    userId: string,
  ): Promise<BookingDto> {
    // Generate a unique booking ID
    const bookingId = generateBookingId(this.bookingId++);

    // Calculate price based on destination and number of passengers
    const price = calculatePrice(flightDto.destination, flightDto.passengers);

    const booking = createMockBooking(
      flightDto.flightId || 'unknown',
      userId,
      flightDto.destination,
      flightDto.departureDate,
      flightDto.passengers,
      flightDto.cabinClass?.toString() || 'Economy',
      flightDto.tripType?.toString() || 'OneWay',
      flightDto.passengerDetails || [],
    );

    // Add payment details if provided, hash the CVV
    if (flightDto.paymentDetails) {
      const { cvv, ...safePaymentDetails } = flightDto.paymentDetails;
      booking.paymentDetails = {
        ...safePaymentDetails,
        cvv: hashSensitiveData(cvv),
      };
    }

    this.bookings.push(booking);
    return booking;
  }

  async findUserBookings(userId: string): Promise<BookingDto[]> {
    return this.bookings.filter((booking) => booking.userId === userId);
  }

  async findBookingById(
    bookingId: string,
    userId: string,
  ): Promise<BookingDto> {
    const booking = this.bookings.find(
      (booking) => booking.bookingId === bookingId && booking.userId === userId,
    );

    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    return booking;
  }

  private sortFlights(flightsToSort: Flight[], sortBy: string): Flight[] {
    const sortedFlights = [...flightsToSort];

    switch (sortBy) {
      case SortOption.PriceLowToHigh:
        return sortedFlights.sort((a, b) => a.price - b.price);
      case SortOption.PriceHighToLow:
        return sortedFlights.sort((a, b) => b.price - a.price);
      case SortOption.DurationShortToLong:
        return sortedFlights.sort(
          (a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0),
        );
      case SortOption.DepartureSoonToLate:
        return sortedFlights.sort((a, b) =>
          (a.departureTime || '').localeCompare(b.departureTime || ''),
        );
      case SortOption.DepartureLateToSoon:
        return sortedFlights.sort((a, b) =>
          (b.departureTime || '').localeCompare(a.departureTime || ''),
        );
      default:
        return sortedFlights;
    }
  }
}
