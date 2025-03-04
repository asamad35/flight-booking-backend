import { Flight } from '../flights/interfaces/flight.interface';

// Mock data for public flights
export const publicFlights: Flight[] = [
  {
    id: '1',
    destination: 'Mumbai',
    price: 5500,
    airline: 'Air India',
    airlineCode: 'AI',
    airlineLogo: 'air-india-logo.png',
    flightNumber: 'AI202',
    departureAirport: 'DEL',
    arrivalAirport: 'BOM',
    departureTime: '08:00',
    arrivalTime: '10:15',
    departureDate: '2023-12-01',
    duration: '2h 15m',
    durationMinutes: 135,
    stops: 0,
  },
  {
    id: '2',
    destination: 'Bengaluru',
    price: 6200,
    airline: 'IndiGo',
    airlineCode: '6E',
    airlineLogo: 'indigo-logo.png',
    flightNumber: '6E345',
    departureAirport: 'DEL',
    arrivalAirport: 'BLR',
    departureTime: '19:00',
    arrivalTime: '21:45',
    departureDate: '2023-12-15',
    duration: '2h 45m',
    durationMinutes: 165,
    stops: 0,
  },
  {
    id: '3',
    destination: 'Chennai',
    price: 7800,
    airline: 'Vistara',
    airlineCode: 'UK',
    airlineLogo: 'vistara-logo.png',
    flightNumber: 'UK789',
    departureAirport: 'DEL',
    arrivalAirport: 'MAA',
    departureTime: '13:45',
    arrivalTime: '16:30',
    departureDate: '2023-12-20',
    duration: '2h 45m',
    durationMinutes: 165,
    stops: 1,
    stopLocations: ['HYD'],
  },
];

// Function to generate realistic prices based on destination and distance
export const calculatePrice = (
  destination: string,
  passengers: number,
): number => {
  const basePrice =
    destination === 'Mumbai'
      ? 5500
      : destination === 'Bengaluru'
        ? 6200
        : destination === 'Chennai'
          ? 7800
          : destination === 'Hyderabad'
            ? 6500
            : destination === 'Kolkata'
              ? 8000
              : 5000; // Default price
  return basePrice * passengers;
};
