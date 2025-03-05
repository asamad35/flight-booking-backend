import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { FlightsService } from './flights.service';
import { FlightDto } from './dto/flight.dto';
import { FlightSearchDto } from './dto/flight-search.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  // Public endpoint - no authentication required
  @Get('public')
  getPublicFlights() {
    return this.flightsService.getPublicFlights();
  }

  // Public endpoint for searching flights - no authentication required
  @Get()
  async getFlights(
    @Query() filters: FlightSearchDto,
    @User() user?: { id: string },
  ) {
    const userId = user?.id || null;
    return this.flightsService.getFlights(userId, filters);
  }

  // Protected endpoint - requires authentication
  @Post('booking')
  @UseGuards(JwtAuthGuard)
  async bookFlight(@Body() flightDto: FlightDto, @User() user: { id: string }) {
    return this.flightsService.bookFlight(flightDto, user.id);
  }

  @Get('bookings')
  @UseGuards(JwtAuthGuard)
  async getUserBookings(@User() user: { id: string }) {
    return this.flightsService.getUserBookings(user.id);
  }

  @Get('bookings/:id')
  @UseGuards(JwtAuthGuard)
  async getBookingById(@Param('id') id: string, @User() user: { id: string }) {
    return this.flightsService.getBookingById(id, user.id);
  }

  @Get('cities/origin')
  getOriginCities() {
    return this.flightsService.getOriginCities();
  }

  @Get('cities/destination')
  getDestinationCities() {
    return this.flightsService.getDestinationCities();
  }

  @Get('bookings/:id/ticket')
  @UseGuards(JwtAuthGuard)
  async generateTicket(
    @Param('id') bookingId: string,
    @User() user: { id: string },
  ) {
    return this.flightsService.generateTicket(bookingId, user.id);
  }
}
