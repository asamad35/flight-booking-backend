export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  stopLocations?: string[];
  price: number;
  destination?: string; // For compatibility with the controller's public flights
}
