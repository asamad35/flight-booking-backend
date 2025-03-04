import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsBoolean,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CabinClass, TripType, SortOption } from '../utils/flight.enums';

// This matches the frontend's FlightFilterState plus search parameters
export class FlightSearchDto {
  // Basic search parameters (from URL)
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsDateString()
  @IsOptional()
  departureDate?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  returnDate?: string | null;

  @IsString()
  @IsOptional()
  passengers?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  cabinClass?: CabinClass | string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  tripType?: TripType | string;

  // Price filter
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  priceRange?: [number, number];

  // Sort option
  @IsString()
  @IsOptional()
  sortBy?: SortOption | string;

  // Airlines filter
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  airlines?: { [key: string]: boolean };

  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return Array.isArray(value) ? value : [value].filter(Boolean);
    }
  })
  airlineList?: string[];

  // Stops filter
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  stops?: {
    direct: boolean;
    oneStop: boolean;
    multiStop: boolean;
  };

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  directOnly?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  maxStops?: number;

  // Departure time filter
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  departureTime?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };

  // Legacy format for price range
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  maxPrice?: number;
}
