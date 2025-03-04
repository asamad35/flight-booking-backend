/**
 * Enums for flight-related constants
 */

// This file contains all flight-related enums used across the application

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

export enum BookingStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
}

export enum FlightTimeOfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  Night = 'Night',
}

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  DebitCard = 'DebitCard',
  NetBanking = 'NetBanking',
  UPI = 'UPI',
}

export enum AirlineCode {
  AI = 'Air India',
  UK = 'Vistara',
  SG = 'SpiceJet',
  G8 = 'GoAir',
  I5 = 'AirAsia India',
  '6E' = 'IndiGo',
}

export enum Airline {
  DELTA = 'Delta',
  UNITED = 'United',
  AMERICAN = 'American',
  SPIRIT = 'Spirit',
  JET_BLUE = 'JetBlue',
}

export enum StopType {
  DIRECT = 'direct',
  ONE_STOP = 'oneStop',
  MULTI_STOP = 'multiStop',
}

export enum DepartureTime {
  MORNING = 'morning', // 5-12
  AFTERNOON = 'afternoon', // 12-17
  EVENING = 'evening', // 17-5
}
