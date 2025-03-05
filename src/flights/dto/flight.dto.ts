import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CabinClass, TripType } from '../utils/flight.enums';

// Create nested DTOs for complex objects
class PassengerDetailsDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  idNumber: string;
}

class PaymentDetailsDto {
  @IsString()
  cardNumber: string;

  @IsString()
  expiryDate: string;

  @IsString()
  cvv: string;

  @IsString()
  nameOnCard: string;
}

export class FlightDto {
  // Basic flight information
  @IsDateString()
  departureDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  // Matches frontend parameters
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNumber()
  passengers: number; // Number of passengers for booking

  @IsEnum(CabinClass, { message: 'Invalid cabin class' })
  cabinClass?: CabinClass | string;

  @IsEnum(TripType, { message: 'Invalid trip type' })
  tripType?: TripType | string;

  // For booking reference
  @IsString()
  flightId?: string;

  // Passenger details
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerDetailsDto)
  passengerDetails?: PassengerDetailsDto[];

  // Payment information
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
