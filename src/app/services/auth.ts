import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private key = 'fakestore_token';
  private token = signal<string | null>(localStorage.getItem(this.key));

  isAuthenticated() { return !!this.token(); }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>('https://fakestoreapi.com/auth/login', {
      username, password
    }).pipe(tap(respuesta => {
      if (!respuesta?.token) throw new Error('La API no devolvió un token.');
      localStorage.setItem(this.key, respuesta.token);
      this.token.set(respuesta.token);
    }));
  }

  logout() {
    localStorage.removeItem(this.key);
    this.token.set(null);
  }
}
