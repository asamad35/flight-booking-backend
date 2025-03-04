// Export enums for use in other files
export enum CabinClass {
  Economy = 'Economy',
  Business = 'Business',
  FirstClass = 'FirstClass',
}

export enum TripType {
  OneWay = 'OneWay',
  RoundTrip = 'RoundTrip',
}

export enum SortOption {
  PriceLowToHigh = 'PriceLowToHigh',
  PriceHighToLow = 'PriceHighToLow',
  DurationShortToLong = 'DurationShortToLong',
  DurationLongToShort = 'DurationLongToShort',
  DepartureSoonToLate = 'DepartureSoonToLate',
  DepartureLateToSoon = 'DepartureLateToSoon',
}

// This matches the frontend's FlightFilterState plus search parameters
export class FlightSearchDto {
  // Basic search parameters (from URL)
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string | null;
  passengers?: string; // Changed to string to match frontend
  cabinClass?: CabinClass | string; // Added string option for compatibility
  tripType?: TripType | string; // Added string option for compatibility

  // Price filter can be in two formats:
  priceRange?: [number, number]; // Changed to match frontend's array format

  // Sort option
  sortBy?: SortOption | string; // Added string option for compatibility

  // Airlines filter can be in two formats:
  airlines?: {
    [key: string]: boolean;
  };
  airlineList?: string[]; // Alternative format

  // Stops filter can be in two formats:
  stops?: {
    direct: boolean;
    oneStop: boolean;
    multiStop: boolean;
  };
  directOnly?: boolean;
  maxStops?: number;

  // Departure time filter
  departureTime?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };

  // Legacy format for price range
  minPrice?: number;
  maxPrice?: number;
}
