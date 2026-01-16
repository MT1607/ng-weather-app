import { Injectable } from '@angular/core';
import { WeatherCondition } from '../shared/weather.model';

export interface IconMapping {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class WeatherIconService {
  // Map weather condition text to SVG file names
  private iconMap: IconMapping = {
    // Sunny conditions
    sunny: 'Sunny',
    'partly cloudy': 'Partly-cloudy',
    cloudy: 'Cloudy',
    overcast: 'Cloudy',
    'partly cloudy with sun': 'Cloudy-clear at times',
    clear: 'Sunny',

    // Night conditions
    'clear night': 'Clear-night',
    'partly cloudy night': 'Partly-cloudy-night',
    'cloudy night': 'Cloudy',

    // Rain conditions
    'light drizzle': 'Drizzle',
    drizzle: 'Drizzle',
    'light rain': 'Rain',
    'moderate rain': 'Rain',
    'heavy rain': 'Heavy-rain',
    rain: 'Rain',
    'light rain shower': 'Drizzle',
    'rain shower': 'Scatterad-showers',
    'heavy rain shower': 'Heavy-rain',
    'scattered showers': 'Scatterad-showers',

    // Rain and sun
    'patchy rain nearby': 'Rain&Sun',
    'light rain with sun': 'Rain&Sun',
    'rain and sun': 'Rain&Sun',

    // Drizzle and sun
    'patchy drizzle nearby': 'Drizzle&Sun',
    'light drizzle with sun': 'Drizzle&Sun',
    'drizzle and sun': 'Drizzle&Sun',

    // Thunderstorm
    'thundery outbreaks possible': 'Sever-thunderstorm',
    thunderstorm: 'Rain&Thunderstorm',
    'heavy thunderstorm': 'Sever-thunderstorm',
    'scattered thunderstorm': 'Scatterad-thunderstorm',

    // Snow conditions
    'light snow': 'Snow',
    snow: 'Snow',
    'heavy snow': 'Snow',
    blizzard: 'Blizzard',
    'blowing snow': 'Blowing-snow',
    sleet: 'Sleet',
    'scattered snow showers': 'Snow',

    // Hail
    hail: 'Hail',

    // Fog
    fog: 'Fog',
    mist: 'Fog',
  };

  getIconPath(condition: WeatherCondition | undefined, isDay?: number): string {
    if (!condition) {
      return 'Sunny';
    }

    const conditionText = condition.text.toLowerCase().trim();

    // Check for exact match first
    for (const [key, icon] of Object.entries(this.iconMap)) {
      if (conditionText.includes(key)) {
        return icon;
      }
    }

    // Default to sunny during day (1), clear at night (0)
    return isDay === 0 ? 'Clear-night' : 'Sunny';
  }
}
