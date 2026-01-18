import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private baseUrl = 'https://api.unsplash.com/search/photos';
  private accessKey = (import.meta as any).env.NG_APP_UNPLASH_ACCESS_KEY || '';

  constructor(private http: HttpClient) {}

  getCityImage(cityName: string): Observable<string> {
    console.log('Fetching Unsplash image for city:', cityName);
    const params = new HttpParams()
      .set('query', `${cityName} city landscape`)
      .set('orientation', 'landscape')
      .set('per_page', '1')
      .set('client_id', this.accessKey);

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((response) => {
        // Trả về URL ảnh ở độ phân giải full hoặc regular
        console.log('Unsplash API response:', response);
        return response.results[0]?.urls?.full || '';
      }),
    );
  }
}
