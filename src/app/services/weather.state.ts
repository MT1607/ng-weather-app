import { computed, Injectable, signal } from '@angular/core';
import { WeatherResponse } from '../shared/weather.model';

export interface WeatherState {
  current: WeatherResponse | null;
  forecast: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  lastSearchQuery: string | null;
  history: WeatherResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherStateService {
  // Signals for state management
  private weatherState = signal<WeatherState>({
    current: null,
    forecast: null,
    loading: false,
    error: null,
    lastSearchQuery: null,
    history: [],
  });

  // Public read-only signals
  readonly currentWeather = computed(() => this.weatherState().current);
  readonly forecastWeather = computed(() => this.weatherState().forecast);
  readonly isLoading = computed(() => this.weatherState().loading);
  readonly error = computed(() => this.weatherState().error);
  readonly lastSearchQuery = computed(() => this.weatherState().lastSearchQuery);
  readonly weatherHistory = computed(() => this.weatherState().history);

  /**
   * Set the current weather data
   */
  setCurrentWeather(weather: WeatherResponse | null): void {
    console.log('Setting current weather in state service:', weather);
    const state = this.weatherState();
    const updatedHistory = weather
      ? [weather, ...state.history.slice(0, 9)] // Keep last 10 searches
      : state.history;

    this.weatherState.set({
      ...state,
      current: weather,
      error: null,
      lastSearchQuery: weather?.location.name ?? null,
      history: updatedHistory,
    });
  }

  /**
   * Set the forecast weather data
   */
  setForecastWeather(weather: WeatherResponse | null): void {
    console.log('Setting forecast weather in state service:', weather);
    const state = this.weatherState();
    const updatedHistory = weather
      ? [weather, ...state.history.slice(0, 9)] // Keep last 10 searches
      : state.history;

    this.weatherState.set({
      ...state,
      current: weather,
      forecast: weather,
      error: null,
      lastSearchQuery: weather?.location.name ?? null,
      history: updatedHistory,
    });
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this.weatherState.update((state) => ({
      ...state,
      loading,
    }));
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this.weatherState.update((state) => ({
      ...state,
      error,
      loading: false,
    }));
  }

  /**
   * Clear all state
   */
  clearState(): void {
    this.weatherState.set({
      current: null,
      forecast: null,
      loading: false,
      error: null,
      lastSearchQuery: null,
      history: [],
    });
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.weatherState.update((state) => ({
      ...state,
      error: null,
    }));
  }

  /**
   * Get weather by index from history
   */
  getFromHistory(index: number): WeatherResponse | null {
    const history = this.weatherState().history;
    return index >= 0 && index < history.length ? history[index] : null;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.weatherState.update((state) => ({
      ...state,
      history: [],
    }));
  }

  /**
   * Get current state snapshot (use sparingly, prefer signals)
   */
  getStateSnapshot(): WeatherState {
    return this.weatherState();
  }
}
