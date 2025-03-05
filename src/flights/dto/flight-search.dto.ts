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
import { ApiProperty } from '@nestjs/swagger';

// This matches the frontend's FlightFilterState plus search parameters
export class FlightSearchDto {
  // Basic search parameters (from URL)
  @ApiProperty({
    description: 'Departure city or airport code',
    example: 'NYC',
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'Destination city or airport code',
    example: 'LAX',
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: string;

  @ApiProperty({
    description: 'Date of departure',
    example: '2023-12-25',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  departureDate?: string;

  @ApiProperty({
    description: 'Date of return for round trips',
    example: '2023-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  returnDate?: string | null;

  @ApiProperty({
    description: 'Number of passengers',
    example: '2',
    required: false,
  })
  @IsString()
  @IsOptional()
  passengers?: string;

  @ApiProperty({
    description: 'Cabin class selection',
    enum: CabinClass,
    example: 'ECONOMY',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  cabinClass?: CabinClass | string;

  @ApiProperty({
    description: 'Type of trip',
    enum: TripType,
    example: 'ROUND_TRIP',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value : String(value)))
  tripType?: TripType | string;

  // Price filter
  @ApiProperty({
    description: 'Price range filter [min, max]',
    example: [200, 800],
    required: false,
    type: 'array',
    items: {
      type: 'number',
    },
  })
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
  @ApiProperty({
    description: 'Sort results by',
    enum: SortOption,
    example: 'PRICE_ASC',
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: SortOption | string;

  // Airlines filter
  @ApiProperty({
    description: 'Airlines filter as object with airline names as keys',
    example: { 'American Airlines': true, Delta: false },
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  airlines?: { [key: string]: boolean };

  @ApiProperty({
    description: 'List of airlines to filter by',
    example: ['American Airlines', 'Delta'],
    required: false,
    type: 'array',
    items: {
      type: 'string',
    },
  })
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
  @ApiProperty({
    description: 'Stops filter',
    example: { direct: true, oneStop: false, multiStop: false },
    required: false,
  })
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

  @ApiProperty({
    description: 'Filter for direct flights only',
    example: true,
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  directOnly?: boolean;

  @ApiProperty({
    description: 'Maximum number of stops',
    example: 1,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  )
  maxStops?: number;

  // Departure time filter
  @ApiProperty({
    description: 'Departure time filter',
    example: { morning: true, afternoon: false, evening: false },
    required: false,
  })
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
  @ApiProperty({
    description: 'Minimum price filter',
    example: 200,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  minPrice?: number;

  @ApiProperty({
    description: 'Maximum price filter',
    example: 800,
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  )
  maxPrice?: number;
}
