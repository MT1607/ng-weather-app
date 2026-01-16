import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeatherIconService } from '../services/weather-icon.service';
import { WeatherStateService } from '../services/weather.state';

@Component({
  selector: 'app-weather-info',
  imports: [DatePipe],
  templateUrl: './weather-info.html',
  styleUrl: './weather-info.css',
})
export class WeatherInfo {
  private weatherStateService = inject(WeatherStateService);
  private weatherIconService = inject(WeatherIconService);
  private sanitizer = inject(DomSanitizer);

  // Expose signals WITHOUT calling them - they're signal functions
  protected readonly isLoading = this.weatherStateService.isLoading;
  protected readonly error = this.weatherStateService.error;
  protected readonly weatherData = this.weatherStateService.currentWeather;

  protected readonly tempC = computed(() => Math.round(this.weatherData()?.current?.temp_c ?? 0));
  protected readonly nameCity = computed(() => this.weatherData()?.location?.name ?? 'London');

  protected readonly iconUrl = computed((): SafeResourceUrl => {
    const data = this.weatherData();
    const iconName = this.weatherIconService.getIconPath(
      data?.current?.condition,
      data?.current?.is_day,
    );
    if (iconName === 'Sunny' || iconName === 'Clear') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icon/Sunny.svg`);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/icon/${iconName}.svg`);
  });
}
