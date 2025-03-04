import { BookingDto } from '../flights/dto/booking.dto';
import { BookingStatus } from '../flights/utils/flight.enums';

// Empty array for bookings
export const mockBookings: BookingDto[] = [];

// Helper to generate a unique booking ID
export const generateBookingId = (counter: number): string => {
  // Format: FLT-YYYYMMDD-XXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const bookingNumber = String(counter).padStart(4, '0');

  return `FLT-${year}${month}${day}-${bookingNumber}`;
};

// Create a mock booking with sample data
export const createMockBooking = (
  flightId: string,
  userId: string,
  destination: string,
  departureDate: string,
  passengers: number,
  cabinClass: string,
  tripType: string,
  passengerDetails: any[] = [],
): BookingDto => {
  const bookingId = generateBookingId(mockBookings.length + 1);
  const price = 5000 * passengers; // Sample price calculation

  const booking: BookingDto = {
    id: bookingId,
    bookingId: bookingId,
    userId: userId,
    flightId: flightId,
    bookingDate: new Date().toISOString(),
    departureDate: departureDate,
    totalPrice: price,

    // Flight details
    from: 'Delhi',
    to: destination,
    departureTime: '09:00',
    arrivalTime: '11:30',
    duration: '2h 30m',
    stops: 0,
    airline: 'Air India',
    flightNumber: 'AI505',
    cabinClass: cabinClass,
    tripType: tripType,

    // Legacy structure support
    flightDetails: {
      destination: destination,
      departureDate: departureDate,
      returnDate: undefined,
    },
    passengers: passengers,
    price: price,
    createdAt: new Date().toISOString(),
    status: BookingStatus.Confirmed,
    passengerDetails: passengerDetails,
  };

  return booking;
};
