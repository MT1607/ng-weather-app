import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

export const NAVIGATOR = new InjectionToken<Navigator | null>('WindowNavigator', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? (globalThis as any).navigator : null;
  },
});

export const GEOLOCATION = new InjectionToken<Geolocation | null>('WindowGeolocation', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? (globalThis as any).navigator?.geolocation : null;
  },
});

export const WINDOW = new InjectionToken<Window | null>('WindowToken', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformBrowser(platformId) ? (globalThis as any).window : null;
  },
});
