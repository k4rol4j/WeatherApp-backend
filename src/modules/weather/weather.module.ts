import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        baseURL: cs.get<string>('OPEN_METEO_BASE'),
        timeout: cs.get<number>('HTTP_TIMEOUT') || 5000,
      }),
    }),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
