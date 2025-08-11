import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import type { RegisterRequestDto } from "../entities/register-request.dto"
import type { RegisterResponseDto } from "../entities/register-response.dto"

@Injectable({
  providedIn: "root",
})
export abstract class AuthDomainService {
  abstract register(request: RegisterRequestDto): Observable<RegisterResponseDto>
}
