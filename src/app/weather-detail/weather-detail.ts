import { Component, inject } from '@angular/core';
import { WeatherStateService } from '../services/weather.state';

@Component({
  selector: 'app-weather-detail',
  imports: [],
  templateUrl: './weather-detail.html',
  styleUrl: './weather-detail.css',
})
export class WeatherDetail {
  private weatherStateService = inject(WeatherStateService);

  protected readonly hotIcon = '/assets/image/hot.svg';
  protected readonly coldIcon = '/assets/image/cold.svg';
  protected readonly rainIcon = '/assets/image/rain.svg';
  protected readonly windIcon = '/assets/image/wind.svg';
  protected readonly cloudIcon = '/assets/image/weather-icon.svg';
  protected readonly snowIcon = '/assets/image/snow.svg';

  protected readonly isLoading = this.weatherStateService.isLoading;
  protected readonly error = this.weatherStateService.error;
  protected readonly weatherData = this.weatherStateService.currentWeather;

  protected readonly conditionText = () =>
    this.weatherData()?.current?.condition?.text ?? 'Unknown';
  protected readonly humidity = () => this.weatherData()?.current?.humidity ?? 0;
  protected readonly windKph = () => this.weatherData()?.current?.wind_kph ?? 0;
  protected readonly cloud = () => this.weatherData()?.current?.cloud ?? 0;
  protected readonly feelslikeC = () => this.weatherData()?.current?.feelslike_c ?? 0;
}
