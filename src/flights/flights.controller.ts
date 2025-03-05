import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
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
  async getUserBookings(
    @User() user: { id: string },
    @Headers('x-user-id') userIdHeader?: string,
  ) {
    // If X-User-ID header is present and user is admin, fetch bookings for that user
    // Otherwise fetch for the current user
    const targetUserId = userIdHeader || user.id;
    return this.flightsService.getUserBookings(targetUserId);
  }

  @Get('bookings/:userId')
  @UseGuards(JwtAuthGuard)
  async getBookingsByUserId(@Param('userId') userId: string) {
    const a = await this.flightsService.getBookingsByUserId(userId);
    console.log(a, 'a');
    return a;
  }

  @Get('cities/origin')
  getOriginCities() {
    return this.flightsService.getOriginCities();
  }

  @Get('cities/destination')
  getDestinationCities() {
    return this.flightsService.getDestinationCities();
  }

  // @Get('bookings/:id/ticket')
  // @UseGuards(JwtAuthGuard)
  // async generateTicket(
  //   @Param('id') bookingId: string,
  //   @User() user: { id: string },
  // ) {
  //   return this.flightsService.generateTicket(bookingId, user.id);
  // }
}
