import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherApi } from './services/api';
import { UnsplashService } from './services/unplash.service';
import { UnsplashState } from './services/unplash.state';
import { WeatherStateService } from './services/weather.state';
import { WeatherDetail } from './weather-detail/weather-detail';
import { WeatherInfo } from './weather-info/weather-info';
import { NAVIGATOR } from './window-token';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherInfo, WeatherDetail, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private navigator = inject(NAVIGATOR);
  private weatherApi = inject(WeatherApi);
  private weatherStateService = inject(WeatherStateService);
  private unplashService = inject(UnsplashService);
  private unplashState = inject(UnsplashState);

  protected readonly title = signal('weather-app');

  protected readonly logoUrl = '/assets/image/logo.svg';
  protected readonly searchIconUrl = '/assets/image/search.svg';
  protected readonly bgImageUrl$ = this.unplashState.backgroundImage$;

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
    this.weatherApi.getCurrentWeather(`${value}`).subscribe({
      next: (data) => {
        console.log('Weather API response:', data);
        this.weatherStateService.setCurrentWeather(data);
        this.weatherStateService.setCityName(data?.location.name || '');
        // Fetch city image after getting city name from weather data
        this.unplashService.getCityImage(data?.location.name || '').subscribe({
          next: (imageData) => {
            this.unplashState.setBackgroundImage(imageData);
          },
          error: (err) => {
            console.error('Error fetching city image:', err);
          },
        });
      },
      error: (err) => {
        console.error('Error fetching weather:', err);
      },
    });
    this.weatherApi.getForeCastWeather(`${value}`, 1).subscribe({
      next: (data) => {
        console.log('Forecast API response:', data);
        this.weatherStateService.setForecastWeather(data);
      },
      error: (err) => {
        console.error('Error fetching forecast:', err);
      },
    });
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
            this.weatherStateService.setCityName(data?.location.name || '');
            // Fetch city image after getting city name from weather data
            this.unplashService.getCityImage(data?.location.name || '').subscribe({
              next: (imageData) => {
                this.unplashState.setBackgroundImage(imageData);
              },
              error: (err) => {
                console.error('Error fetching city image:', err);
              },
            });
          },
          error: (err) => {
            console.error('Error fetching weather:', err);
          },
        });
        this.weatherApi.getForeCastWeather(`${this.lat()}, ${this.lon()}`, 1).subscribe({
          next: (data) => {
            console.log('Forecast API response:', data);
            this.weatherStateService.setForecastWeather(data);
          },
          error: (err) => {
            console.error('Error fetching forecast:', err);
          },
        });
      },
      (error) => {
        console.error('Error getting geolocation', error);
      },
    );
  }
}
