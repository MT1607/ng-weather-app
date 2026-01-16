import { TestBed } from '@angular/core/testing';
import { WeatherCondition } from '../shared/weather.model';
import { WeatherIconService } from './weather-icon.service';

describe('WeatherIconService', () => {
  let service: WeatherIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map sunny condition correctly', () => {
    const condition: WeatherCondition = {
      text: 'Sunny',
      icon: 'test',
      code: 1000,
    };
    expect(service.getIconPath(condition, 1 as number)).toBe('Sunny');
  });

  it('should map rainy condition correctly', () => {
    const condition: WeatherCondition = {
      text: 'Light rain',
      icon: 'test',
      code: 1186,
    };
    expect(service.getIconPath(condition)).toBe('Rain');
  });

  it('should map snowy condition correctly', () => {
    const condition: WeatherCondition = {
      text: 'Heavy snow',
      icon: 'test',
      code: 1222,
    };
    expect(service.getIconPath(condition)).toBe('Snow');
  });

  it('should return Sunny as default for undefined condition', () => {
    expect(service.getIconPath(undefined, 1 as number)).toBe('Sunny');
  });

  it('should return Clear-night for night time', () => {
    expect(service.getIconPath(undefined, 0 as number)).toBe('Clear-night');
  });

  it('should map thunderstorm condition correctly', () => {
    const condition: WeatherCondition = {
      text: 'Thunderstorm',
      icon: 'test',
      code: 1273,
    };
    expect(service.getIconPath(condition)).toBe('Rain&Thunderstorm');
  });
});
