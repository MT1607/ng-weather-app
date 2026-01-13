import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { WeatherStateService } from '../services/weather.state';
import { HourlyForecast } from '../shared/weather.model';

@Component({
  selector: 'app-weather-detail',
  imports: [CommonModule],
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
  protected readonly forecastData = this.weatherStateService.forecastWeather;

  protected readonly conditionText = () =>
    this.weatherData()?.current?.condition?.text ?? 'Unknown';
  protected readonly humidity = () => this.weatherData()?.current?.humidity ?? 0;
  protected readonly windKph = () => this.weatherData()?.current?.wind_kph ?? 0;
  protected readonly cloud = () => this.weatherData()?.current?.cloud ?? 0;
  protected readonly feelslikeC = () => this.weatherData()?.current?.feelslike_c ?? 0;
  protected readonly maxTempC = () =>
    Math.round(this.forecastData()?.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? 0);
  protected readonly minTempC = () =>
    Math.round(this.forecastData()?.forecast?.forecastday?.[0]?.day?.mintemp_c ?? 0);

  /**
   * Filter hourly forecast to show only specific hours: 6:00, 9:00, 12:00, 15:00, 18:00, 21:00, 24:00
   */
  protected readonly filteredHourlyForecast = computed(() => {
    const hours = this.forecastData()?.forecast?.forecastday?.[0]?.hour ?? [];
    const targetHours = [6, 9, 12, 15, 18, 21, 0]; // 0 represents 24:00 (midnight)

    return hours.filter((hourData: HourlyForecast) => {
      const hour = new Date(hourData.time).getHours();
      return targetHours.includes(hour);
    });
  });

  /**
   * Get weather icon URL based on condition code
   */
  protected getWeatherIcon(condition: any): string {
    if (!condition) return this.snowIcon;

    const conditionCode = condition.code;
    // Map condition codes to icon paths - adjust based on your available icons
    const iconMap: { [key: number]: string } = {
      1183: this.rainIcon, // Light rain
      1153: this.rainIcon, // Light drizzle
      1189: this.rainIcon, // Moderate rain
      1009: this.cloudIcon, // Overcast
      1003: this.cloudIcon, // Partly cloudy
      1006: this.cloudIcon, // Cloudy
    };

    return iconMap[conditionCode] || this.cloudIcon;
  }

  /**
   * Format time from datetime string to HH:MM format
   */
  protected formatTime(timeStr: string): string {
    try {
      const date = new Date(timeStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  }
}
