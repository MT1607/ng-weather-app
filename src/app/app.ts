import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { LeafletModule } from '@bluehalo/ngx-leaflet';

import { WeatherApi } from './services/api';
import { WeatherStateService } from './services/weather.state';
import { WeatherDetail } from './weather-detail/weather-detail';
import { WeatherInfo } from './weather-info/weather-info';
import { NAVIGATOR } from './window-token';

@Component({
  selector: 'app-root',
  standalone: true, // Đảm bảo có standalone nếu dùng Angular 17+
  imports: [RouterOutlet, WeatherInfo, WeatherDetail],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private navigator = inject(NAVIGATOR);
  private weatherApi = inject(WeatherApi);
  private weatherStateService = inject(WeatherStateService);

  protected readonly title = signal('weather-app');
  protected readonly logoUrl = 'assets/image/logo.svg';
  protected readonly searchIconUrl = 'assets/image/search.svg';

  protected isBrowser: boolean = false;
  private map: any; // L.Map instance
  private marker: any;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getGeoLocation();
      this.initLeaflet();
    }
  }

  onSearch(value: string | null): void {
    console.log('city', value);
    this.weatherApi.getForeCastWeather(`${value}`, 7).subscribe({
      next: (data) => {
        if (data?.location) {
          this.updateMapCenter(data.location.lat, data.location.lon);
        }
      },
    });
  }

  getGeoLocation(): void {
    if (!this.isBrowser || !this.navigator?.geolocation) return;

    this.navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.weatherApi.getForeCastWeather(`${latitude}, ${longitude}`, 7).subscribe({
        next: (data) => {
          if (data?.location) {
            this.updateMapCenter(data.location.lat, data.location.lon);
          }
        },
      });
    });
  }

  private updateMapCenter(lat: number, lon: number) {
    if (this.map) {
      this.map.setView([lat, lon], 6);

      if (this.marker) {
        this.marker.setLatLng([lat, lon]); // Di chuyển marker đến vị trí mới
      } else {
        import('leaflet').then((m) => {
          const L = (m as any).default || m;
          this.marker = L.marker([lat, lon]).addTo(this.map);
        });
      }
    }
  }

  private initLeaflet() {
    if (this.isBrowser) {
      import('leaflet').then((m) => {
        const L = (m as any).default || m;
        this.map = L.map('map', {
          zoomControl: true,
          attributionControl: false, // Ẩn bớt chữ cho giống Windy
        }).setView([21.0285, 105.8542], 5);

        // LỚP 1: Ảnh vệ tinh 2D (Base)
        const satelliteLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
          },
        ).addTo(this.map);

        // LỚP 2: Đường biên giới và tên quốc gia (Overlay)
        // Lớp này sẽ giúp hiện rõ biên giới màu trắng/xám đè lên ảnh vệ tinh
        const borderLayer = L.tileLayer(
          'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          {
            opacity: 0.8, // Chỉnh độ đậm nhạt của đường biên giới
            maxZoom: 19,
          },
        ).addTo(this.map);

        // Thêm Marker vị trí
        this.marker = L.circleMarker([21.0285, 105.8542], {
          radius: 6,
          fillColor: '#00ff00', // Màu xanh lá neon cho nổi bật
          color: '#fff',
          weight: 2,
          fillOpacity: 1,
        }).addTo(this.map);
      });
    }
  }
}
