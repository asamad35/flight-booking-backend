import { BookingStatus, CabinClass, TripType } from '../utils/flight.enums';

export interface BookingDto {
  id: string;
  userId: string;
  flightDetails: {
    destination: string;
    departureDate: string;
    returnDate?: string;
  };
  passengers: number;
  status: BookingStatus;
  price: number;
  createdAt: string;
  passengerDetails?: {
    fullName: string;
    phoneNumber: string;
    idNumber: string;
  }[];
  paymentDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
  bookingId: string;
  flightId: string;
  bookingDate: string;
  totalPrice: number;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: CabinClass | string;
  tripType: TripType | string;
  returnFlightId?: string;
  returnDepartureDate?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
}
