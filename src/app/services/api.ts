import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { WeatherResponse } from '../shared/weather.model';
import { WeatherStateService } from './weather.state';

@Injectable({
  providedIn: 'root',
})
export class WeatherApi {
  private httpClient = inject(HttpClient);
  private weatherStateService = inject(WeatherStateService);
  private apiKey: string = (import.meta as any).env.NG_APP_WEATHER_API_KEY || '';
  private baseUrl: string = (import.meta as any).env.NG_APP_WEATHER_API_BASE_URL || '';

  getCurrentWeather(query: string) {
    console.log('Fetching weather for query:', query);
    this.weatherStateService.setLoading(true);
    this.weatherStateService.clearError();

    const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(
      query,
    )}&aqi=no`;

    return this.httpClient.get<WeatherResponse>(url).pipe(
      tap((data) => {
        this.weatherStateService.setCurrentWeather(data);
      }),
      catchError((error) => {
        const errorMessage = error.error?.error?.message || 'Failed to fetch weather data';
        this.weatherStateService.setError(errorMessage);
        console.error('Error fetching weather:', error);
        return of(null);
      }),
      finalize(() => {
        this.weatherStateService.setLoading(false);
      }),
    );
  }

  getForeCastWeather(query: string, days: number = 1) {
    console.log('Fetching forecast for query:', query, 'for days:', days);
    this.weatherStateService.setLoading(true);
    this.weatherStateService.clearError();

    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(
      query,
    )}&days=${days}&aqi=no&alerts=no`;

    return this.httpClient.get<WeatherResponse>(url).pipe(
      tap((data) => {
        this.weatherStateService.setForecastWeather(data);
      }),
      catchError((error) => {
        const errorMessage = error.error?.error?.message || 'Failed to fetch forecast data';
        this.weatherStateService.setError(errorMessage);
        console.error('Error fetching forecast:', error);
        return of(null);
      }),
      finalize(() => {
        this.weatherStateService.setLoading(false);
      }),
    );
  }
}
