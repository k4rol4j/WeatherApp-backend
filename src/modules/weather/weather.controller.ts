import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CoordsDto } from './dto/coords.dto';
import { DailyForecastDto } from './dto/forecast.dto';
import { WeeklySummaryDto } from './dto/summary.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly svc: WeatherService) {}

  @Get('forecast')
  forecast(@Query() coords: CoordsDto): Promise<DailyForecastDto[]> {
    return this.svc.getForecast(coords);
  }

  @Get('summary')
  summary(@Query() coords: CoordsDto): Promise<WeeklySummaryDto> {
    return this.svc.getSummary(coords);
  }
}
