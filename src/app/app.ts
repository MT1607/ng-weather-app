import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherApi } from './services/api';
import { WeatherStateService } from './services/weather.state';
import { WeatherDetail } from './weather-detail/weather-detail';
import { WeatherInfo } from './weather-info/weather-info';
import { NAVIGATOR } from './window-token';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherInfo, WeatherDetail],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private navigator = inject(NAVIGATOR);
  private weatherApi = inject(WeatherApi);
  private weatherStateService = inject(WeatherStateService);

  protected readonly title = signal('weather-app');

  protected readonly logoUrl = '/assets/image/logo.svg';
  protected readonly searchIconUrl = '/assets/image/search.svg';
  protected readonly bgImageUrl = '/assets/image/background.svg';

  private lat = signal<number | null>(null);
  private lon = signal<number | null>(null);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getGeoLocation();
    } else {
      console.log('Run in server environment, skipping geolocation.');
    }
  }

  onSearch(value: string | null): void {
    console.log('Search button clicked', value);
  }

  getGeoLocation(): void {
    if (!this.navigator?.geolocation) {
      console.warn('Geolocation not available');
      return;
    }
    this.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat.set(position.coords.latitude);
        this.lon.set(position.coords.longitude);
        this.weatherApi.getCurrentWeather(`${this.lat()}, ${this.lon()}`).subscribe({
          next: (data) => {
            console.log('Weather API response:', data);
            this.weatherStateService.setCurrentWeather(data);
          },
          error: (err) => {
            console.error('Error fetching weather:', err);
          },
        });
      },
      (error) => {
        console.error('Error getting geolocation', error);
      },
    );
  }
}
