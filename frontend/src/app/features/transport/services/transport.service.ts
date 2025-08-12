import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { BaseApiService } from "../../../core/services/base-api.service"
import type { Transport, TransportRequest } from "../../../core/models/transport.model"

@Injectable({
  providedIn: "root",
})
export class TransportService extends BaseApiService {
  private readonly endpoint = "/catalog/transport"

  getTransports(): Observable<{ data: Transport[] }> {
    return this.get<{ data: Transport[] }>(`${this.endpoint}/list`)
  }

  getTransport(id: number): Observable<{ data: Transport }> {
    return this.get<{ data: Transport }>(`${this.endpoint}/${id}`)
  }

  createTransport(transport: TransportRequest): Observable<{ data: Transport }> {
    return this.post<{ data: Transport }>(`${this.endpoint}`, transport)
  }

  updateTransport(id: number, transport: TransportRequest): Observable<{ data: Transport }> {
    return this.put<{ data: Transport }>(`/transport/${id}`, transport)
  }

  toggleTransportStatus(id: number): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`${this.endpoint}/${id}`)
  }
}
