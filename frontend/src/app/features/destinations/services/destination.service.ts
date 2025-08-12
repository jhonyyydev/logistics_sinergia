import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { BaseApiService } from "../../../core/services/base-api.service"
import type { Destination, DestinationRequest } from "../../../core/models/destination.model"

@Injectable({
  providedIn: "root",
})
export class DestinationService extends BaseApiService {
  private readonly endpoint = "/catalog/destination"

  getDestinations(): Observable<{ data: Destination[] }> {
    return this.get<{ data: Destination[] }>(`${this.endpoint}/list`)
  }

  getDestination(id: number): Observable<{ data: Destination }> {
    return this.get<{ data: Destination }>(`${this.endpoint}/${id}`)
  }

  createDestination(destination: DestinationRequest): Observable<{ data: Destination }> {
    return this.post<{ data: Destination }>(`${this.endpoint}`, destination)
  }

  updateDestination(id: number, destination: DestinationRequest): Observable<{ data: Destination }> {
    return this.put<{ data: Destination }>(`${this.endpoint}/${id}`, destination)
  }

  deleteDestination(id: number): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`${this.endpoint}/${id}`)
  }
}
