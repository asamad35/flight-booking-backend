import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';
import { UserPayload } from '../guards/jwt-auth.guard';

interface FlightDto {
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

@Controller('flights')
export class FlightsController {
  // Public endpoint - no authentication required
  @Get('public')
  getPublicFlights() {
    return {
      flights: [
        { id: 1, destination: 'New York', price: 350 },
        { id: 2, destination: 'London', price: 500 },
        { id: 3, destination: 'Tokyo', price: 900 },
      ],
    };
  }

  // Protected endpoint - requires authentication
  @UseGuards(JwtAuthGuard)
  @Get()
  getFlights(@Req() request: Request) {
    // Access the authenticated user information
    const user = request['user'] as UserPayload;

    return {
      message: `Flights for user: ${user.email}`,
      flights: [
        {
          id: 1,
          destination: 'New York',
          price: 350,
          departureDate: '2024-09-15',
        },
        {
          id: 2,
          destination: 'London',
          price: 500,
          departureDate: '2024-10-20',
        },
        {
          id: 3,
          destination: 'Tokyo',
          price: 900,
          departureDate: '2024-11-05',
        },
      ],
    };
  }

  // Protected endpoint - requires authentication
  @UseGuards(JwtAuthGuard)
  @Post('book')
  bookFlight(@Body() flightDto: FlightDto, @Req() request: Request) {
    const user = request['user'] as UserPayload;

    return {
      message: 'Flight booked successfully',
      booking: {
        id: Math.floor(Math.random() * 1000),
        user: user.email,
        ...flightDto,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
      },
    };
  }
}
