import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CoordsDto } from './dto/coords.dto';
import { DailyForecastDto } from './dto/forecast.dto';
import { WeeklySummaryDto } from './dto/summary.dto';
import { lastValueFrom, map, catchError } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(private readonly http: HttpService) {}

  private calculatePvEnergy(radiationSum: number): number {
    const MJ_TO_KWH = 0.2778;
    const PLANT_POWER = 2.5;
    const PANEL_EFFICIENCY = 0.2;
    const exposureKwh = radiationSum * MJ_TO_KWH;
    const energy = PLANT_POWER * exposureKwh * PANEL_EFFICIENCY;
    return parseFloat(energy.toFixed(2));
  }

  private async fetchRaw(coords: CoordsDto) {
    const params = {
      latitude: coords.lat,
      longitude: coords.lng,
      daily: [
        'weathercode',
        'temperature_2m_min',
        'temperature_2m_max',
        'shortwave_radiation_sum',
      ].join(','),
      hourly: ['pressure_msl'].join(','),
      timezone: 'Europe/Warsaw',
    };
    try {
      return await lastValueFrom(
        this.http.get('', { params }).pipe(
          map((resp) => resp.data),
          catchError(() => {
            throw new HttpException('Error from external API', 502);
          }),
        ),
      );
    } catch (e) {
      throw e;
    }
  }

  async getForecast(coords: CoordsDto): Promise<DailyForecastDto[]> {
    const data = await this.fetchRaw(coords);
    return data.daily.time.map((date: string, i: number) => ({
      date,
      weatherCode: data.daily.weathercode[i],
      tempMin: data.daily.temperature_2m_min[i],
      tempMax: data.daily.temperature_2m_max[i],
      energy: this.calculatePvEnergy(data.daily.shortwave_radiation_sum[i]),
    }));
  }

  async getSummary(coords: CoordsDto): Promise<WeeklySummaryDto> {
    const data = await this.fetchRaw(coords);
    const pressures = data.hourly.pressure_msl;
    const exposures = data.daily.shortwave_radiation_sum.map((v) => v * 0.2778); // MJ/m² -> kWh/m²
    const avg = (arr: number[]) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const rainDays = data.daily.weathercode.filter((code) => code >= 51).length;

    return {
      avgPressure: parseFloat(avg(pressures).toFixed(2)),
      avgExposure: parseFloat(avg(exposures).toFixed(2)),
      minTemp: Math.min(...data.daily.temperature_2m_min),
      maxTemp: Math.max(...data.daily.temperature_2m_max),
      summary: rainDays >= 4 ? 'z opadami' : 'bez opadów',
    };
  }
}
