import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@/core/services/http.service';

interface LoginRequest { email: string; password: string; }
interface LoginResponse { token: string; }

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthHttpRepository {
  private readonly http = inject(HttpService);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('login', data);
  }

  register(data: RegisterRequest): Observable<void> {
    return this.http.post<void>('register', data);
  }
}
