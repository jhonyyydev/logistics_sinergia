import { Injectable } from "@angular/core"
import type { Observable } from "rxjs"
import { BaseApiService } from "../../../core/services/base-api.service"
import type { Client, ClientRequest } from "../../../core/models/client.model"

@Injectable({
  providedIn: "root",
})
export class ClientService extends BaseApiService {
  private readonly endpoint = "/catalog/client"

  getClients(): Observable<{ data: Client[] }> {
    return this.get<{ data: Client[] }>(`${this.endpoint}/list`)
  }

  getClient(id: number): Observable<{ data: Client }> {
    return this.get<{ data: Client }>(`${this.endpoint}/${id}`)
  }

  updateClient(id: number, client: ClientRequest): Observable<{ data: Client }> {
    return this.put<{ data: Client }>(`${this.endpoint}/${id}`, client)
  }

  toggleClientStatus(id: number): Observable<{ message: string }> {
    return this.delete<{ message: string }>(`${this.endpoint}/${id}`)
  }
}
