import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WeatherStateService } from '../services/weather.state';

@Component({
  selector: 'app-weather-info',
  imports: [DatePipe],
  templateUrl: './weather-info.html',
  styleUrl: './weather-info.css',
})
export class WeatherInfo {
  private weatherStateService = inject(WeatherStateService);

  protected readonly iconUrl = '/assets/image/weather-icon.svg';

  // Expose signals WITHOUT calling them - they're signal functions
  protected readonly isLoading = this.weatherStateService.isLoading;
  protected readonly error = this.weatherStateService.error;
  protected readonly weatherData = this.weatherStateService.currentWeather;

  protected readonly tempC = computed(() => Math.round(this.weatherData()?.current?.temp_c ?? 0));
  protected readonly nameCity = computed(() => this.weatherData()?.location?.name ?? 'London');
}
