import { CabinClass, TripType } from '../utils/flight.enums';

export class FlightDto {
  // Basic flight information
  destination: string;
  departureDate: string;
  returnDate?: string;

  // Matches frontend parameters
  from?: string;
  to?: string;
  passengers: number; // Number of passengers for booking
  cabinClass?: CabinClass | string;
  tripType?: TripType | string;

  // For booking reference
  flightId?: string;

  // Passenger details
  passengerDetails?: {
    fullName: string;
    phoneNumber: string;
    idNumber: string;
  }[];

  // Payment information
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
}
