import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// export interface UnsplashImage {
//     id: string;
//     url: string;
//     photographer: string;
//     photographerUrl: string;
// }

@Injectable({
  providedIn: 'root',
})
export class UnsplashState {
  private backgroundImage = new BehaviorSubject<string | null>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);

  backgroundImage$ = this.backgroundImage.asObservable();
  isLoading$ = this.isLoading.asObservable();
  error$ = this.error.asObservable();

  constructor() {}

  setBackgroundImage(image: string): void {
    console.log('Setting background image in UnsplashState:', image);
    this.backgroundImage.next(image);
    this.error.next(null);
  }

  setLoading(loading: boolean): void {
    this.isLoading.next(loading);
  }

  setError(error: string | null): void {
    this.error.next(error);
  }

  clearBackground(): void {
    this.backgroundImage.next(null);
  }

  getBackgroundImage(): string | null {
    console.log('Getting background image from UnsplashState:', this.backgroundImage.value);
    return this.backgroundImage.value;
  }
}
