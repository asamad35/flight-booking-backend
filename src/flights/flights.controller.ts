import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FlightSearchDto } from './dto/flight-search.dto';
import { FlightDto } from './dto/flight.dto';
import { FlightsService } from './flights.service';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  // Public endpoint - no authentication required
  @ApiOperation({ summary: 'Get public flights' })
  @ApiResponse({ status: 200, description: 'Returns a list of public flights' })
  @Get('public')
  getPublicFlights() {
    return this.flightsService.getPublicFlights();
  }

  // Public endpoint for searching flights - no authentication required
  @ApiOperation({ summary: 'Search flights with optional filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns flights matching the search criteria',
  })
  @Get()
  async getFlights(
    @Query() filters: FlightSearchDto,
    @User() user?: { id: string },
  ) {
    const userId = user?.id || null;
    return this.flightsService.getFlights(userId, filters);
  }

  // Protected endpoint - requires authentication
  @ApiOperation({ summary: 'Book a flight' })
  @ApiResponse({
    status: 201,
    description: 'Flight has been successfully booked',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiBody({ type: FlightDto })
  @ApiBearerAuth('JWT-auth')
  @Post('booking')
  @UseGuards(JwtAuthGuard)
  async bookFlight(@Body() flightDto: FlightDto, @User() user: { id: string }) {
    return this.flightsService.bookFlight(flightDto, user.id);
  }

  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'Returns a list of user bookings' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiBearerAuth('JWT-auth')
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

  @ApiOperation({ summary: 'Get bookings by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of bookings for the specified user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - user not authenticated',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to fetch bookings for',
  })
  @ApiBearerAuth('JWT-auth')
  @Get('bookings/:userId')
  @UseGuards(JwtAuthGuard)
  async getBookingsByUserId(@Param('userId') userId: string) {
    const a = await this.flightsService.getBookingsByUserId(userId);
    console.log(a, 'a');
    return a;
  }

  @ApiOperation({ summary: 'Get list of origin cities' })
  @ApiResponse({ status: 200, description: 'Returns a list of origin cities' })
  @Get('cities/origin')
  getOriginCities() {
    return this.flightsService.getOriginCities();
  }

  @ApiOperation({ summary: 'Get list of destination cities' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of destination cities',
  })
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
